<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Exam extends Model
{
    protected $table = 'exam';

    public $timestamps = false;

    protected $fillable = [
        'student_id',
        'lloji_provimit',
        'exam_date',
        'Rezultati',
    ];

    protected $casts = [
        'Rezultati' => 'boolean',
        'exam_date' => 'date',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class, 'student_id');
    }
}
