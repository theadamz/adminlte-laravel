<?php

namespace App\Models\Basic;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Support\Facades\Auth;

class Item extends Model
{
    use HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';
    protected $guarded = ['created_by', 'updated_by'];

    protected static function boot()
    {
        parent::boot();

        static::creating(function (Item $model) {
            $model->created_by = Auth::id();
        });

        static::updating(function (Item $model) {
            $model->updated_by = Auth::id();
        });
    }

    public function category_sub(): BelongsTo
    {
        return $this->belongsTo(CategorySub::class);
    }

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    public function item_conversions(): HasMany
    {
        return $this->hasMany(ItemConversion::class);
    }

    public function item_serials(): HasMany
    {
        return $this->hasMany(ItemSerial::class);
    }

    public function item_prices(): HasManyThrough
    {
        return $this->hasManyThrough(ItemPrice::class, ItemConversion::class);
    }
}
