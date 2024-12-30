<?php

use Illuminate\Support\Facades\Route;

// config
Route::prefix('/configs')->group(function () {
    // core
    Route::get('/users', [\App\Http\Controllers\Config\UserController::class, 'lov']);
});

// basic
Route::prefix('/basics')->group(function () {
    // core
    Route::get('/categories', [\App\Http\Controllers\Basic\CategoryController::class, 'lov'])->name('lov.basics.categories');
    Route::get('/category-subs', [\App\Http\Controllers\Basic\CategorySubController::class, 'lov'])->name('lov.basics.category-subs');
    Route::get('/brands', [\App\Http\Controllers\Basic\BrandController::class, 'lov'])->name('lov.basics.brands');
    Route::get('/uoms', [\App\Http\Controllers\Basic\UomController::class, 'lov'])->name('lov.basics.uoms');
    Route::get('/warehouses', [\App\Http\Controllers\Basic\WarehouseController::class, 'lov'])->name('lov.basics.warehouses');
    Route::get('/warehouses/{warehouseId}/locations', [\App\Http\Controllers\Basic\WarehouseLocationController::class, 'lov'])->name('lov.basics.warehouses.locations');
});
