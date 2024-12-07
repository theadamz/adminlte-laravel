<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/status',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // custom middleware
        $middleware->alias([
            'access' => \App\Http\Middleware\Access::class,
            'canAny' => \App\Http\Middleware\CanAny::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();