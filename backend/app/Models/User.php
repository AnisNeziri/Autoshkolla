<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'must_change_password',
        'autoschool_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'must_change_password' => 'boolean',
    ];

    public function autoschool(): BelongsTo
    {
        return $this->belongsTo(Autoschool::class, 'autoschool_id');
    }

    public function ownedAutoschool(): HasOne
    {
        return $this->hasOne(Autoschool::class, 'user_id');
    }

    public function studentsAsProfessor(): HasMany
    {
        return $this->hasMany(Student::class, 'professor_id');
    }

    public function studentProfile(): HasOne
    {
        return $this->hasOne(Student::class, 'user_id');
    }

    public function professorGroups(): HasMany
    {
        return $this->hasMany(ProfessorGroup::class, 'professor_id');
    }

    public function isAdmin(): bool
    {
        return strtolower((string) $this->role) === 'admin';
    }

    public function isProfessor(): bool
    {
        return strtolower((string) $this->role) === 'professor';
    }

    public function isStudent(): bool
    {
        return strtolower((string) $this->role) === 'student';
    }
}
