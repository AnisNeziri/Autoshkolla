<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('student_driving_sessions', function (Blueprint $table) {
            $table->id();
            $table->integer('student_id');
            $table->date('session_date');
            $table->time('session_time');
            $table->boolean('completed')->default(false);
            $table->timestamps();

            $table->foreign('student_id')->references('id')->on('student')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_driving_sessions');
    }
};
