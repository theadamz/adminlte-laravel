<?php

use Illuminate\Support\Facades\Route;

Route::get('/sign-in-history', [\App\Http\Controllers\Account\ProfileController::class, 'datatableSignInHistory'])->name('dt.sign-in-history');

// config
Route::prefix('/configs')->group(function () {
    // core
    Route::get('/roles', [\App\Http\Controllers\Config\RoleController::class, 'datatable'])->name('dt.configs.roles');
    Route::get('/users', [\App\Http\Controllers\Config\UserController::class, 'datatable'])->name('dt.configs.users');
});

// basic
Route::prefix('/basics')->group(function () {
    Route::get('/categories', [\App\Http\Controllers\Basic\CategoryController::class, 'datatable'])->name('dt.basics.categories');
    Route::get('/category-subs', [\App\Http\Controllers\Basic\CategorySubController::class, 'datatable'])->name('dt.basics.category-subs');
    Route::get('/brands', [\App\Http\Controllers\Basic\BrandController::class, 'datatable'])->name('dt.basics.brands');
    Route::get('/uoms', [\App\Http\Controllers\Basic\UomController::class, 'datatable'])->name('dt.basics.uoms');
    Route::get('/warehouses', [\App\Http\Controllers\Basic\WarehouseController::class, 'datatable'])->name('dt.basics.warehouses');
    Route::get('/warehouses/{warehouseId}/locations', [\App\Http\Controllers\Basic\WarehouseLocationController::class, 'datatable'])->name('dt.basics.warehouses.locations');
});
