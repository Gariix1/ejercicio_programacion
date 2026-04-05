<?php

declare(strict_types=1);

namespace App\Modules\Provinces\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class ProvinceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'type' => 'provinces',
            'id' => (string) $this->id,
            'attributes' => [
                'nombre' => $this->nombre,
                'capital' => $this->capital,
                'descripcion' => $this->descripcion,
                'poblacion' => $this->poblacion,
                'superficie' => $this->superficie,
                'latitud' => $this->latitud,
                'longitud' => $this->longitud,
                'id_region' => $this->id_region,
                'created_at' => (string) $this->created_at,
                'updated_at' => (string) $this->updated_at,
            ],
        ];
    }
}
