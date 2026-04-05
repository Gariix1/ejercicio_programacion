<?php

declare(strict_types=1);

namespace App\Modules\Provinces\Models;

use Illuminate\Database\Eloquent\Model;

final class Province extends Model
{
    protected $table = 'provincias';

    protected $fillable = [
        'nombre',
        'capital',
        'descripcion',
        'poblacion',
        'superficie',
        'latitud',
        'longitud',
        'id_region',
    ];
}
