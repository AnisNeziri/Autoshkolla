<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Response;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| This file handles non-API routes. We use it here to serve a React app
| built into the /public directory and support React Router.
|
*/

Route::get('/{any}', function () {
    $path = public_path('index.html');

    if (!File::exists($path)) {
        abort(404, 'React frontend not built yet.');
    }

    return Response::file($path);
})->where('any', '.*');
