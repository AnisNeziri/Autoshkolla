<?php

namespace App\Http\Controllers;

use App\Models\Autoschool;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $data = $request->validate([
            'school_name' => ['required', 'string', 'max:100'],
            'owners_name' => ['required', 'string', 'max:50'],
            'owners_surname' => ['required', 'string', 'max:50'],
            'numri_biz' => ['nullable', 'string', 'max:20', Rule::unique('autoschool', 'numri_biz')],
            'invitation_code' => ['nullable', 'string', 'max:20', Rule::unique('autoschool', 'invitation_code')],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'owner_display_name' => ['nullable', 'string', 'max:191'],
        ]);

        $numriBiz = ! empty($data['numri_biz']) ? $data['numri_biz'] : $this->uniqueAutoschoolValue('numri_biz');
        $invitationCode = ! empty($data['invitation_code']) ? $data['invitation_code'] : $this->uniqueAutoschoolValue('invitation_code');

        $user = DB::transaction(function () use ($data, $numriBiz, $invitationCode) {
            $displayName = $data['owner_display_name']
                ?? trim($data['owners_name'].' '.$data['owners_surname']);

            $user = User::create([
                'name' => $displayName,
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'role' => 'professor',
                'must_change_password' => false,
            ]);

            $school = Autoschool::create([
                'name' => $data['school_name'],
                'owners_name' => $data['owners_name'],
                'owners_surname' => $data['owners_surname'],
                'numri_biz' => $numriBiz,
                'invitation_code' => $invitationCode,
                'user_id' => $user->id,
                'created_at' => now(),
            ]);

            $user->update(['autoschool_id' => $school->id]);

            return $user->fresh();
        });

        $token = $user->createToken('spa')->plainTextToken;

        return response()->json([
            'token' => $token,
            'token_type' => 'Bearer',
            'user' => $this->userPayload($user),
        ], 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $credentials['email'])->first();

        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Kredencialet janë të pasakta.'],
            ]);
        }

        $token = $user->createToken('spa')->plainTextToken;

        return response()->json([
            'token' => $token,
            'token_type' => 'Bearer',
            'user' => $this->userPayload($user),
        ]);
    }

    public function me(Request $request)
    {
        return response()->json($this->userPayload($request->user()));
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()?->delete();

        return response()->json(['message' => 'U dolët me sukses.']);
    }

    public function changePassword(Request $request)
    {
        $data = $request->validate([
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        /** @var User $user */
        $user = $request->user();
        $user->password = Hash::make($data['password']);
        $user->must_change_password = false;
        $user->save();

        return response()->json([
            'message' => 'Fjalëkalimi u përditësua.',
            'user' => $this->userPayload($user->fresh()),
        ]);
    }

    private function userPayload(?User $user): array
    {
        if (! $user) {
            return [];
        }

        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => strtolower((string) $user->role),
            'must_change_password' => (bool) $user->must_change_password,
            'autoschool_id' => $user->autoschool_id,
        ];
    }

    /**
     * Generate a unique value for autoschool.numri_biz or autoschool.invitation_code (max 20 chars).
     */
    private function uniqueAutoschoolValue(string $column): string
    {
        do {
            $value = strtoupper(Str::random(12));
            if (strlen($value) > 20) {
                $value = substr($value, 0, 20);
            }
        } while (Autoschool::query()->where($column, $value)->exists());

        return $value;
    }
}
