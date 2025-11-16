<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\TodoController;
use Illuminate\Support\Facades\Route;

Route::middleware(['handle.inertia'])->group(function () {
    // Auth Routes
    Route::group(['prefix' => 'auth'], function () {
        Route::get('/login', [AuthController::class, 'login'])->name('auth.login');
        Route::post('/login/post', [AuthController::class, 'postLogin'])->name('auth.login.post');
        Route::get('/register', [AuthController::class, 'register'])->name('auth.register');
        Route::post('/register/post', [AuthController::class, 'postRegister'])->name('auth.register.post');
        Route::get('/logout', [AuthController::class, 'logout'])->name('auth.logout');
    });

    // Protected Routes
    Route::group(['middleware' => 'check.auth'], function () {
        Route::get('/', [HomeController::class, 'home'])->name('home');
        
        // Todo Routes
        Route::get('/todos', [TodoController::class, 'index'])->name('todos.index');
        Route::post('/todos', [TodoController::class, 'store'])->name('todos.store');
        Route::get('/todos/{id}/edit', [TodoController::class, 'edit'])->name('todos.edit');
        Route::put('/todos/{id}', [TodoController::class, 'update'])->name('todos.update');
        Route::post('/todos/{id}/toggle', [TodoController::class, 'toggleFinish'])->name('todos.toggle');
        Route::delete('/todos/{id}', [TodoController::class, 'destroy'])->name('todos.destroy');
        Route::post('/todos/{id}/cover', [TodoController::class, 'updateCover'])->name('todos.cover.update');
        Route::delete('/todos/{id}/cover', [TodoController::class, 'deleteCover'])->name('todos.cover.delete');
    });
});