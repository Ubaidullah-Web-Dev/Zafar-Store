<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CustomOrderController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Home Page (New Simple Form)
Route::get('/', function () {
    return Inertia::render('Home');
});

// Previous Order Page (Old Menu)
Route::get('/previous-order', function () {
    return Inertia::render('PreviousOrder');
});

// Submit Custom Order
Route::post('/custom-orders', [CustomOrderController::class, 'store'])->name('custom-orders.store');

// Admin Login (at /admin itself)
Route::redirect('/login', '/admin')->name('login');
Route::get('/admin', [AuthController::class, 'showLogin'])->name('admin.login');
Route::post('/admin', [AuthController::class, 'login'])->name('admin.login.submit');
Route::post('/admin/logout', [AuthController::class, 'logout'])->name('admin.logout');

// Admin Routes (protected)
Route::prefix('admin')->middleware('admin.auth')->group(function () {
    // Default Admin Route: Custom Orders
    Route::get('/orders', [CustomOrderController::class, 'index'])->name('admin.custom-orders.index');

    // Renamed Old Dashboard
    Route::get('/old-dashboard', function () {
        return Inertia::render('Admin');
    })->name('admin.dashboard');

    Route::get('/products', function () {
        return Inertia::render('AdminProducts');
    });

    // Custom Order CRUD
    Route::delete('/custom-orders/{id}', [CustomOrderController::class, 'destroy'])->name('admin.custom-orders.destroy');
    Route::patch('/custom-orders/{id}/status', [CustomOrderController::class, 'updateStatus'])->name('admin.custom-orders.update-status');
});
