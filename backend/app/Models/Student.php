<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Student extends Model
{
    protected $table = 'student';

    public $timestamps = false;

    protected $fillable = [
        'name',
        'surname',
        'autoschool_id',
        'registered_at',
        'user_id',
        'professor_id',
        'email',
        'theoretical_group',
        'professor_group_id',
    ];

    protected $casts = [
        'registered_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function professor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'professor_id');
    }

    public function autoschool(): BelongsTo
    {
        return $this->belongsTo(Autoschool::class, 'autoschool_id');
    }

    public function lectures(): HasMany
    {
        return $this->hasMany(StudentLecture::class, 'student_id');
    }

    public function drivingSessions(): HasMany
    {
        return $this->hasMany(StudentDrivingSession::class, 'student_id');
    }

    public function professorGroup(): BelongsTo
    {
        return $this->belongsTo(ProfessorGroup::class, 'professor_group_id');
    }

    public function exams(): HasMany
    {
        return $this->hasMany(Exam::class, 'student_id');
    }
}
