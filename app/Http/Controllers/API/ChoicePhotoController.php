<?php

namespace App\Http\Controllers\API;

use App\Customer;
use App\SelectedAlbumPhoto;
use App\SelectedPrintPhoto;
use App\Notification;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash;

class ChoicePhotoController extends Controller
{
    //

    public function choicePhotoMetadata(){
        try{
            $dbResponse = DB::table("sub_packages as sp")
                ->leftJoin('packages as p','p.id', 'sp.id_package')
                ->leftJoin('customers as c', 'c.id', 'p.id_customer')
                ->select('p.package_name', 'p.package_description', 'p.num_print_photo', 'p.num_album_photo','sp.id', 'sp.sub_package_name', 'sp.sub_package_description', 'c.restrict_album_print')
                ->where('c.id_user', '=', Auth::id())->get()->toArray();
            
            $data = new \stdClass();
            $data->package_name = $dbResponse[0]->package_name;
            $data->package_description = $dbResponse[0]->package_description;
            $data->num_print_photo = $dbResponse[0]->num_print_photo;
            $data->num_album_photo = $dbResponse[0]->num_album_photo;
            $data->subpackage = array();
            $data->restrict_album_print = $dbResponse[0]->restrict_album_print;
            foreach($dbResponse as $value){
                $subpackagetemp = new \stdClass();
                $subpackagetemp->id = $value->id;
                $subpackagetemp->name = $value->sub_package_name;
                $subpackagetemp->description = $value->sub_package_description;
                
                array_push($data->subpackage, $subpackagetemp);
            }

            return response(['success' => true, 'message'=> 'data retrieved', 'data'=>$data], 200);
        }catch(Exception $e){
            return response(['success' => false, 'message'=> $e], 500);
        }
    }

    public function findChoicePhotoBasedSubpackage($subpackageId){
        $customer = Customer::where('id_user', '=', Auth::id())->get()->first();
        $tbl = DB::table('choice_photo as cp')
        ->leftJoin('selected_album_photo as ap', 'cp.basename', 'ap.basename')
        ->leftJoin('selected_print_photo as pp', 'cp.basename', 'pp.basename')
        ->select('cp.id','cp.sub_package_id', 'cp.sub_package_name', 'cp.filename', 'cp.path', 'cp.basename', 'cp.id_customer', 'cp.is_edited','ap.album_basename', 'pp.print_basename',
            DB::raw('(CASE WHEN ap.basename is null THEN false ELSE true END) AS is_album_selected'),
            DB::raw('(CASE WHEN pp.basename is null THEN false ELSE true END) AS is_print_selected'),
        )
        ->where('cp.id_customer', '=', $customer->id)
        ->where('cp.sub_package_id', '=', $subpackageId)->paginate(50);
        return $tbl;
    }

    public function checkoutAlbumPrintPhoto(){
        $customer = Customer::where('id_user', '=', Auth::id())->get()->first();
        $user = User::where('id','=',Auth::id());

        $contents = collect(\Storage::cloud()->listContents('/', false));
        $dir = $contents->where('type', '=', 'dir')
                ->where('basename', '=', $customer->basename_gdrive)
                ->first(); // There could be duplicate directory names!
        
        $contents = collect(\Storage::cloud()->listContents($dir['path'], false));
        $albumDir = $contents->where('type', '=', 'dir')
        ->where('filename', '=', 'Foto Album')
        ->first(); // There could be duplicate directory names!

        $printDir = $contents->where('type', '=', 'dir')
        ->where('filename', '=', 'Foto Cetak')
        ->first(); // There could be duplicate directory names!


        $t1 = DB::table('selected_album_photo as sap')
            ->select('sap.id_customer','sap.id_subpackage', 'sap.basename', 'sp.sub_package_name', 'cp.filename','album_basename as selected_album_print_basename',
                DB::raw('case when sap.basename in 
                (select sap.basename from selected_print_photo spp join selected_album_photo sap on spp.basename = sap.basename )
                then "album_print"
                else "album" end as copy_type'))
            ->leftJoin('sub_packages as sp', 'sap.id_subpackage', 'sp.id')
            ->join('choice_photo as cp', 'cp.basename', 'sap.basename')
            ->where('sap.id_customer', '=', $customer->id);

        $t2 = DB::table('selected_print_photo as spp')
            ->select('spp.id_customer','spp.id_subpackage', 'spp.basename', 'sp.sub_package_name', 'cp.filename','print_basename as selected_album_print_basename',
                DB::raw('case when spp.basename in 
                (select spp.basename from selected_print_photo spp join selected_album_photo sap on spp.basename = sap.basename )
                then "album_print"
                else "print" end as copy_type'))
            ->leftJoin('sub_packages as sp', 'spp.id_subpackage', 'sp.id')
            ->join('choice_photo as cp', 'cp.basename', 'spp.basename')
            ->where('spp.id_customer', '=', $customer->id)
            ->union($t1)
            ->get();

        // die()
        
        // $asd = DB::table($tb2." as test")->get();

        foreach($t2 as $data){
            

            // if($data->selected_album_print_basename == n){
            //     continue;
            // }
            
            if($data->copy_type == "album_print"){
                $copySuccess1 = $this->copyDataToPath($data, $printDir, 'print');
                $copySuccess2 = $this->copyDataToPath($data, $albumDir, 'album');
            
            // echo json_encode($metadata);
            // $copySuccess = \Storage::cloud()->copy($data->basename, $printDir."/".$fileName);
                
            }
            if($data->copy_type == "album"){
                $copySuccess = $this->copyDataToPath($data, $albumDir, 'album');
            }
            if($data->copy_type == "print"){
                $copySuccess = $this->copyDataToPath($data, $printDir, 'print');
                
            }
        }

        // DB::table('customers')
        //       ->where('id', $customer->id)
        //       ->update(['restrict_album_print' => 1]);
        
        $notif = new Notification;
        $notif->notification_type = 'ADMIN';
        $notif->message = $user->username.' telah memilih foto album dan foto cetak';
        $notif->description = 'FOTO ALBUM CETAK';
        $notif->is_read = 0;
        $notif->id_customer = User::where('role_id', '=', 2)->get()->first()->id;
        $notif->created_by = $customerId;
        $notif->save();

        return response(['success'=> true, 'data'=>$t2, 'message'=>'Checkout success']);
    }

    function copyDataToPath($data, $dirPath, $type){
        // die(json_encode($data->sub_package_name));
        $contents = collect(\Storage::cloud()->listContents($dirPath['path'], false));
        // die(json_encode($contents));
        $dir = $contents->where('type', '=', 'dir')
            ->where('name', '=', $data->sub_package_name)
            ->first(); // There could be duplicate directory names!
        $fileName = $data->filename;
        // die(json_encode($dir));
        $contents = collect(\Storage::cloud()->listContents($dir['path'], false));
        $file = $contents->where('filename','=',$fileName)->first();
            
        if($file == null){
            $copySuccess = \Storage::cloud()->copy($data->basename, $dir['basename'] ."/".$fileName);
            if($copySuccess){
                $copybasename = collect(\Storage::cloud()->listContents($dir['basename'], false ))->where('name', '=', $fileName)->first()['basename'];
                if($type == 'print'){
                    SelectedPrintPhoto::where('basename',$data->basename)->update(['print_basename' => $copybasename]);
                }
    
                if($type == 'album'){
                    SelectedAlbumPhoto::where('basename',$data->basename)->update(['album_basename' => $copybasename]);
                }
            }
        }
    }
}
