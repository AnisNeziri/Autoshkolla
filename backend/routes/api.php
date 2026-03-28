<?php

use App\Http\Controllers\Admin\AnalyticsController;
use App\Http\Controllers\Admin\SchoolController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Professor\DrivingSessionController;
use App\Http\Controllers\Professor\ExamController;
use App\Http\Controllers\Professor\LectureController;
use App\Http\Controllers\Professor\StudentController as ProfessorStudentController;
use App\Http\Controllers\Student\StudentDashboardController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);

    Route::middleware('role:admin')->group(function () {
        Route::get('/users', [UserController::class, 'index']);
        Route::get('/admin/schools', [SchoolController::class, 'index']);
        Route::delete('/admin/schools/{id}', [SchoolController::class, 'destroy']);
        Route::get('/admin/analytics/schools', [AnalyticsController::class, 'schools']);
    });

    Route::middleware('role:professor')->prefix('professor')->group(function () {
        Route::get('/students', [ProfessorStudentController::class, 'index']);
        Route::post('/students', [ProfessorStudentController::class, 'store']);
        Route::get('/students/{id}', [ProfessorStudentController::class, 'show']);
        Route::put('/students/{id}', [ProfessorStudentController::class, 'update']);
        Route::delete('/students/{id}', [ProfessorStudentController::class, 'destroy']);

        Route::post('/students/{studentId}/lectures', [LectureController::class, 'store']);
        Route::put('/students/{studentId}/lectures/{lectureId}', [LectureController::class, 'update']);

        Route::post('/students/{studentId}/driving-sessions', [DrivingSessionController::class, 'store']);
        Route::put('/students/{studentId}/driving-sessions/{sessionId}', [DrivingSessionController::class, 'update']);

        Route::put('/students/{studentId}/exams/written', [ExamController::class, 'updateWritten']);
        Route::put('/students/{studentId}/exams/practical', [ExamController::class, 'updatePractical']);
    });

    Route::middleware('role:student')->prefix('student')->group(function () {
        Route::get('/dashboard', [StudentDashboardController::class, 'me']);
    });
});
