<?php

declare(strict_types=1);

namespace App\Modules\Employees\Repositories;

use App\Modules\Employees\DTOs\EmployeeData;
use App\Modules\Employees\Models\Employee;
use PDO;

final class EmployeeRepository
{
    public function __construct(private readonly PDO $connection)
    {
    }

    public function all(): array
    {
        $statement = $this->connection->query(
            'SELECT e.*, pp.nombre AS provincia_personal_nombre, pl.nombre AS provincia_laboral_nombre
             FROM empleados e
             INNER JOIN provincias pp ON pp.id = e.provincia_personal_id
             INNER JOIN provincias pl ON pl.id = e.provincia_laboral_id
             ORDER BY e.id DESC'
        );

        return array_map(
            static fn (array $row): array => (new Employee($row))->toArray(),
            $statement->fetchAll()
        );
    }

    public function find(int $id): ?array
    {
        $statement = $this->connection->prepare(
            'SELECT e.*, pp.nombre AS provincia_personal_nombre, pl.nombre AS provincia_laboral_nombre
             FROM empleados e
             INNER JOIN provincias pp ON pp.id = e.provincia_personal_id
             INNER JOIN provincias pl ON pl.id = e.provincia_laboral_id
             WHERE e.id = :id
             LIMIT 1'
        );

        $statement->execute(['id' => $id]);
        $employee = $statement->fetch();

        return $employee ?: null;
    }

    public function create(EmployeeData $employeeData): array
    {
        $payload = $employeeData->toDatabaseArray();
        $columns = implode(', ', array_keys($payload));
        $placeholders = ':' . implode(', :', array_keys($payload));

        $statement = $this->connection->prepare(
            sprintf('INSERT INTO empleados (%s) VALUES (%s)', $columns, $placeholders)
        );
        $statement->execute($payload);

        return $this->find((int) $this->connection->lastInsertId()) ?? $payload;
    }
}
