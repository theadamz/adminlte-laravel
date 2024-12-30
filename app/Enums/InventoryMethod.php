<?php

namespace App\Enums;

enum InventoryMethod: string
{
    case AVG = 'AVG';
    case FIFO = 'FIFO';

    public function getLabel(): string
    {
        return match ($this) {
            self::AVG => 'Average',
            self::FIFO => 'First In First Out',
        };
    }
}
