<?php

namespace Tests\Feature;

use App\Models\ProfessorGroup;
use App\Models\Student;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExamRulesFeatureTest extends TestCase
{
    use RefreshDatabase;

    public function test_practical_exam_returns_422_without_written_pass(): void
    {
        $professor = User::factory()->create(['role' => 'professor']);
        $student = Student::factory()->forProfessor($professor)->create();

        $response = $this->actingAs($professor)->putJson(
            "/api/professor/students/{$student->id}/exams/practical",
            ['exam_date' => now()->format('Y-m-d')]
        );

        $response->assertStatus(422);
    }

    public function test_written_exam_can_be_set_to_passed(): void
    {
        $professor = User::factory()->create(['role' => 'professor']);
        $student = Student::factory()->forProfessor($professor)->create();

        $response = $this->actingAs($professor)->putJson(
            "/api/professor/students/{$student->id}/exams/written",
            ['passed' => true, 'exam_date' => now()->format('Y-m-d')]
        );

        $response->assertSuccessful();
    }

    public function test_professor_cannot_access_other_professor_student(): void
    {
        $profA = User::factory()->create(['role' => 'professor']);
        $profB = User::factory()->create(['role' => 'professor']);
        $studentB = Student::factory()->forProfessor($profB)->create();

        $response = $this->actingAs($profA)->getJson("/api/professor/students/{$studentB->id}");
        $this->assertContains($response->status(), [403, 404, 422]);
    }

    public function test_cannot_delete_group_with_students(): void
    {
        $professor = User::factory()->create(['role' => 'professor']);
        $group = ProfessorGroup::create([
            'professor_id' => $professor->id,
            'name' => 'Grup Test',
        ]);
        Student::factory()->forProfessor($professor)->create(['professor_group_id' => $group->id]);

        $this->actingAs($professor)
            ->deleteJson("/api/professor/groups/{$group->id}")
            ->assertStatus(422);
    }

    public function test_admin_schools_requires_admin_role(): void
    {
        $professor = User::factory()->create(['role' => 'professor']);
        $this->actingAs($professor)->getJson('/api/admin/schools')->assertStatus(403);
    }

    public function test_login_returns_token_for_valid_credentials(): void
    {
        User::factory()->create([
            'email' => 'login-test@autoshkolla.test',
            'password' => bcrypt('Secret123!'),
            'role' => 'professor',
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'login-test@autoshkolla.test',
            'password' => 'Secret123!',
        ]);

        $response->assertSuccessful();
        $response->assertJsonStructure(['token']);
    }

    public function test_me_requires_authentication(): void
    {
        $this->getJson('/api/me')->assertStatus(401);
    }

    public function test_lecture_limit_twelfth_allowed_thirteenth_rejected(): void
    {
        $professor = User::factory()->create(['role' => 'professor']);
        $student = Student::factory()->forProfessor($professor)->create();

        for ($n = 0; $n < 12; $n++) {
            $this->actingAs($professor)->postJson(
                "/api/professor/students/{$student->id}/lectures",
                [
                    'date' => now()->format('Y-m-d'),
                    'time' => '10:00',
                    'present' => true,
                ]
            )->assertSuccessful();
        }

        $this->actingAs($professor)->postJson(
            "/api/professor/students/{$student->id}/lectures",
            ['date' => now()->format('Y-m-d'), 'time' => '11:00', 'present' => true]
        )->assertStatus(422);
    }

    public function test_practical_exam_allowed_after_written_passed(): void
    {
        $professor = User::factory()->create(['role' => 'professor']);
        $student = Student::factory()->forProfessor($professor)->create();

        $this->actingAs($professor)->putJson(
            "/api/professor/students/{$student->id}/exams/written",
            ['passed' => true, 'exam_date' => now()->format('Y-m-d')]
        )->assertSuccessful();

        $this->actingAs($professor)->putJson(
            "/api/professor/students/{$student->id}/exams/practical",
            ['exam_date' => now()->addDays(7)->format('Y-m-d')]
        )->assertSuccessful();
    }
}
