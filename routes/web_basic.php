<?php

use Illuminate\Support\Facades\Route;

// category
Route::prefix("categories")->middleware(['access:category'])->group(function () {
    Route::get('/', [\App\Http\Controllers\Basic\CategoryController::class, 'index'])->can('category');
    Route::post('/', [\App\Http\Controllers\Basic\CategoryController::class, 'store'])->can('category-create');
    Route::get('/{id}', [\App\Http\Controllers\Basic\CategoryController::class, 'show'])->can('category-read');
    Route::put('/{id}', [\App\Http\Controllers\Basic\CategoryController::class, 'update'])->can('category-edit');
    Route::delete('/', [\App\Http\Controllers\Basic\CategoryController::class, 'destroy'])->can('category-delete');
    Route::post('/imports', [\App\Http\Controllers\Basic\CategoryController::class, 'storeImport'])->can('category-import');
    Route::post('/exports', [\App\Http\Controllers\Basic\CategoryController::class, 'export'])->can('category-export');
});

// category sub
Route::prefix("category-subs")->middleware(['access:category-sub'])->group(function () {
    Route::get('/', [\App\Http\Controllers\Basic\CategorySubController::class, 'index'])->can('category-sub');
    Route::post('/', [\App\Http\Controllers\Basic\CategorySubController::class, 'store'])->can('category-sub-create');
    Route::get('/{id}', [\App\Http\Controllers\Basic\CategorySubController::class, 'show'])->can('category-sub-read');
    Route::put('/{id}', [\App\Http\Controllers\Basic\CategorySubController::class, 'update'])->can('category-sub-edit');
    Route::delete('/', [\App\Http\Controllers\Basic\CategorySubController::class, 'destroy'])->can('category-sub-delete');
    Route::post('/imports', [\App\Http\Controllers\Basic\CategorySubController::class, 'storeImport'])->can('category-sub-import');
    Route::post('/exports', [\App\Http\Controllers\Basic\CategorySubController::class, 'export'])->can('category-sub-export');
});

// brand
Route::prefix("brands")->middleware(['access:brand'])->group(function () {
    Route::get('/', [\App\Http\Controllers\Basic\BrandController::class, 'index'])->can('brand');
    Route::post('/', [\App\Http\Controllers\Basic\BrandController::class, 'store'])->can('brand-create');
    Route::get('/{id}', [\App\Http\Controllers\Basic\BrandController::class, 'show'])->can('brand-read');
    Route::put('/{id}', [\App\Http\Controllers\Basic\BrandController::class, 'update'])->can('brand-edit');
    Route::delete('/', [\App\Http\Controllers\Basic\BrandController::class, 'destroy'])->can('brand-delete');
    Route::post('/imports', [\App\Http\Controllers\Basic\BrandController::class, 'storeImport'])->can('brand-import');
    Route::post('/exports', [\App\Http\Controllers\Basic\BrandController::class, 'export'])->can('brand-export');
});

// uom
Route::prefix("uoms")->middleware(['access:uom'])->group(function () {
    Route::get('/', [\App\Http\Controllers\Basic\UomController::class, 'index'])->can('uom');
    Route::post('/', [\App\Http\Controllers\Basic\UomController::class, 'store'])->can('uom-create');
    Route::get('/{id}', [\App\Http\Controllers\Basic\UomController::class, 'show'])->can('uom-read');
    Route::put('/{id}', [\App\Http\Controllers\Basic\UomController::class, 'update'])->can('uom-edit');
    Route::delete('/', [\App\Http\Controllers\Basic\UomController::class, 'destroy'])->can('uom-delete');
    Route::post('/imports', [\App\Http\Controllers\Basic\UomController::class, 'storeImport'])->can('uom-import');
    Route::post('/exports', [\App\Http\Controllers\Basic\UomController::class, 'export'])->can('uom-export');
});

// warehouse
Route::prefix("warehouses")->middleware(['access:warehouse'])->group(function () {
    Route::get('/', [\App\Http\Controllers\Basic\WarehouseController::class, 'index'])->can('warehouse')->name('basic.warehouses.index');
    Route::post('/', [\App\Http\Controllers\Basic\WarehouseController::class, 'store'])->can('warehouse-create');
    Route::get('/{id}', [\App\Http\Controllers\Basic\WarehouseController::class, 'show'])->can('warehouse-read');
    Route::put('/{id}', [\App\Http\Controllers\Basic\WarehouseController::class, 'update'])->can('warehouse-edit');
    Route::delete('/', [\App\Http\Controllers\Basic\WarehouseController::class, 'destroy'])->can('warehouse-delete');
    Route::post('/imports', [\App\Http\Controllers\Basic\WarehouseController::class, 'storeImport'])->can('warehouse-import');
    Route::post('/exports', [\App\Http\Controllers\Basic\WarehouseController::class, 'export'])->can('warehouse-export');

    // warehouse location
    Route::get('/{warehouseId}/locations', [\App\Http\Controllers\Basic\WarehouseLocationController::class, 'index'])->can('warehouse-location');
    Route::post('/{warehouseId}/locations', [\App\Http\Controllers\Basic\WarehouseLocationController::class, 'store'])->can('warehouse-location-create');
    Route::get('/{warehouseId}/locations/{id}', [\App\Http\Controllers\Basic\WarehouseLocationController::class, 'show'])->can('warehouse-location-read');
    Route::put('/{warehouseId}/locations/{id}', [\App\Http\Controllers\Basic\WarehouseLocationController::class, 'update'])->can('warehouse-location-edit');
    Route::delete('/{warehouseId}/locations', [\App\Http\Controllers\Basic\WarehouseLocationController::class, 'destroy'])->can('warehouse-location-delete');
    Route::post('/{warehouseId}/locations/imports', [\App\Http\Controllers\Basic\WarehouseLocationController::class, 'storeImport'])->can('warehouse-location-import');
    Route::post('/{warehouseId}/locations/exports', [\App\Http\Controllers\Basic\WarehouseLocationController::class, 'export'])->can('warehouse-location-export');
});
