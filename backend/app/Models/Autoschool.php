<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Autoschool extends Model
{
    protected $table = 'autoschool';

    public $timestamps = false;

    protected $fillable = [
        'name',
        'owners_name',
        'owners_surname',
        'numri_biz',
        'invitation_code',
        'user_id',
        'created_at',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function students(): HasMany
    {
        return $this->hasMany(Student::class, 'autoschool_id');
    }
}
