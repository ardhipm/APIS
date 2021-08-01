<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Customer;
use App\SubPackage;
use Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;



class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {

    $customer = DB::table('customers')
        ->leftJoin('users', 'customers.id_user', 'users.id')
        ->leftJoin('packages', 'customers.id', 'packages.id_customer')
        ->select('customers.id', 'users.email', 'customers.name', 'customers.phone_no', 'customers.partner_name', 'users.is_active', 'packages.id as packages_id', 'packages.package_name')
        ->where('users.role_id', '=', '1')
        ->get();

        $data = $customer->toArray();
        

        $response = [
            'success' => true,
            'data' => $data,
            'message' => 'Customers retrieved successfully.',
        ];

        return response()->json($response, 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $input = $request->all();

        $validator = Validator::make($input, [
            'name' => 'required',
            'phone_no' => 'required',
            'partner_name' => 'required',
            'id_user' => 'unique:customers,id_user'
        ]);
        
        if ($validator->fails()) {
            $response = [
                'success' => false,
                'data' => 'Validation Error.',
                'message' => $validator->errors(),
            ];
            return response()->json($response, 404);
        } else {
            $id_user = DB::table('customers')
            ->where('id_user', '=', Auth::id())
            ->get()->toArray();

            if (sizeof($id_user) < 1) {
                // $input['id_user'] = Auth::id();

                $customer = Customers::create($input);

                $data = $customer->toArray();

                ////SAVE FOLDER GDRIVE

                \Storage::disk('google')->makeDirectory($input['name'] . " - " . $input['partner_name']);

                $dir = '/';
                $recursive = false; // Get subdirectories also?
                $contents = collect(\Storage::cloud()->listContents($dir, $recursive));

                $dir = $contents->where('type', '=', 'dir')
                    ->where('filename', '=', $input['name'] . " - " . $input['partner_name'])
                    ->first(); // There could be duplicate directory names!

                if (!$dir) {$response = [
                    'success' => false,
                    'data' => 'Directory does not exist',
                    'message' => $validator->errors(),
                ];
                    return response()->json($response, 404);
                    return 'Directory does not exist!';
                }

                // Create sub dir
                \Storage::cloud()->makeDirectory($dir['path'] . '/Lamaran');
                \Storage::cloud()->makeDirectory($dir['path'] . '/Prewedding');
                \Storage::cloud()->makeDirectory($dir['path'] . '/Akad');
                \Storage::cloud()->makeDirectory($dir['path'] . '/Resepsi');

                ////

                $response = [
                    'success' => true,
                    'data' => $data,
                    'message' => 'Customer stored successfully.',
                ];

                return response()->json($response, 200);
            } else {
                $response = [
                    'success' => false,
                    'data' => 'Customer has already created.',
                ];
                return response()->json($response, 404);

            }
        }
    
    }

    /**
     * Display the specified resource.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function show()
    {
        $customer = DB::table('customers')
                ->leftJoin('users', 'customers.id_user', 'users.id')
                ->select('customers.id_user','users.email','customers.name','customers.phone_no','customers.partner_name')
                ->where('customers.id_user', '=', Auth::Id())
                ->get();
        $data = $customer->toArray();

        if (sizeof($data) < 1) {
            $response = [
                'success' => false,
                'data' => 'Empty',
                'message' => 'Customer not found.',
            ];
            return response()->json($response, 404);
        }

        $response = [
            'success' => true,
            'data' => $data,
            'message' => 'Customer retrieved successfully.',
        ];

        return response()->json($response, 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $input = $request->all();

        $validator = Validator::make($input, [
            'name' => 'required',
            'phone_no' => 'required',
            'partner_name' => 'required',
        ]);

        if ($validator->fails()) {
            $response = [
                'success' => false,
                'data' => 'Validation Error.',
                'message' => $validator->errors(),
            ];
            return response()->json($response, 404);
        }

        $customer= DB::table('customers')
            ->where('id_user', '=', $id)
            ->get()->toArray();

        if (count($customer) == 0) {
            $response = [
                'success' => false,
                'message' => 'Customer not found.',
            ];
            return response()->json($response, 404);
        } else {
            $data = Customers::find($customer[0]->id);

            $data->name = $input['name'];
            $data->phone_no = $input['phone_no'];
            $data->partner_name = $input['partner_name'];

            $data->save();

            $response = [
                'success' => true,
                'data' => $data,
                'message' => 'Customer updated successfully.',
            ];
        }

        return response()->json($response, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $customer = DB::table('customers')
            ->where('id_user', '=', $id)
            ->get()->toArray();

        if (count($customer) == 0) {
            $response = [
                'success' => false,
                'message' => 'Customer not found.',
            ];
            return response()->json($response, 404);
        } else {
            $data = Customers::find($customer[0]->id);

            $data->delete();

            $response = [
                'success' => true,
                'message' => 'Customer deleted successfully.',
            ];

        }



        return response()->json($response, 200);
    }
}
