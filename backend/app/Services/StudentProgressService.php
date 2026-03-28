<?php

namespace App\Services;

use App\Models\Student;

class StudentProgressService
{
    public function compute(Student $student): array
    {
        $lectureCount = $student->lectures()->count();
        $lecturePresent = $student->lectures()->where('present', true)->count();

        $sessionsTotal = $student->drivingSessions()->count();
        $sessionsDone = $student->drivingSessions()->where('completed', true)->count();
        $targetDays = $sessionsTotal > 0 ? max(5, min(20, $sessionsTotal)) : 5;
        $drivingRatio = $targetDays > 0 ? min(1, $sessionsDone / $targetDays) : 0;

        $writtenPassed = $student->exams()
            ->where('lloji_provimit', 'written')
            ->where('Rezultati', true)
            ->exists();

        $practicalScheduled = $student->exams()
            ->where('lloji_provimit', 'practical')
            ->exists();

        $lectureRatio = min(1, $lectureCount / 12);

        $fraction = (0.4 * $lectureRatio)
            + (0.4 * $drivingRatio)
            + ($writtenPassed ? 0.1 : 0)
            + ($practicalScheduled ? 0.1 : 0);

        $fraction = max(0, min(1, $fraction));

        return [
            'progress_percent' => (int) round($fraction * 100),
            'lectures_total' => $lectureCount,
            'lectures_present' => $lecturePresent,
            'lectures_cap' => 12,
            'driving_sessions_total' => $sessionsTotal,
            'driving_sessions_completed' => $sessionsDone,
            'written_test_passed' => $writtenPassed,
            'driving_test_scheduled' => $practicalScheduled,
        ];
    }
}
