<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('student', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->nullable()->after('id');
            $table->unsignedBigInteger('professor_id')->nullable()->after('user_id');
            $table->string('email', 191)->nullable()->after('surname');
            $table->string('theoretical_group', 100)->nullable()->after('email');

            $table->foreign('user_id')->references('id')->on('users')->nullOnDelete();
            $table->foreign('professor_id')->references('id')->on('users')->nullOnDelete();
            $table->index('email');
        });
    }

    public function down(): void
    {
        Schema::table('student', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropForeign(['professor_id']);
            $table->dropColumn(['user_id', 'professor_id', 'email', 'theoretical_group']);
        });
    }
};
