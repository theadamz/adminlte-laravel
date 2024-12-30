<?php

namespace App\Models\Basic;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;
use Illuminate\Support\Facades\Auth;

class ItemSerial extends Model
{
    use HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';
    protected $guarded = ['created_by', 'updated_by'];

    protected static function boot()
    {
        parent::boot();

        static::creating(function (ItemSerial $model) {
            $model->created_by = Auth::id();
        });

        static::updating(function (ItemSerial $model) {
            $model->updated_by = Auth::id();
        });
    }

    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }

    public function item_price(): HasOneThrough
    {
        return $this->hasOneThrough(ItemPrice::class, ItemConversion::class, 'item_id', 'item_conversion_id', 'item_id', 'item_id')->where('is_default', true);
    }
}
