<?php

namespace Tests;

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

abstract class TestCase extends BaseTestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        $this->prepareSqliteSchema();
        $this->seedBaseData();
    }

    private function prepareSqliteSchema(): void
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('empleados');
        Schema::dropIfExists('provincias');
        Schema::enableForeignKeyConstraints();

        Schema::create('provincias', function (Blueprint $table): void {
            $table->increments('id');
            $table->string('nombre', 100)->unique();
            $table->string('capital', 100)->nullable();
            $table->text('descripcion')->nullable();
            $table->unsignedBigInteger('poblacion')->nullable();
            $table->decimal('superficie', 10, 2)->nullable();
            $table->decimal('latitud', 10, 6)->nullable();
            $table->decimal('longitud', 10, 6)->nullable();
            $table->unsignedTinyInteger('id_region')->nullable();
            $table->timestamps();
        });

        Schema::create('empleados', function (Blueprint $table): void {
            $table->increments('id');
            $table->string('codigo_empleado', 5)->unique();
            $table->string('nombres', 100);
            $table->string('apellidos', 100);
            $table->string('cedula', 10)->unique();
            $table->string('telefono', 15)->nullable();
            $table->string('direccion', 255)->nullable();
            $table->date('fecha_nacimiento');
            $table->string('email', 150);
            $table->string('fotografia', 255)->nullable();
            $table->text('observaciones_personales')->nullable();
            $table->date('fecha_ingreso');
            $table->string('cargo', 100);
            $table->string('departamento', 100);
            $table->decimal('sueldo', 10, 2);
            $table->boolean('jornada_parcial')->default(false);
            $table->text('observaciones_laborales')->nullable();
            $table->unsignedInteger('provincia_personal_id');
            $table->unsignedInteger('provincia_laboral_id');
            $table->tinyInteger('estado_codigo')->default(1);
            $table->string('estado_nombre', 20)->default('VIGENTE');
            $table->timestamps();

            $table->foreign('provincia_personal_id')->references('id')->on('provincias');
            $table->foreign('provincia_laboral_id')->references('id')->on('provincias');
        });
    }

    private function seedBaseData(): void
    {
        DB::table('provincias')->insert([
            [
                'id' => 1,
                'nombre' => 'Azuay',
                'capital' => 'Cuenca',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 2,
                'nombre' => 'Pichincha',
                'capital' => 'Quito',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        DB::table('empleados')->insert([
            'id' => 1,
            'codigo_empleado' => 'E0001',
            'nombres' => 'Ana',
            'apellidos' => 'Perez',
            'cedula' => '0123456789',
            'telefono' => '0999999999',
            'direccion' => 'Av. Siempre Viva',
            'fecha_nacimiento' => '1990-01-01',
            'email' => 'ana@example.com',
            'fotografia' => 'empleados/ana.jpg',
            'observaciones_personales' => 'Empleado semilla',
            'fecha_ingreso' => '2024-01-10',
            'cargo' => 'Analista',
            'departamento' => 'Tecnologia',
            'sueldo' => 1200.50,
            'jornada_parcial' => false,
            'observaciones_laborales' => 'Sin novedades',
            'provincia_personal_id' => 1,
            'provincia_laboral_id' => 2,
            'estado_codigo' => 1,
            'estado_nombre' => 'VIGENTE',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
