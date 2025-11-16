<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class TodoController extends Controller
{
    // Menampilkan daftar todos
    public function index(Request $request)
    {
        $user = Auth::user();
        $search = $request->input('search');
        $filter = $request->input('filter'); // all, finished, unfinished

        $query = Todo::where('user_id', $user->id);

        // Pencarian
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'ILIKE', "%{$search}%")
                  ->orWhere('description', 'ILIKE', "%{$search}%");
            });
        }

        // Filter
        if ($filter === 'finished') {
            $query->where('is_finished', true);
        } elseif ($filter === 'unfinished') {
            $query->where('is_finished', false);
        }

        // Pagination
        $todos = $query->orderBy('created_at', 'desc')->paginate(20);

        // Statistik
        $stats = [
            'total' => Todo::where('user_id', $user->id)->count(),
            'finished' => Todo::where('user_id', $user->id)->where('is_finished', true)->count(),
            'unfinished' => Todo::where('user_id', $user->id)->where('is_finished', false)->count(),
        ];

        return Inertia::render('app/TodoPage', [
            'todos' => $todos,
            'stats' => $stats,
            'filters' => [
                'search' => $search,
                'filter' => $filter,
            ],
        ]);
    }

    // Menyimpan todo baru
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'cover' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $data = [
            'user_id' => Auth::id(),
            'title' => $request->title,
            'description' => $request->description,
            'is_finished' => false,
        ];

        // Upload cover jika ada
        if ($request->hasFile('cover')) {
            $file = $request->file('cover');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('covers', $filename, 'public');
            $data['cover'] = $path;
        }

        Todo::create($data);

        return redirect()->route('todos.index')->with('success', 'Todo berhasil ditambahkan!');
    }

    // Menampilkan form edit
    public function edit($id)
    {
        $todo = Todo::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        return Inertia::render('app/TodoEditPage', [
            'todo' => $todo,
        ]);
    }

    // Update todo
    public function update(Request $request, $id)
    {
        $todo = Todo::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'cover' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $data = [
            'title' => $request->title,
            'description' => $request->description,
        ];

        // Upload cover baru jika ada
        if ($request->hasFile('cover')) {
            // Hapus cover lama
            if ($todo->cover) {
                Storage::disk('public')->delete($todo->cover);
            }

            $file = $request->file('cover');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('covers', $filename, 'public');
            $data['cover'] = $path;
        }

        $todo->update($data);

        return redirect()->route('todos.index')->with('success', 'Todo berhasil diperbarui!');
    }

    // Toggle status finished
    public function toggleFinish($id)
    {
        $todo = Todo::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $todo->update([
            'is_finished' => !$todo->is_finished,
        ]);

        return redirect()->route('todos.index')->with('success', 'Status todo berhasil diubah!');
    }

    // Hapus todo
    public function destroy($id)
    {
        $todo = Todo::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        // Hapus cover jika ada
        if ($todo->cover) {
            Storage::disk('public')->delete($todo->cover);
        }

        $todo->delete();

        return redirect()->route('todos.index')->with('success', 'Todo berhasil dihapus!');
    }

    // Update cover saja
    public function updateCover(Request $request, $id)
    {
        $todo = Todo::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $request->validate([
            'cover' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Hapus cover lama
        if ($todo->cover) {
            Storage::disk('public')->delete($todo->cover);
        }

        // Upload cover baru
        $file = $request->file('cover');
        $filename = time() . '_' . $file->getClientOriginalName();
        $path = $file->storeAs('covers', $filename, 'public');

        $todo->update(['cover' => $path]);

        return redirect()->route('todos.index')->with('success', 'Cover berhasil diperbarui!');
    }

    // Hapus cover
    public function deleteCover($id)
    {
        $todo = Todo::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        if ($todo->cover) {
            Storage::disk('public')->delete($todo->cover);
            $todo->update(['cover' => null]);
        }

        return redirect()->route('todos.index')->with('success', 'Cover berhasil dihapus!');
    }
}