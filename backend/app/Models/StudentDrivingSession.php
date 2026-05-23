<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentDrivingSession extends Model
{
    protected $table = 'student_driving_sessions';

    protected $fillable = [
        'student_id',
        'session_date',
        'session_time',
        'completed',
    ];

    protected $casts = [
        'session_date' => 'date',
        'completed' => 'boolean',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class, 'student_id');
    }
}
