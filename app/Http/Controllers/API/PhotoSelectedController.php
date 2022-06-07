<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\SelectedPhoto;
use App\Notification;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PhotoSelectedController extends Controller
{
    public function insertSelected(Request $request)
    {
        // die('lasdkf');
        $basename = $request->all()['basename'];
        $subpackageId = $request->all()['subpackageId'];
        // die(var_dump($basename, $subpackageId));

        $customer = DB::table('customers')
            ->leftJoin('users', 'customers.id_user', 'users.id')
            ->select('customers.id', 'customers.id_user', 'users.email', 'customers.name', 'customers.phone_no', 'customers.partner_name')
            ->where('customers.id_user', '=', Auth::Id())
            ->get()->toArray();
        
        $selectedPhoto = SelectedPhoto::create([
            'id_customer' => $customer[0]->id,
            'id_subpackage' => $subpackageId,
            'basename' => $basename
        ]);

        return response(['success' => true, 'data' => $selectedPhoto->basename, 'message' => 'Selected Photo inserted'], 201);

    }

    public function deleteSelected($basename){

        $dbResponse = DB::table('selected_photo as select')
            ->join('sub_packages as sp', 'sp.id', 'select.id_subpackage')
            ->join('packages as p', 'p.id', 'sp.id_package')
            ->join('customers as c', 'c.id', 'p.id_customer')
            ->select('c.name', 'c.restrict_delete','c.basename_gdrive','p.package_name','sp.sub_package_name','select.basename', 'select.choice_basename')
            ->where('select.basename', '=', $basename)->get()->first();

        // $seletedPhotoToDelete = DB::table('selected_photo')->where('basename', $basename)->get()->first();
        // die($selectedPhotoToDelete);
        if($dbResponse->restrict_delete == 1){
            return response(['success' => false, 'data' => null, 'message' => 'Penghapusan gagal, Akses hapus dibatasi']);
        }

        if($dbResponse->choice_basename != NULL){
            $fileFromChoicePhoto = $this->findFileFromChoicePhoto($dbResponse->basename_gdrive, $dbResponse->sub_package_name, $dbResponse->choice_basename);
            // die(var_dump($fileFromChoicePhoto == null));
            
            if($fileFromChoicePhoto == null){
                return response(['success' => false, 'data' => null, 'message' => 'Penghapusan gagal, Foto sedang dalam pengeditan'], 500);
            }else{
                \Storage::cloud()->delete($fileFromChoicePhoto['path']);
            }
            
        }

        // die('here');
        $deletedPhoto = DB::table('selected_photo')->where('basename', $basename)->delete();

        return response(['success' => true, 'data' => $basename, 'message' => 'Photo Deleted'], 201);
    }

    public function checkDeleteSelectedPhoto(Request $request){

        $basename = $request->all()['basename'];

        $dbResponse = DB::table('selected_photo as select')
            ->join('sub_packages as sp', 'sp.id', 'select.id_subpackage')
            ->join('packages as p', 'p.id', 'sp.id_package')
            ->join('customers as c', 'c.id', 'p.id_customer')
            ->select('c.name','c.basename_gdrive','p.package_name','sp.sub_package_name','select.basename', 'select.choice_basename')
            ->where('select.basename', '=', $basename)->get()->first();

        $test = $this->findFileFromChoicePhoto($dbResponse->basename_gdrive, $dbResponse->sub_package_name, $dbResponse->choice_basename);
        die(json_encode($test));
            
        // $test = $this->findFileFromChoicePhoto($customer->basename_gdrive, 'Akad', '1parWKFRGDeVBQBmhA6aCwQaTx9FlGhms');
    }

    public function checkoutSelectedPhoto(Request $request){

        $subpackageId = $request->all()['subpackageId'];
        $customer = DB::table('customers as c')
            ->leftJoin('users as u', 'c.id_user', 'u.id')
            ->select('c.id as customerId','c.basename_gdrive', 'u.username')
            ->where('c.id_user', '=', Auth::Id())
            ->get()->first();
        $subpackage = DB::table('sub_packages as sp')
            ->select('sp.id', 'sp.sub_package_name')
            ->where('id', '=', $subpackageId)
            ->get()->first();
        $selectedPhoto = DB::table('selected_photo')
            ->where('id_subpackage', '=', $subpackageId)
            ->where('choice_basename', '=', NULL)
            ->get()->toArray();

        $contents = collect(\Storage::cloud()->listContents('/', false));
        $dir = $contents->where('type', '=', 'dir')
                ->where('basename', '=', $customer->basename_gdrive)
                ->first(); // There could be duplicate directory names!
        
        $contents = collect(\Storage::cloud()->listContents($dir['path'], false));
        $dir = $contents->where('type', '=', 'dir')
        ->where('filename', '=', 'Foto Pilihan')
        ->first(); // There could be duplicate directory names!

        $contents = collect(\Storage::cloud()->listContents($dir['path'], false));
        $dir = $contents->where('type', '=', 'dir')
        ->where('name', '=', $subpackage->sub_package_name)
        ->first(); 

        // $files = collect(\Storage::cloud()->listContents($dir['path'], false))
        // ->where('type', '=', 'file');

        // \Storage::cloud()->copy($dataFile['path'], $dirChildChoiceFolder['path'] ."/" .$dataFile['name']);
        $itemSuccess = array();
        foreach($selectedPhoto as $value){
            $fileName = \Storage::cloud()->getMetadata($value->basename)['name'];
            // echo json_encode($metadata);
            $copySuccess = \Storage::cloud()->copy($value->basename, $dir['basename'] ."/".$fileName);

            if($copySuccess){
                array_push($itemSuccess, $fileName);
                $copybasename = collect(\Storage::cloud()->listContents($dir['basename'], false ))->where('name', '=', $fileName)->first()['basename'];
                SelectedPhoto::where('basename',$value->basename)->update(['choice_basename' => $copybasename]);
            }
        }

        $notif = new Notification;
        $notif->notification_type = 'ADMIN';
        $notif->message = $customer->username.' telah memilih foto mentah';
        $notif->description = 'FOTO MENTAH';
        $notif->is_read = 0;
        $notif->id_customer = User::where('role_id', '=', 2)->get()->first()->id;
        $notif->created_by = $customer->customerId;
        $notif->save();

        return response(['success' => true, 'data' => $itemSuccess, 'message' => 'Item Selected Success'], 201);
        // die('var_dump($selectedPhoto)');
        // die(var_dump($selectedPhoto));
    }

    public function test(Request $request) {

        $test = collect(DB::table('selected_photo as select')
            ->join('sub_packages as sp', 'sp.id', 'select.id_subpackage')
            ->join('packages as p', 'p.id', 'sp.id_package')
            ->join('customers as c', 'c.id', 'p.id_customer')
            ->select('select.choice_basename')
            ->where('c.id_user', '=', Auth::id())
            ->whereNotNull('select.choice_basename')->get()->toArray());
            // ->where('choice_basename','=','1O1yhYbGJTnCr7AvxkKDxX970CSbMCJAm');
        // die(json_encode($customer));
        // $test = $this->findFileFromChoicePhoto($customer->basename_gdrive, 'Akad', '1parWKFRGDeVBQBmhA6aCwQaTx9FlGhms');
        // $test = \Storage::cloud()->has($basename);
        die(json_encode($test));
    }

    public function findAllChoicePhotoByCustomer($subpackageId){
        $dbResponse = DB::table('selected_photo as select')
            ->join('sub_packages as sp', 'sp.id', 'select.id_subpackage')
            ->join('packages as p', 'p.id', 'sp.id_package')
            ->join('customers as c', 'c.id', 'p.id_customer')
            ->select('select.choice_basename')
            ->where('c.id_user', '=', Auth::id())
            ->where('select.sub_package_id', '=', $subpackageId)
            ->where('')->paginate(10);
        return $dbResponse;

    }

    function findFileFromChoicePhoto($userbasename, $subpackagename, $filebasename){

        // die(print_r($subpackagename));


        //////////////////
        $contents = collect(\Storage::cloud()->listContents('/', false));
        $dir = $contents->where('type', '=', 'dir')
                ->where('basename', '=', $userbasename)
                ->first(); // There could be duplicate directory names!
        
        $contents = collect(\Storage::cloud()->listContents($dir['path'], false));
        $dir = $contents->where('type', '=', 'dir')
        ->where('filename', '=', 'Foto Pilihan')
        ->first(); // There could be duplicate directory names!

        $contents = collect(\Storage::cloud()->listContents($dir['path'], false));
        $dir = $contents->where('type', '=', 'dir')
        ->where('name', '=', $subpackagename)
        ->first(); 

        // $dir = co\Storage::cloud()->listContents($dir['path']."/".$filebasename);

        $contents = collect(\Storage::cloud()->listContents($dir['path'], false));
        $files = $contents->where('basename', '=', $filebasename)->first();

        return $files;
    }

    
}
