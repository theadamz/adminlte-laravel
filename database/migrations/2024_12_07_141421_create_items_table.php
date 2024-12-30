<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('code', 15)->unique();
            $table->string('name', 48);
            $table->string('description', 100)->nullable();
            $table->string('type', 10)->index()->comment('get from enum ItemType');
            $table->string('inventory_method', 10)->index()->comment('get from enum InventoryMethod');
            $table->uuid('category_sub_id')->index();
            $table->uuid('brand_id')->index();
            $table->decimal('tax_include', 5, 2)->default(0);
            $table->decimal('min_stock', 14, 2)->default(0);
            $table->boolean('is_active')->default(true);
            $table->boolean('is_serial')->default(false);
            $table->boolean('is_consignment')->default(false);
            $table->uuid('created_by')->nullable();
            $table->uuid('updated_by')->nullable();
            $table->timestamps();

            // FK
            $table->foreign('category_sub_id')->references('id')->on('category_subs')->restrictOnDelete()->cascadeOnUpdate();
            $table->foreign('brand_id')->references('id')->on('brands')->restrictOnDelete()->cascadeOnUpdate();
        });

        Schema::create('item_conversions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('item_id');
            $table->uuid('uom_id');
            $table->decimal('conversion', 14, 2)->default(0);
            $table->boolean('is_default')->default(false)->comment('default uom for item');
            $table->uuid('created_by')->nullable();
            $table->uuid('updated_by')->nullable();
            $table->timestamps();

            // constraints
            $table->unique(['item_id', 'uom_id']);

            // FK
            $table->foreign('item_id')->references('id')->on('items')->restrictOnDelete()->cascadeOnUpdate();
            $table->foreign('uom_id')->references('id')->on('uoms')->restrictOnDelete()->cascadeOnUpdate();
        });

        Schema::create('item_prices', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('item_conversion_id')->index();
            $table->string('barcode', 20)->index()->nullable();
            $table->decimal('purchase_price', 24, 2)->default(0);
            $table->decimal('sell_price', 24, 2)->default(0);
            $table->uuid('created_by')->nullable();
            $table->uuid('updated_by')->nullable();
            $table->timestamps();

            // constraints
            $table->unique(['item_conversion_id', 'barcode']);

            // FK
            $table->foreign('item_conversion_id')->references('id')->on('item_conversions')->restrictOnDelete()->cascadeOnUpdate();
        });

        Schema::create('item_serials', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('item_id')->index();
            $table->string('serial_no', 50)->index();
            $table->boolean('is_sold')->default(false);
            $table->uuid('created_by')->nullable();
            $table->uuid('updated_by')->nullable();
            $table->timestamps();

            // constraints
            $table->unique(['item_id', 'serial_no']);

            // FK
            $table->foreign('item_id')->references('id')->on('items')->restrictOnDelete()->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('item_prices');
        Schema::dropIfExists('item_conversions');
        Schema::dropIfExists('items');
    }
};
