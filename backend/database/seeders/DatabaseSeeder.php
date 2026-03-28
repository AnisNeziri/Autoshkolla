<?php

namespace Database\Seeders;

use App\Models\Autoschool;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        DB::transaction(function () {
            User::query()->updateOrCreate(
                ['email' => 'admin@admin.admin'],
                [
                    'name' => 'System Admin',
                    'password' => Hash::make('anisadmini'),
                    'role' => 'admin',
                    'must_change_password' => false,
                ]
            );

            $prof = User::query()->updateOrCreate(
                ['email' => 'professor@autoshkolla.test'],
                [
                    'name' => 'Professor Demo',
                    'password' => Hash::make('password'),
                    'role' => 'professor',
                    'must_change_password' => false,
                ]
            );

            $school = Autoschool::query()->firstOrCreate(
                ['numri_biz' => 'DEMO-BIZ-001'],
                [
                    'name' => 'Autoshkolla Demo Shkollë',
                    'owners_name' => 'Demo',
                    'owners_surname' => 'Professor',
                    'invitation_code' => 'DEMO-INV-001',
                    'user_id' => $prof->id,
                    'created_at' => now(),
                ]
            );

            if (! $school->user_id) {
                $school->update(['user_id' => $prof->id]);
            }

            $prof->update(['autoschool_id' => $school->id]);
        });
    }
}
