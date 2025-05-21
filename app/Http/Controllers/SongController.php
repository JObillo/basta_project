<?php

namespace App\Http\Controllers;

use App\Models\Song;
use Illuminate\Http\Request;
use App\Models\Category;
use Inertia\Inertia;

class SongController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Get all songs with their categories
        $songs = Song::with(['category'])->get();

        // Update cover_photo to full URL
        foreach ($songs as $song) {
            $song->cover_photo = url($song->cover_photo);
        }

        // Return to Inertia view with songs and categories
        return Inertia::render('Song', [
            'songs' => $songs,
            'category' => Category::select('id', 'category_name')->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'song_name' => 'required|string|max:255',
            'lyric' => 'nullable|string',
            'url' => 'required|url',
            'cover_photo' => 'nullable|image|max:2048',
            'status' => 'required|in:public,private',
            'category_id' => 'nullable|integer|exists:categories,id',
        ]);

        try {
            // Handle file upload for cover photo
            if ($request->hasFile('cover_photo')) {
                $file = $request->file('cover_photo');
                $filename = time() . '_' . $file->getClientOriginalName();
                $path = $file->storeAs('uploads', $filename, 'public');
                $validated['cover_photo'] = '/storage/' . $path;
            }

            // Create song record
            $song = Song::create($validated);
            \Log::info('Song created: ', $song->toArray());

            return redirect()->route('song.index')->with('success', 'Song added successfully.');
        } catch (\Exception $e) {
            \Log::error('Error creating song: ' . $e->getMessage());
            return redirect()->route('song.index')->with('error', 'Failed to add song: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Song $song)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Song $song)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $song = Song::findOrFail($id);

        $request->validate([
            'song_name' => 'required|string|max:255',
            'lyric' => 'nullable|string',
            'url' => 'required|url',
            'cover_photo' => 'nullable|image|max:2048',
            'status' => 'required|in:public,private',
            'category_id' => 'nullable|integer|exists:categories,id',
        ]);

        $data = $request->only(['song_name', 'lyric', 'url', 'status', 'category_id']);
        if ($request->hasFile('cover_photo')) {
            $file = $request->file('cover_photo');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('uploads', $filename, 'public');
            $data['cover_photo'] = '/storage/' . $path;
        }

        if ($song->update($data)) {
            \Log::info('Song updated: ', $song->toArray());
            return redirect()->route('song.index')->with('success', 'Song updated successfully.');
        } else {
            \Log::error('Error updating song: ' . $song->getErrors());
            return redirect()->route('song.index')->with('error', 'Failed to update song.');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Song $song)
    {
        //
    }

    public function byCategory(Category $category)
    {
        $songs = Song::where('category_id', $category->id)->with('category')->get();
        return Inertia::render('welcome', [
            'songs' => $songs,
            'categories' => Category::all(), // Optional if you still want categories
        ]);
    }

}
