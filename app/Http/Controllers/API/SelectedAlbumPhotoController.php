<?php

namespace App\Http\Controllers\API;

use App\Customer;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\SelectedAlbumPhoto;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash;

class SelectedAlbumPhotoController extends Controller
{
    //

    public function insertSelectedAlbum(Request $request)
    {
        // die('lasdkf');
        $basename = $request->all()['basename'];
        $subpackageId = $request->all()['subpackageId'];
        // die(var_dump($basename, $subpackageId));

        $customer = DB::table('customers')
            ->leftJoin('users', 'customers.id_user', 'users.id')
            ->select('customers.id', 'customers.id_user', 'users.email', 'customers.name', 'customers.phone_no', 'customers.partner_name', 'customers.restrict_album_print')
            ->where('customers.id_user', '=', Auth::Id())
            ->get()->toArray();

        if($customer[0]->restrict_album_print == 1){
            return response(['message' => 'Select restricted'], 401);
        }
        
        $selectedPhoto = SelectedAlbumPhoto::create([
            'id_customer' => $customer[0]->id,
            'id_subpackage' => $subpackageId,
            'basename' => $basename
        ]);

        return response(['success' => true, 'data' => $selectedPhoto->basename, 'message' => 'Selected Photo inserted'], 201);

    }

    public function deleteSelectedAlbum($basename){

        $dbResponse = DB::table('selected_album_photo as select')
            ->join('sub_packages as sp', 'sp.id', 'select.id_subpackage')
            ->join('packages as p', 'p.id', 'sp.id_package')
            ->join('customers as c', 'c.id', 'p.id_customer')
            ->select('c.name','c.basename_gdrive','p.package_name','sp.sub_package_name','select.basename', 'select.album_basename', 'c.restrict_album_print')
            ->where('select.basename', '=', $basename)->get()->first();

        if($dbResponse->restrict_album_print == 1){
            return response(['message' => 'Delete restricted'], 401);
        }


        $deletedPhoto = DB::table('selected_album_photo')->where('basename', $basename)->get()->first();
        if($deletedPhoto->album_basename != null){
            return response(['message' => 'Tidak dapat menghapus foto yang telah di pilih'], 401);
        }else{
            DB::table('selected_album_photo')->where('basename', $basename)->delete();
        }

        return response(['success' => true, 'data' => $basename, 'message' => 'Photo Deleted'], 201);
    }

    public function countSelectedAlbumPhoto($subpackageId){
        $customer = Customer::where('id_user', '=', Auth::id())->get()->first();
        // $subpackageCustomer = DB::table('sub_packages as sp')
        //     ->join('packages as p', 'p.id', 'sp.id_package')
        //     ->join('customers as c', 'c.id', 'p.id_customer')
        //     ->select('sp.id')
        //     ->where('c.id','=', $customer->id)
        //     ->where('sp.id', '=', $subpackageId)->get();

        // $idSubpackageArray = array();
        // foreach($subpackageCustomer as $value){
        //     array_push($idSubpackageArray, $value->id);
        // }


        // die(print_r($testArray));
        $tbl = DB::table('selected_album_photo as sap')
            ->select('sap.basename')
            ->where('sap.id_customer', '=', $customer->id)
            ->where('sap.id_subpackage','=',$subpackageId)->count();
        // die(print_r($tbl));
        return response(['success' => true,'data'=>$tbl, 'message' => 'Synchronize Successfully']);
    }
}
