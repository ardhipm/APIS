<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Term;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Validator;

class TermController extends Controller
{
    public function index()
    {
        $data = DB::table('terms')->get()->toArray();

        $response = [
            'success' => true,
            'data' => $data,
            'message' => 'Term retrieved successfully.',
        ];

        return response()->json($response, 200);
    }

    public function store(Request $request)
    {
        $body = $request->getContent();
        $bodyJson = json_decode($body, true);

        $rules = [
            'term_description' => 'required',
        ];

        $validator = Validator::make($bodyJson, $rules);
        if ($validator->fails()) {
            return response(['success' => false, 'message' => $validator->errors()], 201);
        } else {
            $Term = Term::create($bodyJson);

            $response = [
                'success' => true,
                'message' => 'Term stored successfully.',
            ];
            return response()->json($response, 404);
        }
    }

    public function update(Request $request, $id)
    {
        $body = $request->getContent();
        $bodyJson = json_decode($body, true);

        $rules = [
            'term_description' => 'required',
        ];

        $validator = Validator::make($bodyJson, $rules);
        if ($validator->fails()) {
            return response(['success' => false, 'message' => $validator->errors()], 201);
        } else {

            $dataTerm = Term::find($id);

            if (count($dataTerm) == 0) {
                $response = [
                    'success' => false,
                    'message' => 'Term not found.',
                ];
                return response()->json($response, 404);
            } else {
                $dataTerm->term_description = $bodyJson['term_description'];
                $dataTerm->save();

                $response = [
                    'success' => true,
                    'message' => 'Term updated successfully.',
                ];
            }

            return response()->json($response, 200);
        }
    }

    public function destroy($id)
    {
        $Term = Term::find($id);

        if (count($Term) == 0) {
            $response = [
                'success' => false,
                'message' => 'Term not found.',
            ];
            return response()->json($response, 404);
        } else {
            $Term->delete();

            $response = [
                'success' => true,
                'message' => 'Term deleted successfully.',
            ];

        }

        return response()->json($response, 200);
    }
}
