<?php

namespace App\Enums;

enum ItemType: string
{
    case INV = 'INV';
    case SRV = 'SRV';

    public function getLabel(): string
    {
        return match ($this) {
            self::INV => 'Inventory',
            self::SRV => 'Service',
        };
    }
}
