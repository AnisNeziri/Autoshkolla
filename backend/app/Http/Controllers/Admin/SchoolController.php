<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Autoschool;
use App\Models\Exam;
use App\Models\Student;
use App\Models\StudentDrivingSession;
use App\Models\StudentLecture;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class SchoolController extends Controller
{
    public function index()
    {
        $schools = Autoschool::query()
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (Autoschool $s) => [
                'id' => $s->id,
                'name' => $s->name,
                'owners_name' => $s->owners_name,
                'owners_surname' => $s->owners_surname,
                'numri_biz' => $s->numri_biz,
                'invitation_code' => $s->invitation_code,
                'owner_user_id' => $s->user_id,
                'created_at' => $s->created_at?->toIso8601String(),
            ]);

        return response()->json($schools);
    }

    public function destroy(int $id)
    {
        $school = Autoschool::query()->findOrFail($id);

        DB::transaction(function () use ($school) {
            $ownerId = $school->user_id;

            if ($ownerId) {
                $studentIds = Student::query()
                    ->where('professor_id', $ownerId)
                    ->pluck('id');

                foreach ($studentIds as $sid) {
                    Exam::query()->where('student_id', $sid)->delete();
                    StudentLecture::query()->where('student_id', $sid)->delete();
                    StudentDrivingSession::query()->where('student_id', $sid)->delete();
                }

                $studentUserIds = Student::query()
                    ->where('professor_id', $ownerId)
                    ->whereNotNull('user_id')
                    ->pluck('user_id');

                Student::query()->where('professor_id', $ownerId)->delete();

                foreach ($studentUserIds as $uid) {
                    User::query()->whereKey($uid)->delete();
                }

                User::query()->whereKey($ownerId)->delete();
            }

            User::query()->where('autoschool_id', $school->id)->update(['autoschool_id' => null]);
            $school->delete();
        });

        return response()->json(['message' => 'Driving school removed']);
    }
}
