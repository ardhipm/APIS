<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Controller;
use App\Customer;
use App\Package;
use App\SubPackage;
use App\User;
use Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash;



class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {

        //fix bug package name not change in user
    $customer = DB::table('customers')
        ->leftJoin('users', 'customers.id_user', 'users.id')
        ->leftJoin('packages', 'customers.id', 'packages.id_customer')
        ->select('customers.id', 
            'users.email', 
            'customers.name', 
            'customers.phone_no', 
            'customers.partner_name', 
            'customers.restrict_delete',
            'customers.restrict_album_print',
            'users.is_active', 
            'packages.id as packages_id', 
            'packages.package_name',
            'packages.num_album_photo',
            'packages.num_print_photo',
            'packages.num_selected_album_photo',
            'packages.num_selected_print_photo',
            )
        ->where('users.id', '=', Auth::id())
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
     * show all customer function
     */
    public function showAllCustomer(){
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
    public function show($id)
    {
        $customer = DB::table('customers')
        ->leftJoin('users', 'customers.id_user', 'users.id')
        ->leftJoin('packages', 'customers.id', 'packages.id_customer')
        ->select('customers.id as id_customer',
            'users.id as id_user', 
            'users.email',
            'users.username',
            'users.plain_password', 
            'customers.name', 
            'customers.phone_no', 
            'customers.partner_name', 
            'customers.restrict_album_print',
            'customers.restrict_delete',
            'users.is_active', 
            'packages.id as packages_id', 
            'packages.package_name', 
            'packages.package_description',
            'packages.num_selected_album_photo',
            'packages.num_selected_print_photo',
            'packages.num_album_photo',
            'packages.num_print_photo')
        ->where('customers.id', '=', $id)
        ->get();


        $data = $customer[0];
        $sub = DB::table('sub_packages')
            ->where('id_package', '=', $data->packages_id)
            ->get()->toArray();
        $data->sub_package = $sub;

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

        $user = User::find(Auth::Id());

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
        ];

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

    public function deleteMultiple(Request $request)
    {
        $body = $request->getContent();
        $bodyJson = json_decode($body, true);

        $listDelete = $bodyJson['list_delete'];
        for ($x = 0; $x <= count($listDelete) - 1; $x++) {
            DB::delete('DELETE from customers where id = ' .$listDelete[$x]);
        }

        return response(['success' => true, 'message' => 'Deleted Successfully'], 201);

    }

    public function updateCustomer(Request $request)
    {

        $user = User::find(Auth::Id());

        if ($user['role_id'] == 2 OR $user['role_id'] == 3) {

            $body = $request->getContent();
            $bodyJson = json_decode($body,true);

            $rules = [
                'id_user' => 'required',
                'username' => 'required|max:55',
                'email' => 'email|required',
                'id_customer' => 'required',
                'name' => 'required',
                'phone_no' => 'required|numeric',
                'partner_name' => 'required',
                'id_package' => 'required',
                'package_name' => 'required',
                'is_active' => 'required',
                'package_description' => 'required',
                'sub_package.*.id_sub_package' => '',
                'sub_package.*.sub_package_name' => 'required',
                'sub_package.*.sub_package_description' => 'required',
                'sub_package.*.num_edit_photo' => 'required'
            ];

            $validator = Validator::make($bodyJson, $rules);
            if ($validator->fails()) { 
                return response(['success' => false, 'message' => $validator->errors()], 201);
            } else {

                $dir = '/';
                $recursive = false; // Get subdirectories also?
                $contents = collect(\Storage::cloud()->listContents($dir, $recursive));

                $dir = $contents->where('type', '=', 'dir')
                ->where('filename', '=', $bodyJson['id_customer'] . ' - ' . $bodyJson['name'])
                ->first(); // There could be duplicate directory names!

                $contents = collect(\Storage::cloud()->listContents($dir['path'], $recursive));

                $dir = $contents->where('type', '=', 'dir')
                    ->where('filename', '=', "Foto Pilihan")
                    ->first(); // There could be duplicate directory names!

                $dir2 = $contents->where('type', '=', 'dir')
                ->where('filename', '=', "Foto Mentah")
                ->first(); // There could be duplicate directory names!

                $dir3 = $contents->where('type', '=', 'dir')
                ->where('filename', '=', "Foto Cetak")
                ->first(); // There could be duplicate directory names!

                $dir4 = $contents->where('type', '=', 'dir')
                ->where('filename', '=', "Foto Album")
                ->first(); // There could be duplicate directory names!

                $userCustomer = User::find($bodyJson['id_user']);
                $userCustomer->username = $bodyJson['username'];
                $userCustomer->email = $bodyJson['email'];
                $userCustomer->is_active = $bodyJson['is_active'];

                if($bodyJson['password'] != NULL){
                    $userCustomer->plain_password = $bodyJson['password'];
                    $userCustomer->password = Hash::make($bodyJson['password']);
                }

                $userCustomer->save();


                $customer = Customer::find($bodyJson['id_customer']);
                $customer->name = $bodyJson['name'];
                $customer->phone_no = $bodyJson['phone_no'];
                $customer->partner_name = $bodyJson['partner_name'];
                $customer->restrict_delete = $bodyJson['restrict_delete'];
                $customer->save();

                $package = Package::find($bodyJson['id_package']);
                $package->package_name = $bodyJson['package_name'];
                $package->package_description = $bodyJson['package_description'];
                $package->num_album_photo = $bodyJson['num_album_photo'];
                $package->num_print_photo = $bodyJson['num_print_photo'];
                $package->save();

                $subPackageList = $bodyJson['sub_package'];

                $dataSubPackage= DB::table('sub_packages')
                    ->where('id_package', '=', $package->id)
                    ->get()->toArray();


                
                foreach($subPackageList as $item){
                    // die($item['id_sub_package']);

                    $contentsSubDir = collect(\Storage::cloud()->listContents($dir['path'], $recursive));
                    $contentsSubDir2 = collect(\Storage::cloud()->listContents($dir2['path'], $recursive));
                    $contentsSubDir3 = collect(\Storage::cloud()->listContents($dir3['path'], $recursive));
                    $contentsSubDir4 = collect(\Storage::cloud()->listContents($dir4['path'], $recursive));


                    if($item['id_sub_package'] != null){
                        // update
                        $subPackage = SubPackage::find($item['id_sub_package']);

                        // die(var_dump($item['sub_package_name'] != $subPackage->sub_package_name));
                        if($item['sub_package_name'] != $subPackage->sub_package_name){
                            
                            
                            $subDir = $contentsSubDir->where('type', '=', 'dir')
                            ->where('filename', '=', $subPackage->sub_package_name)
                            ->first(); // There could be duplicate directory names!
                            // die(print_r($subDir));
                            
                            $subDir2 = $contentsSubDir2->where('type', '=', 'dir')
                            ->where('filename', '=', $subPackage->sub_package_name)
                            ->first(); // There could be duplicate directory names!
        
                            // die(print_r($subDir2));
                            $subDir3 = $contentsSubDir3->where('type', '=', 'dir')
                            ->where('filename', '=', $subPackage->sub_package_name)
                            ->first(); // There could be duplicate directory names!

                            $subDir4 = $contentsSubDir4->where('type', '=', 'dir')
                            ->where('filename', '=', $subPackage->sub_package_name)
                            ->first(); // There could be duplicate directory names!

        
    
                            \Storage::cloud()->move($subDir['path'], $subDir['dirname'].'/'.$item['sub_package_name']);
                            \Storage::cloud()->move($subDir2['path'], $subDir2['dirname'].'/'.$item['sub_package_name']);
                            \Storage::cloud()->move($subDir3['path'], $subDir3['dirname'].'/'.$item['sub_package_name']);
                            \Storage::cloud()->move($subDir4['path'], $subDir4['dirname'] . '/' .$item['sub_package_name']);

        
                            $subPackage->sub_package_name = $item['sub_package_name'];
                            $subPackage->sub_package_description = $item['sub_package_description'];
                            $subPackage->num_edit_photo = $item['num_edit_photo'];
                            $subPackage->save();
                        }else{
                            $subPackage->sub_package_name = $item['sub_package_name'];
                            $subPackage->sub_package_description = $item['sub_package_description'];
                            $subPackage->num_edit_photo = $item['num_edit_photo'];
                            $subPackage->save();
                        }
                    }else{
                        // create
                        // $item['id_package'] = $package->id;

                        $newSub = new Subpackage;
                        $newSub->sub_package_name = $item['sub_package_name'];
                        $newSub->sub_package_description = $item['sub_package_description'];
                        $newSub->num_edit_photo = $item['num_edit_photo'];
                        $newSub->id_package = $package->id;
                        $newSub->save();
                        
                        // die(print_r($newSub));
                        \Storage::cloud()->makeDirectory($dir['path'] . '/' .$item['sub_package_name']);
                        \Storage::cloud()->makeDirectory($dir2['path'] . '/' . $item['sub_package_name']);
                        \Storage::cloud()->makeDirectory($dir3['path'] . '/' . $item['sub_package_name']);
                        \Storage::cloud()->makeDirectory($dir4['path'] . '/' . $item['sub_package_name']);

                    }
                    
                    

                }


                return response(['success' => true, 'message' => 'Updated successfully'], 201);
            } 
        } else {
            return response(['success' => false, 'message' => 'No access to do action'], 201);
        }
    }

    public function deleteMultipleSubpackage(Request $request){
        $body = $request->getContent();
        $bodyJson = json_decode($body, true);

        $dir = '/';
        $recursive = false; // Get subdirectories also?
        $contents = collect(\Storage::cloud()->listContents($dir, $recursive));

        $customer = Customer::find($bodyJson['id_customer']);

        $dir = $contents->where('type', '=', 'dir')
        ->where('filename', '=', $bodyJson['id_customer'] . ' - ' . $customer['name'])
        ->first(); // There could be duplicate directory names!

        $contents = collect(\Storage::cloud()->listContents($dir['path'], $recursive));

        $dir = $contents->where('type', '=', 'dir')
            ->where('filename', '=', "Foto Pilihan")
            ->first(); // There could be duplicate directory names!

        $dir2 = $contents->where('type', '=', 'dir')
        ->where('filename', '=', "Foto Akhir")
        ->first(); // There could be duplicate directory names!

        $dir3 = $contents->where('type', '=', 'dir')
        ->where('filename', '=', "Foto Mentah")
        ->first(); // There could be duplicate directory names!

        $contentsSubDir = collect(\Storage::cloud()->listContents($dir['path'], $recursive));
        $contentsSubDir2 = collect(\Storage::cloud()->listContents($dir2['path'], $recursive));
        $contentsSubDir3 = collect(\Storage::cloud()->listContents($dir3['path'], $recursive));

        $listDelete = $bodyJson['list_delete_sub_package'];


        for ($x = 0; $x <= count($listDelete) - 1; $x++) {
            $subDir = $contentsSubDir->where('type', '=', 'dir')
            ->where('filename', '=', $listDelete[$x]['sub_package_name'])
            ->first(); // There could be duplicate directory names!
            // die(print_r($subDir));
            
            $subDir2 = $contentsSubDir2->where('type', '=', 'dir')
            ->where('filename', '=', $listDelete[$x]['sub_package_name'])
            ->first(); // There could be duplicate directory names!

            // die(print_r($subDir2));
            $subDir3 = $contentsSubDir3->where('type', '=', 'dir')
            ->where('filename', '=', $listDelete[$x]['sub_package_name'])
            ->first(); // There could be duplicate directory names!


            DB::delete('DELETE from sub_packages where id = ' .$listDelete[$x]['id_sub_package']);

            Storage::cloud()->deleteDirectory($subDir['path']);
            Storage::cloud()->deleteDirectory($subDir2['path']);
            Storage::cloud()->deleteDirectory($subDir3['path']);
        }

        return response(['success' => true, 'message' => 'Deleted Successfully'], 201);

    }
}
