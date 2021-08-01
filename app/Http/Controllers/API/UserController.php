<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\User;
use App\Customer;
use App\Package;
use App\SubPackage;
use Illuminate\Support\Facades\DB;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;


class UserController extends Controller
{
    public function registerUserCustomer(Request $request)
    {
        $body = $request->getContent();
        $bodyJson = json_decode($body,true);

        $rules = [
            'username' => 'required|max:55|unique:users',
            'role_id' => 'required',
            'email' => 'email|required|unique:users',
            'password' => 'required|confirmed',
            'name' => 'required',
            'phone_no' => 'required|numeric',
            'partner_name' => 'required',
            'package_name' => 'required',
            'package_description' => 'required',
            'sub_package.*.sub_package_name' => 'required',
            'sub_package.*.sub_package_description' => 'required',
            'sub_package.*.num_edit_photo' => 'required',
            'sub_package.*.num_print_photo' => 'required',
        ];

        $validator = Validator::make($bodyJson, $rules);
        if ($validator->fails()) { 
            return response(['success' => false, 'message' => $validator->errors()], 201);
        } else {
            $bodyJson['plain_password'] = $bodyJson['password'];
            $bodyJson['password'] = Hash::make($bodyJson['password']);
            $bodyJson['is_active'] = TRUE;

            $user = User::create($bodyJson);    
            $bodyJson['id_user'] = $user->id;

            $customer = Customer::create($bodyJson);
            $bodyJson['id_customer'] = $customer->id;
            $package = Package::create($bodyJson);

            $subPackageList = $bodyJson['sub_package'];
            for($x = 0; $x <= count($subPackageList)-1; $x++){
                $subPackageList[$x]['id_package'] = $package->id;

                SubPackage::create($subPackageList[$x]);
            }

            return response(['success' => true, 'message' => 'Account register successfully'], 201);

        }
    }

    public function updateUserCustomer(Request $request, $id)
    {
        $body = $request->getContent();
        $bodyJson = json_decode($body,true);

        $rules = [
            'name' => 'required',
            'phone_no' => 'required|numeric',
            'partner_name' => 'required',
            'package_name' => 'required',
            'package_description' => 'required',
            'sub_package.*.sub_package_name' => 'required',
            'sub_package.*.sub_package_description' => 'required',
            'sub_package.*.num_edit_photo' => 'required',
            'sub_package.*.num_print_photo' => 'required',
        ];

        $validator = Validator::make($bodyJson, $rules);
        if ($validator->fails()) { 
            return response(['success' => false, 'message' => $validator->errors()], 201);
        } else {
                $dataCustomer= DB::table('customers')
                ->where('id', '=', $id)
                ->get()->toArray();
            
            if (count($dataCustomer) == 0) {
                $response = [
                    'success' => false,
                    'message' => 'Customer not found.',
                ];
                return response()->json($response, 404);
            } else {
                // $user = User::find($user[0]->id);
                // $user->email = $bodyJson['email'];
                // $user->save();

                $customer = Customer::find($dataCustomer[0]->id);
                $customer->name = $bodyJson['name'];
                $customer->phone_no = $bodyJson['phone_no'];
                $customer->partner_name = $bodyJson['partner_name'];
                $customer->save();

                $dataPackage= DB::table('packages')
                ->where('id_customer', '=', $customer->id)
                ->get()->toArray();

                $package = Package::find($dataPackage[0]->id);
                $package->package_name = $bodyJson['package_name'];
                $package->package_description = $bodyJson['package_description'];
                $package->save();

                DB::table('sub_packages')->where('id_package',$package->id)->delete();

                $subPackageList = $bodyJson['sub_package'];
                for ($x = 0; $x <= count($subPackageList) - 1; $x++) {
                    $subPackageList[$x]['id_package'] = $package->id;
                    SubPackage::create($subPackageList[$x]);
                }

                $response = [
                    'success' => true,
                    'message' => 'Customer updated successfully.',
                ];

                return $response;

            }

        }
    }

    public function updateIsActive(Request $request, $id)
    {
        $body = $request->getContent();
        $bodyJson = json_decode($body,true);

        $rules = [
            'is_active' => 'required'
        ];

        $validator = Validator::make($bodyJson, $rules);
        if ($validator->fails()) { 
            return response(['success' => false, 'message' => $validator->errors()], 201);
        } else {
            $dataUser = DB::table('users')
                ->where('id', '=', $id)
                ->get()->toArray();
            
            if (count($dataUser) == 0) {
                $response = [
                    'success' => false,
                    'message' => 'User not found.',
                ];
                return response()->json($response, 404);
            } else {
                $user = User::find($dataUser[0]->id);

                $user->is_active = $bodyJson['is_active'];
                $user->save();
                $response = [
                    'success' => true,
                    'message' => 'User updated successfully.',
                ];

                return $response;

            }

        }
    }

    public function register(Request $request){
        $body = $request->getContent();
        $bodyJson = json_decode($body,true);

        $rules = [
            'username' => 'required|unique:users',
            'password' => 'required',
            'email' => 'required|email|unique:users',
            'role_id' => 'required'
        ];

        $validator = Validator::make($bodyJson, $rules);
        if ($validator->fails()) { 
            return response(['success' => false, 'message' => $validator->errors()], 201);
        } else {
            $bodyJson['plain_password'] = $bodyJson['password'];
            $bodyJson['password'] = Hash::make($bodyJson['password']);
            $bodyJson['is_active'] = TRUE;

            $user = User::create($bodyJson);


            $response = [
                'success' => true,
                'message' => 'User created successfully.'
            ];
            return response()->json($response, 404);
        }

       
    }

    public function login(Request $request)
    {
        
        $body = $request->getContent();
        $bodyJson = json_decode($body,true);

        $rules = [
            'username' => 'required',
            'password' => 'required',
        ];

        $validator = Validator::make($bodyJson, $rules);
        if ($validator->fails()) {
            return $validator->errors();
        } else {
            if (!Auth::attempt(['username' => $bodyJson['username'], 'password' => '123123', 'is_active' => 1])) {
                return response(['success' => false, 'message' => 'This User does not exist, check your details'], 400);
            }
            $accessToken = auth()->user()->createToken('authToken')->accessToken;
            
            return response(['success' => true, 'message' => 'Login successfully', 'user' => auth()->user(), 'access_token' => $accessToken]);
        }
       
    }

    public function logout(){   
        if (Auth::check()) {
            Auth::user()->token()->revoke();
            return response()->json(['success' => true, 'message' => 'Logout successfully'],200); 
        }else{
            return response()->json(['success' => false, 'message' =>'Token not found or already logout'], 500);
        }
    }
}
