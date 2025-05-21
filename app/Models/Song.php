<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Song extends Model
{
    protected $fillable = [
        'song_name',
        'lyric',
        'url',
        'cover_photo',
        'status',
        'category_id',
    ];

    // Define relationship with category if not already defined
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
