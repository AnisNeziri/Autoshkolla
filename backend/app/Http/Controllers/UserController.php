<?php

namespace App\Http\Controllers;

use App\Models\User;

class UserController extends Controller
{
    public function index()
    {
        return User::query()
            ->select(['id', 'name', 'email', 'role', 'autoschool_id', 'must_change_password', 'created_at'])
            ->orderBy('id')
            ->get();
    }
}

