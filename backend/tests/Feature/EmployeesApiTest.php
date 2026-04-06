<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class EmployeesApiTest extends TestCase
{
    public function test_it_returns_a_single_employee_by_id(): void
    {
        $this->getJson('/api/employees/1')
            ->assertOk()
            ->assertJsonPath('data.type', 'employees')
            ->assertJsonPath('data.id', '1')
            ->assertJsonPath('data.attributes.codigo_empleado', 'E0001')
            ->assertJsonPath('data.attributes.sueldo', 1200.5)
            ->assertJsonPath('data.attributes.jornada_parcial', false)
            ->assertJsonPath('data.attributes.jornada_parcial_label', 'COMPLETA')
            ->assertJsonPath('data.relationships.provincia_personal.data.id', '1')
            ->assertJsonPath('data.relationships.provincia_personal.meta.nombre', 'Azuay')
            ->assertJsonPath('data.relationships.provincia_laboral.meta.nombre', 'Pichincha')
            ->assertJsonPath('data.relationships.estado.meta.codigo', 1)
            ->assertJsonPath('data.relationships.estado.meta.nombre', 'VIGENTE')
            ->assertJsonPath('meta.module', 'employees')
            ->assertJsonPath('links.self', url('/api/employees/1'));
    }

    public function test_it_returns_not_found_for_an_unknown_employee(): void
    {
        $this->getJson('/api/employees/999')
            ->assertNotFound()
            ->assertJsonPath('meta.error_type', 'RESOURCE_NOT_FOUND')
            ->assertJsonPath('errors.0.code', 'EMPLOYEE_NOT_FOUND')
            ->assertJsonPath('errors.0.source.resource', 'employee');
    }

    public function test_it_returns_a_paginated_employee_list(): void
    {
        $this->getJson('/api/employees?page=1&per_page=1')
            ->assertOk()
            ->assertJsonPath('meta.pagination.current_page', 1)
            ->assertJsonPath('meta.pagination.per_page', 1)
            ->assertJsonPath('meta.pagination.total', 1)
            ->assertJsonPath('meta.module', 'employees')
            ->assertJsonPath('data.0.type', 'employees')
            ->assertJsonPath('data.0.attributes.jornada_parcial', false)
            ->assertJsonPath('data.0.attributes.codigo_empleado', 'E0001')
            ->assertJsonPath('links.first', url('/api/employees?page=1&per_page=1'))
            ->assertJsonPath('links.next', null);
    }

    public function test_it_filters_employees_by_search_term(): void
    {
        $this->insertEmployee([
            'id' => 2,
            'codigo_empleado' => 'E0002',
            'nombres' => 'Bruno',
            'apellidos' => 'Mora',
            'cedula' => '1234567890',
            'email' => 'bruno@example.com',
            'cargo' => 'Disenador',
            'departamento' => 'Marketing',
        ]);

        $this->getJson('/api/employees?search=Bruno')
            ->assertOk()
            ->assertJsonPath('meta.pagination.total', 1)
            ->assertJsonPath('data.0.attributes.nombres', 'Bruno');
    }

    public function test_it_sorts_employees_by_name_in_ascending_order(): void
    {
        $this->insertEmployee([
            'id' => 2,
            'codigo_empleado' => 'E0002',
            'nombres' => 'Bruno',
            'apellidos' => 'Mora',
            'cedula' => '1234567890',
            'email' => 'bruno@example.com',
        ]);

        $this->getJson('/api/employees?sort_by=nombres&sort_dir=asc&per_page=10')
            ->assertOk()
            ->assertJsonPath('data.0.attributes.nombres', 'Ana')
            ->assertJsonPath('data.1.attributes.nombres', 'Bruno');
    }

    public function test_it_rejects_an_incoherent_employee_state(): void
    {
        $payload = $this->validPayload([
            'codigo_empleado' => 'E0002',
            'cedula' => '1234567890',
            'email' => 'nuevo@example.com',
            'estado_codigo' => 1,
            'estado_nombre' => 'RETIRADO',
        ]);

        $this->postJson('/api/employees', $payload)
            ->assertStatus(422)
            ->assertJsonPath('meta.error_type', 'VALIDATION_ERROR')
            ->assertJsonPath('errors.0.code', 'VALIDATION_ESTADO_CODIGO_INVALID')
            ->assertJsonPath('errors.0.detail', 'El estado codigo y el estado nombre deben ser coherentes entre si.')
            ->assertJsonPath('errors.0.source.field', 'estado_codigo');
    }

    public function test_it_rejects_duplicate_employee_identity_fields(): void
    {
        $payload = $this->validPayload([
            'codigo_empleado' => 'E0001',
            'cedula' => '0123456789',
            'email' => 'duplicado@example.com',
        ]);

        $this->postJson('/api/employees', $payload)
            ->assertStatus(422)
            ->assertJsonPath('meta.error_type', 'VALIDATION_ERROR')
            ->assertJsonPath('errors.0.code', 'VALIDATION_CODIGO_EMPLEADO_UNIQUE')
            ->assertJsonPath('errors.1.code', 'VALIDATION_CEDULA_UNIQUE');
    }

    public function test_it_returns_translated_validation_errors_for_invalid_payloads(): void
    {
        $payload = $this->validPayload([
            'codigo_empleado' => 'AB-1',
            'cedula' => 'ABC',
            'telefono' => '12A',
            'fecha_nacimiento' => now()->addDay()->toDateString(),
            'fecha_ingreso' => '1990-01-01',
            'sueldo' => 0,
        ]);

        $this->postJson('/api/employees', $payload)
            ->assertStatus(422)
            ->assertJsonPath('meta.error_type', 'VALIDATION_ERROR')
            ->assertJsonFragment(['code' => 'VALIDATION_CODIGO_EMPLEADO_SIZE'])
            ->assertJsonFragment(['code' => 'VALIDATION_CODIGO_EMPLEADO_ALPHA_NUM'])
            ->assertJsonFragment(['code' => 'VALIDATION_CEDULA_DIGITS'])
            ->assertJsonFragment(['code' => 'VALIDATION_TELEFONO_DIGITS_BETWEEN'])
            ->assertJsonFragment(['code' => 'VALIDATION_FECHA_NACIMIENTO_BEFORE'])
            ->assertJsonFragment(['code' => 'VALIDATION_FECHA_INGRESO_AFTER'])
            ->assertJsonFragment(['code' => 'VALIDATION_SUELDO_GT']);
    }

    public function test_it_creates_an_employee(): void
    {
        $payload = $this->validPayload([
            'codigo_empleado' => 'E0002',
            'cedula' => '1234567890',
            'email' => 'nuevo@example.com',
        ]);

        $this->postJson('/api/employees', $payload)
            ->assertCreated()
            ->assertJsonPath('data.type', 'employees')
            ->assertJsonPath('data.attributes.codigo_empleado', 'E0002')
            ->assertJsonPath('meta.message', 'Empleado creado correctamente.');

        $this->assertDatabaseHas('empleados', [
            'codigo_empleado' => 'E0002',
            'cedula' => '1234567890',
        ]);
    }

    public function test_it_updates_an_employee(): void
    {
        $payload = $this->validPayload([
            'telefono' => '0888888888',
            'direccion' => 'Calle Actualizada 123',
        ]);

        $this->putJson('/api/employees/1', $payload)
            ->assertOk()
            ->assertJsonPath('data.attributes.telefono', '0888888888')
            ->assertJsonPath('data.attributes.direccion', 'Calle Actualizada 123')
            ->assertJsonPath('data.attributes.jornada_parcial', false)
            ->assertJsonPath('meta.message', 'Empleado actualizado correctamente.');

        $this->assertDatabaseHas('empleados', [
            'id' => 1,
            'telefono' => '0888888888',
            'direccion' => 'Calle Actualizada 123',
        ]);
    }

    public function test_it_partially_updates_an_employee(): void
    {
        $this->patchJson('/api/employees/1', [
            'telefono' => '0777777777',
            'jornada_parcial' => true,
        ])
            ->assertOk()
            ->assertJsonPath('data.attributes.telefono', '0777777777')
            ->assertJsonPath('data.attributes.jornada_parcial', true)
            ->assertJsonPath('data.attributes.codigo_empleado', 'E0001')
            ->assertJsonPath('meta.message', 'Empleado actualizado parcialmente correctamente.');

        $this->assertDatabaseHas('empleados', [
            'id' => 1,
            'telefono' => '0777777777',
            'jornada_parcial' => true,
            'codigo_empleado' => 'E0001',
        ]);
    }

    public function test_it_uploads_an_employee_photo(): void
    {
        Storage::fake('public');

        $file = UploadedFile::fake()->createWithContent(
            'empleado.png',
            base64_decode(
                'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9sY4nS8AAAAASUVORK5CYII='
            ),
        );

        $response = $this->post('/api/employees/photo', [
            'fotografia' => $file,
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('data.type', 'employee-uploads')
            ->assertJsonPath('meta.message', 'Fotografia cargada correctamente.');

        $path = $response->json('data.attributes.path');

        $this->assertIsString($path);
        $this->assertStringStartsWith('empleados/', $path);
        Storage::disk('public')->assertExists($path);

        $photoUrl = $response->json('data.attributes.url');

        $photoResponse = $this->get($photoUrl);

        $photoResponse->assertOk();
        $this->assertStringStartsWith('image/', (string) $photoResponse->headers->get('content-type'));
    }

    public function test_it_deletes_an_employee(): void
    {
        $this->deleteJson('/api/employees/1')
            ->assertOk()
            ->assertJsonPath('data.type', 'employees')
            ->assertJsonPath('data.id', '1')
            ->assertJsonPath('data.attributes.codigo_empleado', 'E0001')
            ->assertJsonPath('meta.message', 'Empleado eliminado correctamente.');

        $this->assertDatabaseMissing('empleados', [
            'id' => 1,
        ]);
    }

    private function validPayload(array $overrides = []): array
    {
        return array_replace([
            'codigo_empleado' => 'E0099',
            'nombres' => 'Carlos',
            'apellidos' => 'Lopez',
            'cedula' => '9876543210',
            'telefono' => '0991112233',
            'direccion' => 'Av. Principal 123',
            'fecha_nacimiento' => '1991-05-10',
            'email' => 'carlos@example.com',
            'fotografia' => 'empleados/carlos.jpg',
            'observaciones_personales' => 'Observaciones personales',
            'fecha_ingreso' => '2025-03-01',
            'cargo' => 'Desarrollador',
            'departamento' => 'Tecnologia',
            'sueldo' => 1450.75,
            'jornada_parcial' => false,
            'observaciones_laborales' => 'Observaciones laborales',
            'provincia_personal_id' => 1,
            'provincia_laboral_id' => 2,
            'estado_codigo' => 1,
            'estado_nombre' => 'VIGENTE',
        ], $overrides);
    }

    private function insertEmployee(array $overrides = []): void
    {
        DB::table('empleados')->insert(array_replace([
            'id' => 2,
            'codigo_empleado' => 'E0002',
            'nombres' => 'Bruno',
            'apellidos' => 'Mora',
            'cedula' => '1234567890',
            'telefono' => '0988887777',
            'direccion' => 'Calle Secundaria 456',
            'fecha_nacimiento' => '1992-02-02',
            'email' => 'bruno@example.com',
            'fotografia' => 'empleados/bruno.jpg',
            'observaciones_personales' => 'Segundo empleado',
            'fecha_ingreso' => '2024-06-15',
            'cargo' => 'Analista',
            'departamento' => 'Operaciones',
            'sueldo' => 980.00,
            'jornada_parcial' => false,
            'observaciones_laborales' => 'Sin novedades',
            'provincia_personal_id' => 2,
            'provincia_laboral_id' => 1,
            'estado_codigo' => 1,
            'estado_nombre' => 'VIGENTE',
            'created_at' => now(),
            'updated_at' => now(),
        ], $overrides));
    }
}
