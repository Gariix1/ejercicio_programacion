<?php

namespace Tests\Unit;

use App\Modules\Employees\DTOs\EmployeeData;
use PHPUnit\Framework\TestCase;

class EmployeeDataTest extends TestCase
{
    public function test_it_maps_input_to_persistence_array(): void
    {
        $data = EmployeeData::fromArray([
            'codigo_empleado' => 'E0007',
            'nombres' => 'Maria',
            'apellidos' => 'Ruiz',
            'cedula' => '1111111111',
            'telefono' => '0990001122',
            'direccion' => 'Direccion de prueba',
            'fecha_nacimiento' => '1992-04-03',
            'email' => 'maria@example.com',
            'fotografia' => 'empleados/maria.jpg',
            'observaciones_personales' => 'Observacion',
            'fecha_ingreso' => '2025-01-01',
            'cargo' => 'QA',
            'departamento' => 'Calidad',
            'sueldo' => 1100.50,
            'jornada_parcial' => true,
            'observaciones_laborales' => 'Sin novedades',
            'provincia_personal_id' => 1,
            'provincia_laboral_id' => 2,
            'estado_codigo' => 9,
            'estado_nombre' => 'RETIRADO',
        ]);

        $this->assertSame([
            'codigo_empleado' => 'E0007',
            'nombres' => 'Maria',
            'apellidos' => 'Ruiz',
            'cedula' => '1111111111',
            'telefono' => '0990001122',
            'direccion' => 'Direccion de prueba',
            'fecha_nacimiento' => '1992-04-03',
            'email' => 'maria@example.com',
            'fotografia' => 'empleados/maria.jpg',
            'observaciones_personales' => 'Observacion',
            'fecha_ingreso' => '2025-01-01',
            'cargo' => 'QA',
            'departamento' => 'Calidad',
            'sueldo' => 1100.5,
            'jornada_parcial' => true,
            'observaciones_laborales' => 'Sin novedades',
            'provincia_personal_id' => 1,
            'provincia_laboral_id' => 2,
            'estado_codigo' => 9,
            'estado_nombre' => 'RETIRADO',
        ], $data->toPersistenceArray());
    }
}
