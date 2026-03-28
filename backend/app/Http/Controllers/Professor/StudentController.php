<?php

namespace App\Http\Controllers\Professor;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\User;
use App\Services\StudentProgressService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class StudentController extends Controller
{
    public function __construct(
        private StudentProgressService $progress
    ) {}

    public function index(Request $request)
    {
        /** @var User $prof */
        $prof = $request->user();

        $students = Student::query()
            ->where('professor_id', $prof->id)
            ->withCount(['lectures', 'drivingSessions'])
            ->orderBy('registered_at', 'desc')
            ->get()
            ->map(fn (Student $s) => $this->transformStudentSummary($s));

        return response()->json($students);
    }

    public function store(Request $request)
    {
        /** @var User $prof */
        $prof = $request->user();

        $data = $request->validate([
            'name' => ['required', 'string', 'max:50'],
            'surname' => ['required', 'string', 'max:50'],
            'email' => [
                'required',
                'email',
                'max:191',
                Rule::unique('users', 'email'),
                Rule::unique('student', 'email'),
            ],
            'theoretical_group' => ['nullable', 'string', 'max:100'],
        ]);

        $plainPassword = Str::random(12);

        $studentRow = null;

        DB::transaction(function () use ($data, $prof, $plainPassword, &$studentRow) {
            $user = User::create([
                'name' => trim($data['name'].' '.$data['surname']),
                'email' => $data['email'],
                'password' => Hash::make($plainPassword),
                'role' => 'student',
                'must_change_password' => true,
                'autoschool_id' => $prof->autoschool_id,
            ]);

            $studentRow = Student::create([
                'name' => $data['name'],
                'surname' => $data['surname'],
                'email' => $data['email'],
                'autoschool_id' => $prof->autoschool_id,
                'user_id' => $user->id,
                'professor_id' => $prof->id,
                'theoretical_group' => $data['theoretical_group'] ?? null,
                'registered_at' => now(),
            ]);
        });

        $studentRow->load(['lectures', 'drivingSessions', 'exams']);

        return response()->json([
            'student' => $this->transformStudentDetail($studentRow),
            'generated_password' => $plainPassword,
            'message' =>
                'Studenti u krijua. Ndani fjalëkalimin e përkohshëm; studenti duhet ta ndryshojë pas hyrjes.',
        ], 201);
    }

    public function show(Request $request, int $id)
    {
        $student = $this->findOwnedOrFail($request, $id);

        return response()->json($this->transformStudentDetail($student));
    }

    public function update(Request $request, int $id)
    {
        $student = $this->findOwnedOrFail($request, $id);

        $data = $request->validate([
            'theoretical_group' => ['nullable', 'string', 'max:100'],
        ]);

        $student->update($data);

        return response()->json($this->transformStudentDetail($student->fresh()));
    }

    public function destroy(Request $request, int $id)
    {
        $student = $this->findOwnedOrFail($request, $id);
        $user = $student->user;

        DB::transaction(function () use ($student) {
            $student->lectures()->delete();
            $student->drivingSessions()->delete();
            $student->exams()->delete();
            $student->delete();
        });

        if ($user) {
            $user->tokens()->delete();
            $user->delete();
        }

        return response()->json(['message' => 'Studenti u fshi.']);
    }

    private function findOwnedOrFail(Request $request, int $id): Student
    {
        /** @var User $prof */
        $prof = $request->user();

        $student = Student::query()
            ->whereKey($id)
            ->where('professor_id', $prof->id)
            ->first();

        if (! $student) {
            throw ValidationException::withMessages([
                'student' => ['Studenti nuk u gjet ose nuk ju është caktuar.'],
            ]);
        }

        return $student;
    }

    private function transformStudentSummary(Student $s): array
    {
        $s->loadMissing(['exams']);
        $p = $this->progress->compute($s);

        $written = $s->exams->firstWhere('lloji_provimit', 'written');
        $practical = $s->exams->firstWhere('lloji_provimit', 'practical');

        return [
            'id' => $s->id,
            'user_id' => $s->user_id,
            'name' => $s->name,
            'surname' => $s->surname,
            'email' => $s->email,
            'theoretical_group' => $s->theoretical_group,
            'lectures_count' => $p['lectures_total'],
            'lectures_present' => $p['lectures_present'],
            'driving_sessions_count' => $p['driving_sessions_total'],
            'driving_sessions_completed' => $p['driving_sessions_completed'],
            'written_test_passed' => $p['written_test_passed'],
            'driving_test_date' => $practical?->exam_date?->format('Y-m-d'),
            'progress_percent' => $p['progress_percent'],
        ];
    }

    private function transformStudentDetail(Student $s): array
    {
        $s->load(['lectures', 'drivingSessions', 'exams']);
        $p = $this->progress->compute($s);

        $written = $s->exams->firstWhere('lloji_provimit', 'written');
        $practical = $s->exams->firstWhere('lloji_provimit', 'practical');

        return [
            'id' => $s->id,
            'user_id' => $s->user_id,
            'name' => $s->name,
            'surname' => $s->surname,
            'email' => $s->email,
            'theoretical_group' => $s->theoretical_group,
            'progress' => $p,
            'lectures' => $s->lectures->sortBy('lecture_date')->values()->map(fn ($l) => [
                'id' => $l->id,
                'date' => $l->lecture_date->format('Y-m-d'),
                'time' => substr((string) $l->lecture_time, 0, 5),
                'present' => (bool) $l->present,
            ]),
            'driving_sessions' => $s->drivingSessions->sortBy('session_date')->values()->map(fn ($d) => [
                'id' => $d->id,
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
        ];
    }
}
