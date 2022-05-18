<?php

namespace App\Http\Controllers\API;

use App\Customer;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\SelectedPrintPhoto;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash;

class SelectedPrintPhotoController extends Controller
{
    //

    public function insertSelectedPrint(Request $request)
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
        
        $selectedPhoto = SelectedPrintPhoto::create([
            'id_customer' => $customer[0]->id,
            'id_subpackage' => $subpackageId,
            'basename' => $basename
        ]);

        return response(['success' => true, 'data' => $selectedPhoto->basename, 'message' => 'Selected Photo inserted'], 201);

    }

    public function deleteSelectedPrint($basename){

        $dbResponse = DB::table('selected_print_photo as select')
            ->join('sub_packages as sp', 'sp.id', 'select.id_subpackage')
            ->join('packages as p', 'p.id', 'sp.id_package')
            ->join('customers as c', 'c.id', 'p.id_customer')
            ->select('c.name','c.basename_gdrive','p.package_name','sp.sub_package_name','select.basename', 'select.print_basename', 'c.restrict_album_print')
            ->where('select.basename', '=', $basename)->get()->first();

        if($dbResponse->restrict_album_print == 1){
            return response(['message' => 'Delete restricted'], 401);
        }

        $deletedPhoto = DB::table('selected_print_photo')->where('basename', $basename)->get()->first();
        if($deletedPhoto->print_basename != null){
            return response(['message' => 'Tidak dapat menghapus foto yang telah di pilih'], 401);
        }else{
            DB::table('selected_print_photo')->where('basename', $basename)->delete();
        }



        return response(['success' => true, 'data' => $basename, 'message' => 'Photo Deleted'], 201);
    }

    public function countSelectedPrintPhoto(){
        $customer = Customer::where('id_user', '=', Auth::id())->get()->first();
        $tbl = DB::table('selected_print_photo as spp')
            ->select('spp.basename')
            ->where('spp.id_customer', '=', $customer->id)
            ->whereIn('sap.sub_package_id', 
            DB::table('sub_packages as sp')
            ->select('sp.id')
            ->join('packages as p', 'p.id', 'sp.id_packags')
            ->join('customers as c', 'c.id', 'p.id_customer')
            ->where('c.id','=', $customer->id)->get()->toArray())->count();
        return response(['success' => true,'data'=>$tbl, 'message' => 'Synchronize Successfully']);
    }
}
