<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProfessorGroup extends Model
{
    protected $fillable = [
        'professor_id',
        'name',
        'lecture_days',
        'schedule_time',
    ];

    public function professor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'professor_id');
    }

    public function students(): HasMany
    {
        return $this->hasMany(Student::class, 'professor_group_id');
    }
}
