<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('student_lectures');

        Schema::create('student_lectures', function (Blueprint $table) {
            $table->id();
            $table->integer('student_id');
            $table->date('lecture_date');
            $table->time('lecture_time');
            $table->boolean('present')->default(true);
            $table->timestamps();

            $table->foreign('student_id')->references('id')->on('student')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_lectures');
    }
};
