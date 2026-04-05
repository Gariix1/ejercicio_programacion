<?php

declare(strict_types=1);

use App\Core\Database\Connection;
use App\Modules\Employees\Controllers\EmployeeController;
use App\Modules\Employees\Repositories\EmployeeRepository;
use App\Modules\Employees\Services\EmployeeService;
use App\Modules\Employees\Validators\EmployeeValidator;
use App\Modules\Provinces\Controllers\ProvinceController;
use App\Modules\Provinces\Repositories\ProvinceRepository;
use App\Modules\Provinces\Services\ProvinceService;
use App\Modules\Reports\Controllers\ReportController;
use App\Modules\Reports\Repositories\ReportRepository;
use App\Modules\Reports\Services\ReportService;

$router->get('/api/health', static fn () => App\Core\Http\Response::json([
    'message' => 'API ready',
]));

if ($request->path() === '/api/health') {
    return;
}

$databaseConfig = require $basePath . '/config/database.php';
$connection = Connection::getInstance($databaseConfig);

$employeeController = new EmployeeController(
    new EmployeeService(
        new EmployeeRepository($connection),
        new EmployeeValidator()
    )
);

$provinceController = new ProvinceController(
    new ProvinceService(
        new ProvinceRepository($connection)
    )
);

$reportController = new ReportController(
    new ReportService(
        new ReportRepository($connection)
    )
);

$router->get('/api/employees', [$employeeController, 'index']);
$router->get('/api/employees/{id}', [$employeeController, 'show']);
$router->post('/api/employees', [$employeeController, 'store']);

$router->get('/api/provinces', [$provinceController, 'index']);

$router->get('/api/reports/summary', [$reportController, 'summary']);
