<?php

namespace App\Http\Controllers\Professor;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\StudentLecture;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class LectureController extends Controller
{
    public function store(Request $request, int $studentId)
    {
        $this->authorizeStudent($request, $studentId);

        $existing = StudentLecture::query()->where('student_id', $studentId)->count();
        if ($existing >= 12) {
            throw ValidationException::withMessages([
                'lecture' => ['Maximum of 12 lectures recorded.'],
            ]);
        }

        $data = $request->validate([
            'date' => ['required', 'date'],
            'time' => ['required', 'date_format:H:i'],
            'present' => ['sometimes', 'boolean'],
        ]);

        $lecture = StudentLecture::create([
            'student_id' => $studentId,
            'lecture_date' => $data['date'],
            'lecture_time' => $data['time'],
            'present' => $data['present'] ?? true,
        ]);

        return response()->json($lecture, 201);
    }

    public function update(Request $request, int $studentId, int $lectureId)
    {
        $this->authorizeStudent($request, $studentId);

        $lecture = StudentLecture::query()
            ->whereKey($lectureId)
            ->where('student_id', $studentId)
            ->firstOrFail();

        $data = $request->validate([
            'date' => ['sometimes', 'date'],
            'time' => ['sometimes', 'date_format:H:i'],
            'present' => ['sometimes', 'boolean'],
        ]);

        if (isset($data['date'])) {
            $lecture->lecture_date = $data['date'];
        }
        if (isset($data['time'])) {
            $lecture->lecture_time = $data['time'];
        }
        if (array_key_exists('present', $data)) {
            $lecture->present = (bool) $data['present'];
        }
        $lecture->save();

        return response()->json($lecture->fresh());
    }

    private function authorizeStudent(Request $request, int $studentId): void
    {
        /** @var User $prof */
        $prof = $request->user();

        $ok = Student::query()
            ->whereKey($studentId)
            ->where('professor_id', $prof->id)
            ->exists();

        if (! $ok) {
            abort(404);
        }
    }
}
