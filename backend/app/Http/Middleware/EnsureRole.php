<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureRole
{
    public function handle(Request $request, Closure $next, string ...$roles)
    {
        $user = $request->user();
        if (! $user) {
            abort(401, 'Unauthenticated');
        }

        $userRole = strtolower((string) $user->role);
        $allowed = array_map('strtolower', $roles);
        if (! in_array($userRole, $allowed, true)) {
            abort(403, 'Forbidden');
        }

        return $next($request);
    }
}
