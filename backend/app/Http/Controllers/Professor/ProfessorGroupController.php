<?php

namespace App\Http\Controllers\Professor;

use App\Http\Controllers\Controller;
use App\Models\ProfessorGroup;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ProfessorGroupController extends Controller
{
    public function index(Request $request)
    {
        /** @var User $prof */
        $prof = $request->user();

        return response()->json(
            ProfessorGroup::query()
                ->where('professor_id', $prof->id)
                ->orderBy('name')
                ->get()
        );
    }

    public function store(Request $request)
    {
        /** @var User $prof */
        $prof = $request->user();

        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'lecture_days' => ['nullable', 'string', 'max:500'],
            'schedule_time' => ['nullable', 'string', 'max:50'],
        ]);

        $group = ProfessorGroup::create([
            'professor_id' => $prof->id,
            'name' => $data['name'],
            'lecture_days' => $data['lecture_days'] ?? null,
            'schedule_time' => $data['schedule_time'] ?? null,
        ]);

        return response()->json($group, 201);
    }

    public function update(Request $request, int $id)
    {
        $group = $this->findOwnedOrFail($request, $id);

        $data = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:120'],
            'lecture_days' => ['nullable', 'string', 'max:500'],
            'schedule_time' => ['nullable', 'string', 'max:50'],
        ]);

        $group->update($data);

        return response()->json($group->fresh());
    }

    public function destroy(Request $request, int $id)
    {
        $group = $this->findOwnedOrFail($request, $id);
        $group->delete();

        return response()->json(['message' => 'Grupi u fshi.']);
    }

    private function findOwnedOrFail(Request $request, int $id): ProfessorGroup
    {
        /** @var User $prof */
        $prof = $request->user();

        $group = ProfessorGroup::query()
            ->whereKey($id)
            ->where('professor_id', $prof->id)
            ->first();

        if (! $group) {
            throw ValidationException::withMessages([
                'group' => ['Grupi nuk u gjet ose nuk ju përket.'],
            ]);
        }

        return $group;
    }
}
