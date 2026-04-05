<?php

declare(strict_types=1);

namespace App\Modules\Employees\Repositories;

use App\Modules\Employees\DTOs\EmployeeData;
use App\Modules\Employees\DTOs\EmployeeListFilters;
use App\Modules\Employees\DTOs\EmployeeView;
use App\Modules\Employees\Models\Employee;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

final class EmployeeRepository
{
    public function all(EmployeeListFilters $filters): LengthAwarePaginator
    {
        $query = $this->applySearch($this->baseQuery(), $filters->search);
        $query = $this->applySorting(
            $query,
            $filters->sortBy,
            $filters->sortDir
        );

        $result = $query->paginate(
            $filters->perPage,
            ['*'],
            'page',
            $filters->page
        );

        $result->setCollection(
            $this->mapViews($result->getCollection())
        );

        return $result;
    }

    public function findDetailsOrFail(int $id): EmployeeView
    {
        $employee = $this->baseQuery()
            ->where('e.id', $id)
            ->first();

        if ($employee === null) {
            $exception = new ModelNotFoundException();
            $exception->setModel(Employee::class, [$id]);

            throw $exception;
        }

        return EmployeeView::fromRow($employee);
    }

    public function create(EmployeeData $employeeData): Employee
    {
        return Employee::query()->create($employeeData->toPersistenceArray());
    }

    public function update(Employee $employee, EmployeeData $employeeData): Employee
    {
        $employee->fill($employeeData->toPersistenceArray());
        $employee->save();

        return $employee->refresh();
    }

    public function getModelOrFail(int $id): Employee
    {
        return Employee::query()->findOrFail($id);
    }

    private function baseQuery(): Builder
    {
        return DB::table('empleados as e')
            ->join('provincias as pp', 'pp.id', '=', 'e.provincia_personal_id')
            ->join('provincias as pl', 'pl.id', '=', 'e.provincia_laboral_id')
            ->select([
                'e.id',
                'e.codigo_empleado',
                'e.nombres',
                'e.apellidos',
                'e.cedula',
                'e.telefono',
                'e.direccion',
                'e.fecha_nacimiento',
                'e.email',
                'e.fotografia',
                'e.observaciones_personales',
                'e.fecha_ingreso',
                'e.cargo',
                'e.departamento',
                'e.sueldo',
                'e.jornada_parcial',
                'e.observaciones_laborales',
                'e.provincia_personal_id',
                'e.provincia_laboral_id',
                'e.estado_codigo',
                'e.estado_nombre',
                'e.created_at',
                'e.updated_at',
                'pp.nombre as provincia_personal_nombre',
                'pl.nombre as provincia_laboral_nombre',
            ]);
    }

    private function applySearch(Builder $query, ?string $search): Builder
    {
        $term = trim((string) $search);

        if ($term === '') {
            return $query;
        }

        return $query->where(function (Builder $builder) use ($term): void {
            $like = '%' . $term . '%';

            $builder
                ->where('e.codigo_empleado', 'like', $like)
                ->orWhere('e.nombres', 'like', $like)
                ->orWhere('e.apellidos', 'like', $like)
                ->orWhere('e.cedula', 'like', $like)
                ->orWhere('e.email', 'like', $like)
                ->orWhere('e.cargo', 'like', $like)
                ->orWhere('e.departamento', 'like', $like)
                ->orWhere('pp.nombre', 'like', $like)
                ->orWhere('pl.nombre', 'like', $like);
        });
    }

    private function applySorting(Builder $query, string $sortBy, string $sortDirection): Builder
    {
        $allowedSorts = [
            'id' => 'e.id',
            'codigo_empleado' => 'e.codigo_empleado',
            'nombres' => 'e.nombres',
            'apellidos' => 'e.apellidos',
            'cedula' => 'e.cedula',
            'email' => 'e.email',
            'cargo' => 'e.cargo',
            'departamento' => 'e.departamento',
            'sueldo' => 'e.sueldo',
            'fecha_ingreso' => 'e.fecha_ingreso',
            'estado_nombre' => 'e.estado_nombre',
            'provincia_personal_nombre' => 'pp.nombre',
            'provincia_laboral_nombre' => 'pl.nombre',
        ];

        $column = $allowedSorts[$sortBy] ?? $allowedSorts['id'];
        $direction = strtolower($sortDirection) === 'asc' ? 'asc' : 'desc';

        return $query->orderBy($column, $direction);
    }

    private function mapViews(Collection $rows): Collection
    {
        return $rows->map(
            static fn (object $row): EmployeeView => EmployeeView::fromRow($row)
        );
    }
}
