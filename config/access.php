<?php

return [
    'userIdExceptions' => ['00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000001'],
    'roleIdExceptions' => ['00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000001'],
    'groups' => [
        ['code' => 'basic', 'name' => 'Basic', 'visible' => true],
        ['code' => 'setting', 'name' => 'Setting', 'visible' => true],
    ],
    'menus' => [
        /* Basic Data */
        ['group_code' => 'basic', 'parent_menu_code' => 'category', 'code' => 'category', 'name' => 'Categories', 'description' => 'Categories', 'path' => '/basics/categories', 'icon' => 'fas fa-long-arrow-alt-right', 'visible' => true,  'children' => null],
        ['group_code' => 'basic', 'parent_menu_code' => 'category-sub', 'code' => 'category-sub', 'name' => 'Sub Categories', 'description' => 'Sub Categories', 'path' => '/basics/category-subs', 'icon' => 'fas fa-level-down-alt', 'visible' => true,  'children' => null],
        ['group_code' => 'basic', 'parent_menu_code' => 'brand', 'code' => 'brand', 'name' => 'Brands', 'description' => 'Brands', 'path' => '/basics/brands', 'icon' => 'fas fa-copyright', 'visible' => true,  'children' => null],
        ['group_code' => 'basic', 'parent_menu_code' => 'uom', 'code' => 'uom', 'name' => 'UOMs', 'description' => 'UOMs', 'path' => '/basics/uoms', 'icon' => 'fas fa-weight', 'visible' => true,  'children' => null],
        ['group_code' => 'basic', 'parent_menu_code' => 'warehouse', 'code' => 'warehouse', 'name' => 'Warehouses', 'description' => 'Warehouses', 'path' => '/basics/warehouses', 'icon' => 'fas fa-warehouse', 'visible' => true,  'children' => null],
        ['group_code' => 'basic', 'parent_menu_code' => 'item', 'code' => 'item', 'name' => 'Items', 'description' => 'Items', 'path' => '/basics/items', 'icon' => 'fas fa-list', 'visible' => true,  'children' => null],

        /* Konfigurasi */
        [
            'group_code' => 'setting',
            'parent_menu_code' => 'config',
            'code' => 'config',
            'name' => 'Configurations',
            'description' => 'Menu Parent Configuration',
            'path' => null,
            'icon' => 'fas fa-cog',
            'visible' => true,
            'children' => [
                ['group_code' => 'setting', 'parent_menu_code' => 'config', 'code' => 'config-role', 'name' => 'Roles', 'description' => 'Roles', 'path' => '/configs/roles', 'icon' => 'fas fa-users', 'visible' => true,  'children' => null],
                ['group_code' => 'setting', 'parent_menu_code' => 'config', 'code' => 'config-role-access', 'name' => 'Role Accesses', 'description' => 'Role Accesses', 'path' => '/configs/accesses', 'icon' => 'fas fa-user-cog', 'visible' => true,  'children' => null],
                ['group_code' => 'setting', 'parent_menu_code' => 'config', 'code' => 'config-user', 'name' => 'Users', 'description' => 'Users', 'path' => '/configs/users', 'icon' => 'fas fa-user-plus', 'visible' => true,  'children' => null],
                ['group_code' => 'setting', 'parent_menu_code' => 'config', 'code' => 'config-user-access', 'name' => 'User Accesses', 'description' => 'User Accesses', 'path' => '/configs/user-accesses', 'icon' => 'fas fa-user-cog', 'visible' => true,  'children' => null],
            ],
        ],
    ],
    'roleList' => [
        /* ========== Access Menu ========== */
        /* Basic Data */
        ['code' => 'category', 'name' => 'Category', 'permissions' => ['read', 'create', 'edit', 'delete', 'import', 'export']],
        ['code' => 'category-sub', 'name' => 'Sub Category', 'permissions' => ['read', 'create', 'edit', 'delete', 'import', 'export']],
        ['code' => 'brand', 'name' => 'Brand', 'permissions' => ['read', 'create', 'edit', 'delete', 'import', 'export']],
        ['code' => 'uom', 'name' => 'UOMs', 'permissions' => ['read', 'create', 'edit', 'delete', 'import', 'export']],
        ['code' => 'warehouse', 'name' => 'Warehouse', 'permissions' => ['read', 'create', 'edit', 'delete', 'import', 'export']],
        ['code' => 'warehouse-location', 'name' => 'Warehouse Location', 'permissions' => ['read', 'create', 'edit', 'delete', 'import', 'export']],
        ['code' => 'item', 'name' => 'Items', 'permissions' => ['read', 'create', 'edit', 'delete', 'import', 'export']],

        /* Configurations */
        ['code' => 'config', 'name' => 'Menu Parent Configurations', 'permissions' => ['read']],
        /* Configurations - Core */
        ['code' => 'config-role', 'name' => 'Menu Configurations - Roles', 'permissions' => ['read', 'create', 'edit', 'delete']],
        ['code' => 'config-role-access', 'name' => 'Menu Configurations - Role Accesses', 'permissions' => ['read', 'create', 'edit', 'delete']],
        ['code' => 'config-user', 'name' => 'Menu Configurations - Users', 'permissions' => ['read', 'create', 'edit', 'delete']],
        ['code' => 'config-user-access', 'name' => 'Menu Configurations - User Accesses', 'permissions' => ['read', 'create', 'edit', 'delete']],
    ],
    'userList' => [
        ['code' => 'item', 'name' => 'Items', 'permissions' => ['uom-conversion', 'sell-price']],
    ],
];
