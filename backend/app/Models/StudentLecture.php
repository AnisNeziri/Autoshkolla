<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentLecture extends Model
{
    protected $table = 'student_lectures';

    protected $fillable = [
        'student_id',
        'lecture_date',
        'lecture_time',
        'present',
    ];

    protected $casts = [
        'lecture_date' => 'date',
        'present' => 'boolean',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class, 'student_id');
    }
}
