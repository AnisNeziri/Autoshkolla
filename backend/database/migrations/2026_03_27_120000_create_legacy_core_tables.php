<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('autoschool')) {
            Schema::create('autoschool', function (Blueprint $table) {
                $table->increments('id');
                $table->string('name', 100);
                $table->string('owners_name', 50);
                $table->string('owners_surname', 50);
                $table->string('numri_biz', 20)->unique();
                $table->string('invitation_code', 20)->unique();
                $table->timestamp('created_at')->useCurrent();
            });
        }

        if (! Schema::hasTable('student')) {
            Schema::create('student', function (Blueprint $table) {
                $table->increments('id');
                $table->string('name', 50);
                $table->string('surname', 50);
                $table->unsignedInteger('autoschool_id')->nullable();
                $table->timestamp('registered_at')->useCurrent();
                $table->foreign('autoschool_id')->references('id')->on('autoschool')->cascadeOnDelete();
            });
        }

        if (! Schema::hasTable('exam')) {
            Schema::create('exam', function (Blueprint $table) {
                $table->increments('id');
                $table->unsignedInteger('student_id');
                $table->string('lloji_provimit', 20);
                $table->date('exam_date');
                $table->boolean('Rezultati')->default(false);
                $table->foreign('student_id')->references('id')->on('student')->cascadeOnDelete();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('exam');
        Schema::dropIfExists('student');
        Schema::dropIfExists('autoschool');
    }
};
