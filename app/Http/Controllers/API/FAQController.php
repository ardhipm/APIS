<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\FAQ;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Validator;

class FAQController extends Controller
{
    public function index()
    {
        $faq = FAQ::all();
        $data = $faq->toArray();


        $response = [
            'success' => true,
            'data' => $data,
            'message' => 'FAQ retrieved successfully.',
        ];

        return response()->json($response, 200);
    }

    public function store(Request $request)
    {
        $body = $request->getContent();
        $bodyJson = json_decode($body, true);

        $rules = [
            'faq_description' => 'required',
        ];

        $validator = Validator::make($bodyJson, $rules);
        if ($validator->fails()) {
            return response(['success' => false, 'message' => $validator->errors()], 201);
        } else {
            $FAQ = FAQ::create($bodyJson);

            $response = [
                'success' => true,
                'message' => 'FAQ stored successfully.',
            ];
            return response()->json($response, 404);
        }
    }

    public function update(Request $request, $id)
    {
        $body = $request->getContent();
        $bodyJson = json_decode($body, true);

        $rules = [
            'faq_description' => 'required',
        ];

        $validator = Validator::make($bodyJson, $rules);
        if ($validator->fails()) {
            return response(['success' => false, 'message' => $validator->errors()], 201);
        } else {

            $dataFAQ = FAQ::find($id);

            if ($dataFAQ == null) {
                $response = [
                    'success' => false,
                    'message' => 'FAQ not found.',
                ];
                return response()->json($response, 404);
            } else {
                $dataFAQ->faq_description = $bodyJson['faq_description'];
                $dataFAQ->save();

                $response = [
                    'success' => true,
                    'message' => 'FAQ updated successfully.',
                ];
            }

            return response()->json($response, 200);
        }
    }

    public function destroy($id)
    {
        $FAQ = FAQ::find($id);

        if (count($FAQ) == 0) {
            $response = [
                'success' => false,
                'message' => 'FAQ not found.',
            ];
            return response()->json($response, 404);
        } else {
            $FAQ->delete();

            $response = [
                'success' => true,
                'message' => 'FAQ deleted successfully.',
            ];

        }

        return response()->json($response, 200);
    }
}
