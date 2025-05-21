<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\SongController;
use App\Models\Category;
use App\Models\Song;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    $song = Song::with('category')->get();
    $category = Category::all();

    return Inertia::render('welcome', [
        'songs' => $song,
        'categories' => $category,
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Category Routes
    Route::resource('category', CategoryController::class);

    // Songs Routes
    Route::resource('song', SongController::class);

});

    Route::get('/songs/category/{category}', [SongController::class, 'byCategory'])
    ->name('songs.byCategory');



    Route::get('/songs/{song}', function (Song $song) {
        $song->load('category'); // optional
        return Inertia::render('SongDetail', ['song' => $song]);
    })->name('songs.show');


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
