<?php

namespace Database\Factories;

use App\Models\Student;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class StudentFactory extends Factory
{
    protected $model = Student::class;

    public function definition(): array
    {
        return [
            'name' => fake()->firstName(),
            'surname' => fake()->lastName(),
            'autoschool_id' => null,
            'professor_id' => User::factory()->create(['role' => 'professor'])->id,
            'registered_at' => now(),
        ];
    }

    public function forProfessor(User $professor): static
    {
        return $this->state(fn () => ['professor_id' => $professor->id]);
    }
}
