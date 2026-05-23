<?php

namespace App\Http\Controllers\Professor;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;

class ExamController extends Controller
{
    public function updateWritten(Request $request, int $studentId)
    {
        $this->authorizeStudent($request, $studentId);

        $data = $request->validate([
            'passed' => ['required', 'boolean'],
            'exam_date' => ['nullable', 'date'],
        ]);

        $date = $data['exam_date'] ?? now()->format('Y-m-d');

        Exam::query()->updateOrCreate(
            [
                'student_id' => $studentId,
                'lloji_provimit' => 'written',
            ],
            [
                'exam_date' => $date,
                'Rezultati' => $data['passed'],
            ]
        );

        return response()->json(['message' => 'Written exam updated']);
    }

    public function updatePractical(Request $request, int $studentId)
    {
        $this->authorizeStudent($request, $studentId);

        $writtenPassed = Exam::query()
            ->where('student_id', $studentId)
            ->where('lloji_provimit', 'written')
            ->where('Rezultati', true)
            ->exists();

        if (! $writtenPassed) {
            return response()->json([
                'message' => 'Written test must be passed before scheduling the driving test.',
            ], 422);
        }

        $data = $request->validate([
            'exam_date' => ['required', 'date'],
            'passed' => ['sometimes', 'boolean'],
        ]);

        Exam::query()->updateOrCreate(
            [
                'student_id' => $studentId,
                'lloji_provimit' => 'practical',
            ],
            [
                'exam_date' => $data['exam_date'],
                'Rezultati' => $data['passed'] ?? false,
            ]
        );

        return response()->json(['message' => 'Driving test updated']);
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
