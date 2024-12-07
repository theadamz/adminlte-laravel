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
