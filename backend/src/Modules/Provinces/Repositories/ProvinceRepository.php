<?php

declare(strict_types=1);

namespace App\Modules\Provinces\Repositories;

use App\Modules\Provinces\Models\Province;
use PDO;

final class ProvinceRepository
{
    public function __construct(private readonly PDO $connection)
    {
    }

    public function all(): array
    {
        $statement = $this->connection->query('SELECT * FROM provincias ORDER BY nombre ASC');

        return array_map(
            static fn (array $row): array => (new Province($row))->toArray(),
            $statement->fetchAll()
        );
    }
}
