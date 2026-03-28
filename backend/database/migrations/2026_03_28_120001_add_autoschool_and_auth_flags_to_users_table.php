<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('users', 'must_change_password')) {
            Schema::table('users', function (Blueprint $table) {
                $table->boolean('must_change_password')->default(false)->after('remember_token');
            });
        }

        if (! Schema::hasColumn('users', 'autoschool_id')) {
            Schema::table('users', function (Blueprint $table) {
                // Match legacy `autoschool.id` (signed INT), not unsigned.
                $table->integer('autoschool_id')->nullable()->after('must_change_password');
            });
        }

        if (Schema::hasColumn('users', 'autoschool_id')) {
            try {
                Schema::table('users', function (Blueprint $table) {
                    $table->foreign('autoschool_id')->references('id')->on('autoschool')->nullOnDelete();
                });
            } catch (\Throwable $e) {
                // Foreign key may already exist from a partial migration run.
            }
        }
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['autoschool_id']);
            $table->dropColumn(['must_change_password', 'autoschool_id']);
        });
    }
};
