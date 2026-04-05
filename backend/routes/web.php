<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'message' => 'Ejercicio Programacion Backend API',
        'docs' => [
            'health' => '/api/health',
            'employees' => '/api/employees',
            'provinces' => '/api/provinces',
            'reports' => '/api/reports/employees',
        ],
    ]);
});
