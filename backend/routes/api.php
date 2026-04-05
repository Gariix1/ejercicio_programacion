<?php

use App\Modules\Employees\Controllers\EmployeeController;
use App\Modules\Provinces\Controllers\ProvinceController;
use App\Modules\Reports\Controllers\EmployeeReportController;
use Illuminate\Support\Facades\Route;

Route::get('/health', static fn () => response()->json([
    'message' => 'API ready',
]));

Route::get('/employees', [EmployeeController::class, 'index']);
Route::get('/employees/{id}', [EmployeeController::class, 'show'])->whereNumber('id');
Route::post('/employees', [EmployeeController::class, 'store']);
Route::put('/employees/{id}', [EmployeeController::class, 'update'])->whereNumber('id');

Route::get('/provinces', [ProvinceController::class, 'index']);

Route::get('/reports/employees', [EmployeeReportController::class, 'index']);
Route::get('/reports/summary', [EmployeeReportController::class, 'summary']);
