<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use RuntimeException;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $seedFile = base_path('../database/seed.sql');

        if (!File::exists($seedFile)) {
            throw new RuntimeException('No se encontro el archivo database/seed.sql.');
        }

        DB::table('empleados')->delete();
        DB::table('provincias')->delete();

        foreach ($this->statements(File::get($seedFile)) as $statement) {
            DB::unprepared($statement);
        }
    }

    private function statements(string $sql): array
    {
        $statements = preg_split('/;\s*(?:\r\n|\r|\n|$)/', $sql) ?: [];

        return array_values(array_filter(array_map(
            static function (string $statement): ?string {
                $trimmed = trim($statement);

                if ($trimmed === '' || str_starts_with(strtoupper($trimmed), 'USE ')) {
                    return null;
                }

                return $trimmed . ';';
            },
            $statements
        )));
    }
}
