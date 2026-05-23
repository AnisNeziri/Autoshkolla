<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('professor_groups', function (Blueprint $table) {
            $table->id();
            $table->foreignId('professor_id')->constrained('users')->cascadeOnDelete();
            $table->string('name', 120);
            $table->text('lecture_days')->nullable();
            $table->string('schedule_time', 50)->nullable();
            $table->timestamps();
        });

        Schema::table('student', function (Blueprint $table) {
            $table->foreignId('professor_group_id')->nullable()->after('theoretical_group')->constrained('professor_groups')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('student', function (Blueprint $table) {
            $table->dropForeign(['professor_group_id']);
            $table->dropColumn('professor_group_id');
        });
        Schema::dropIfExists('professor_groups');
    }
};
