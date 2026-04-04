<?php

declare(strict_types=1);

namespace App\Modules\Reports\Repositories;

use PDO;

final class ReportRepository
{
    public function __construct(private readonly PDO $connection)
    {
    }

    public function employeeSummary(): array
    {
        $statement = $this->connection->query(
            'SELECT
                COUNT(*) AS total_empleados,
                SUM(CASE WHEN estado_codigo = 1 THEN 1 ELSE 0 END) AS empleados_vigentes,
                SUM(CASE WHEN estado_codigo = 9 THEN 1 ELSE 0 END) AS empleados_retirados,
                AVG(sueldo) AS sueldo_promedio
             FROM empleados'
        );

        return $statement->fetch() ?: [];
    }
}
