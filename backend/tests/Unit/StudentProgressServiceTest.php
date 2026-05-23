<?php

namespace Tests\Unit;

use App\Models\Exam;
use App\Models\Student;
use App\Models\StudentLecture;
use App\Models\User;
use App\Services\StudentProgressService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StudentProgressServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_progress_zero_for_new_student(): void
    {
        $professor = User::factory()->create(['role' => 'professor']);
        $student = Student::factory()->forProfessor($professor)->create();
        $progress = (new StudentProgressService())->compute($student);
        $this->assertEquals(0, $progress['progress_percent']);
    }

    public function test_progress_with_six_lectures_is_partial(): void
    {
        $professor = User::factory()->create(['role' => 'professor']);
        $student = Student::factory()->forProfessor($professor)->create();
        for ($i = 0; $i < 6; $i++) {
            StudentLecture::create([
                'student_id' => $student->id,
                'lecture_date' => now()->format('Y-m-d'),
                'lecture_time' => '09:00:00',
                'present' => true,
            ]);
        }
        $progress = (new StudentProgressService())->compute($student->fresh());
        $this->assertGreaterThanOrEqual(15, $progress['progress_percent']);
    }

    public function test_written_exam_pass_adds_ten_percent(): void
    {
        $professor = User::factory()->create(['role' => 'professor']);
        $student = Student::factory()->forProfessor($professor)->create();
        Exam::create([
            'student_id' => $student->id,
            'lloji_provimit' => 'written',
            'exam_date' => now()->format('Y-m-d'),
            'Rezultati' => true,
        ]);
        $progress = (new StudentProgressService())->compute($student->fresh());
        $this->assertGreaterThanOrEqual(10, $progress['progress_percent']);
    }
}