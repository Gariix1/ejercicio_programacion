<?php

declare(strict_types=1);

namespace App\Modules\Employees\Models;

use App\Modules\Provinces\Models\Province;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class Employee extends Model
{
    protected $table = 'empleados';

    protected $fillable = [
        'codigo_empleado',
        'nombres',
        'apellidos',
        'cedula',
        'telefono',
        'direccion',
        'fecha_nacimiento',
        'email',
        'fotografia',
        'observaciones_personales',
        'fecha_ingreso',
        'cargo',
        'departamento',
        'sueldo',
        'jornada_parcial',
        'observaciones_laborales',
        'provincia_personal_id',
        'provincia_laboral_id',
        'estado_codigo',
        'estado_nombre',
    ];

    protected $casts = [
        'fecha_nacimiento' => 'date:Y-m-d',
        'fecha_ingreso' => 'date:Y-m-d',
        'jornada_parcial' => 'boolean',
        'sueldo' => 'decimal:2',
    ];

    public function personalProvince(): BelongsTo
    {
        return $this->belongsTo(Province::class, 'provincia_personal_id');
    }

    public function workProvince(): BelongsTo
    {
        return $this->belongsTo(Province::class, 'provincia_laboral_id');
    }
}
