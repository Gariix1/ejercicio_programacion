<?php

namespace Tests\Feature;

use Tests\TestCase;

class EmployeesApiTest extends TestCase
{
    public function test_it_returns_a_paginated_employee_list(): void
    {
        $this->getJson('/api/employees?page=1&per_page=1')
            ->assertOk()
            ->assertJsonPath('meta.current_page', 1)
            ->assertJsonPath('meta.per_page', 1)
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('meta.module', 'employees')
            ->assertJsonPath('data.0.codigo_empleado', 'E0001');
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
            ->assertJsonValidationErrors(['estado_codigo']);
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
            ->assertJsonPath('data.codigo_empleado', 'E0002')
            ->assertJsonPath('message', 'Empleado creado correctamente.');

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
            ->assertJsonPath('data.telefono', '0888888888')
            ->assertJsonPath('data.direccion', 'Calle Actualizada 123')
            ->assertJsonPath('message', 'Empleado actualizado correctamente.');

        $this->assertDatabaseHas('empleados', [
            'id' => 1,
            'telefono' => '0888888888',
            'direccion' => 'Calle Actualizada 123',
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
}
