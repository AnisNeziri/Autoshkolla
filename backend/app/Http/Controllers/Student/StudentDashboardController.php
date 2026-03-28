<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\StudentProgressService;
use Illuminate\Http\Request;

class StudentDashboardController extends Controller
{
    public function __construct(
        private StudentProgressService $progress
    ) {}

    public function me(Request $request)
    {
        /** @var User $user */
        $user = $request->user();

        $student = $user->studentProfile;
        if (! $student) {
            return response()->json([
                'message' => 'No student profile linked to this account.',
            ], 404);
        }

        $student->load(['lectures', 'drivingSessions', 'exams']);

        $p = $this->progress->compute($student);
        $written = $student->exams->firstWhere('lloji_provimit', 'written');
        $practical = $student->exams->firstWhere('lloji_provimit', 'practical');

        return response()->json([
            'profile' => [
                'name' => $student->name,
                'surname' => $student->surname,
                'email' => $student->email,
                'theoretical_group' => $student->theoretical_group,
            ],
            'progress' => $p,
            'lectures' => $student->lectures->sortBy('lecture_date')->values()->map(fn ($l) => [
                'date' => $l->lecture_date->format('Y-m-d'),
                'time' => substr((string) $l->lecture_time, 0, 5),
                'present' => (bool) $l->present,
            ]),
            'driving_sessions' => $student->drivingSessions->sortBy('session_date')->values()->map(fn ($d) => [
                'date' => $d->session_date->format('Y-m-d'),
                'time' => substr((string) $d->session_time, 0, 5),
                'completed' => (bool) $d->completed,
            ]),
            'written_exam' => $written ? [
                'exam_date' => $written->exam_date?->format('Y-m-d'),
                'passed' => (bool) $written->Rezultati,
            ] : null,
            'practical_exam' => $practical ? [
                'exam_date' => $practical->exam_date?->format('Y-m-d'),
                'passed' => (bool) $practical->Rezultati,
            ] : null,
        ]);
    }
}
