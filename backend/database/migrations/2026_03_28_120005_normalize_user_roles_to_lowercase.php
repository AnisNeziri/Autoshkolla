<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        foreach (['ADMIN', 'PROFESSOR', 'STUDENT', 'CANDIDATE'] as $legacy) {
            $lower = strtolower($legacy === 'CANDIDATE' ? 'student' : $legacy);
            DB::table('users')->where('role', $legacy)->update(['role' => $lower]);
        }
    }

    public function down(): void
    {
        // no-op: cannot reliably restore mixed case
    }
};
