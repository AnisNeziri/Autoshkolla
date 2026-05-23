<?php

namespace App\Http\Controllers\Professor;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\StudentDrivingSession;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class DrivingSessionController extends Controller
{
    public function store(Request $request, int $studentId)
    {
        $this->authorizeStudent($request, $studentId);

        $total = StudentDrivingSession::query()->where('student_id', $studentId)->count();
        if ($total >= 20) {
            throw ValidationException::withMessages([
                'session' => ['Maximum of 20 driving days scheduled.'],
            ]);
        }

        $data = $request->validate([
            'date' => ['required', 'date'],
            'time' => ['required', 'date_format:H:i'],
            'completed' => ['sometimes', 'boolean'],
        ]);

        $session = StudentDrivingSession::create([
            'student_id' => $studentId,
            'session_date' => $data['date'],
            'session_time' => $data['time'],
            'completed' => $data['completed'] ?? false,
        ]);

        return response()->json($session, 201);
    }

    public function update(Request $request, int $studentId, int $sessionId)
    {
        $this->authorizeStudent($request, $studentId);

        $session = StudentDrivingSession::query()
            ->whereKey($sessionId)
            ->where('student_id', $studentId)
            ->firstOrFail();

        $data = $request->validate([
            'date' => ['sometimes', 'date'],
            'time' => ['sometimes', 'date_format:H:i'],
            'completed' => ['sometimes', 'boolean'],
        ]);

        if (isset($data['date'])) {
            $session->session_date = $data['date'];
        }
        if (isset($data['time'])) {
            $session->session_time = $data['time'];
        }
        if (array_key_exists('completed', $data)) {
            $session->completed = (bool) $data['completed'];
        }
        $session->save();

        return response()->json($session->fresh());
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
