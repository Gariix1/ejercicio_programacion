<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class ReportsApiTest extends TestCase
{
    public function test_it_returns_a_paginated_employee_report(): void
    {
        $this->insertEmployee([
            'id' => 2,
            'codigo_empleado' => 'E0002',
            'nombres' => 'Bruno',
            'cedula' => '1234567890',
            'email' => 'bruno@example.com',
        ]);

        $this->getJson('/api/reports/employees?page=1&per_page=1&sort_by=nombres&sort_dir=asc')
            ->assertOk()
            ->assertJsonPath('meta.current_page', 1)
            ->assertJsonPath('meta.per_page', 1)
            ->assertJsonPath('meta.total', 2)
            ->assertJsonPath('meta.module', 'reports')
            ->assertJsonPath('meta.type', 'employees')
            ->assertJsonPath('data.0.nombres', 'Ana');
    }

    public function test_it_filters_employee_report_by_search_term(): void
    {
        $this->insertEmployee([
            'id' => 2,
            'codigo_empleado' => 'E0002',
            'nombres' => 'Bruno',
            'cedula' => '1234567890',
            'email' => 'bruno@example.com',
            'cargo' => 'Supervisor',
        ]);

        $this->getJson('/api/reports/employees?search=Supervisor')
            ->assertOk()
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('data.0.nombres', 'Bruno');
    }

    public function test_it_returns_employee_summary_report(): void
    {
        $this->insertEmployee([
            'id' => 2,
            'codigo_empleado' => 'E0002',
            'nombres' => 'Bruno',
            'cedula' => '1234567890',
            'email' => 'bruno@example.com',
            'estado_codigo' => 9,
            'estado_nombre' => 'RETIRADO',
            'sueldo' => 900.00,
        ]);

        $this->getJson('/api/reports/summary')
            ->assertOk()
            ->assertJsonPath('meta.module', 'reports')
            ->assertJsonPath('meta.type', 'summary')
            ->assertJsonPath('data.total_empleados', 2)
            ->assertJsonPath('data.empleados_vigentes', 1)
            ->assertJsonPath('data.empleados_retirados', 1);
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
