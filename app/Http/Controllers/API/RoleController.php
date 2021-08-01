<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Role;

class RoleController extends Controller
{
    public function index()
    {
        $roles = Role::all();
        $data = $roles->toArray();

        $response = [
            'success' => true,
            'data' => $data,
            'message' => 'Roles retrieved successfully.',
        ];

        return response()->json($response, 200);
    }
}
