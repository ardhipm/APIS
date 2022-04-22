<?php

namespace App\Http\Controllers\API;
use App\SelectedPhoto;
use App\Customer;
use App\SubPackage;
use App\User;
use App\Origin;
use App\Choice;
use App\Notification;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;

use ZipArchive;
use File;
use Zip;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use GuzzleHttp\Client;


class DrivePhotoController extends Controller
{
    public function index(){

    }

    public function getChoicePhotoFolder($folderName){
        $decodeName =  urldecode($folderName);

        $customer = DB::table('customers')
        ->leftJoin('users', 'customers.id_user', 'users.id')
        ->select('customers.id','customers.id_user', 'users.email', 'customers.name', 'customers.phone_no', 'customers.partner_name')
        ->where('customers.id_user', '=', Auth::Id())
        ->get()->toArray();

        
        $folder = $customer[0]->id .' - ' .$customer[0]->name;

        $contents = collect(\Storage::cloud()->listContents('/', false));
        $dir = $contents->where('type', '=', 'dir')
                ->where('filename', '=', $folder)
                ->first(); // There could be duplicate directory names!
        
        $contents = collect(\Storage::cloud()->listContents($dir['path'], false));
        $dir = $contents->where('type', '=', 'dir')
        ->where('filename', '=', 'Foto Mentah')
        ->first(); // There could be duplicate directory names!

        $contents = collect(\Storage::cloud()->listContents($dir['path'], false));

        $dir = $contents->where('type', '=', 'dir')
        ->where('filename', '=', $decodeName)
        ->first(); 

        $files = collect(\Storage::cloud()->listContents($dir['path'], false))
        ->where('type', '=', 'file');

        return response(['success' => true,'data'=>'$files', 'message' => 'Selected Photo inserted'], 201);
    }
    
    public function getChoicePhoto(){
    
        $customer = DB::table('customers')
        ->leftJoin('users', 'customers.id_user', 'users.id')
        ->select('customers.id','customers.id_user', 'users.email', 'customers.name', 'customers.phone_no', 'customers.partner_name')
        ->where('customers.id_user', '=', Auth::Id())
        ->get()->toArray();
        
        $folder = $customer[0]->id .' - ' .$customer[0]->name;

        $contents = collect(\Storage::cloud()->listContents('/', false));
        $dirs = $contents->where('type', '=', 'dir')
                ->where('filename', '=', $folder)
                ->first(); // There could be duplicate directory names!
        
        $contents = collect(\Storage::cloud()->listContents($dirs['path'], false));
        $dir = $contents->where('type', '=', 'dir')
        ->where('filename', '=', 'Foto Pilihan')
        ->first(); // There could be duplicate directory names!

        $contentPrintPhoto = collect(\Storage::cloud()->listContents($dirs['path'], false));
        $dirContentPrintPhoto = $contentPrintPhoto->where('type', '=', 'dir')
            ->where('filename', '=', 'Foto Cetak')
            ->first(); // There could be duplicate directory names!

        $contentAlbumPhoto = collect(\Storage::cloud()->listContents($dirs['path'], false));
        $dirContentAlbumPhoto = $contentAlbumPhoto->where('type', '=', 'dir')
            ->where('filename', '=', 'Foto Album')
            ->first(); // There could be duplicate directory names!

        $filedir = collect(\Storage::cloud()->listContents($dir['path'], false));
        $directory = $filedir->where('type', '=', 'dir')->toArray();
        // $file= $filedir->where('type', '=', 'file')->toArray();

        $data = array();

        for($i = 0; $i < count($directory); $i++){
            $dataFile = array();

            $filedirchild = collect(\Storage::cloud()->listContents($directory[$i]['path'], false))->where('type', '=', 'file');
            $filedirchild2 = $filedirchild->toArray();

            $parent = new \ArrayObject();
            $parent['folder'] = $directory[$i]['name'];
            $parent['folder_basename'] = $directory[$i]['basename'];
            if(count($filedirchild2) > 0){
                for($j = 0; $j < count($filedirchild2); $j++){
                    $filePrintPhoto = collect(\Storage::cloud()->listContents($dirContentPrintPhoto['path'], false));
                    $dirFilePrintPhoto = $filePrintPhoto->where('type', '=', 'dir')
                        ->where('filename', '=', $directory[$i]['name'])
                        ->first(); // There could be duplicate directory names!

                    $fileAlbumPhoto = collect(\Storage::cloud()->listContents($dirContentAlbumPhoto['path'], false));
                    $dirFileAlbumPhoto = $fileAlbumPhoto->where('type', '=', 'dir')
                        ->where('filename', '=', $directory[$i]['name'])
                        ->first(); // There could be duplicate directory names!

                    $filedirchildPrint = collect(\Storage::cloud()->listContents($dirFilePrintPhoto['path'], false))->where('type', '=', 'file');
                    $filedirchildPrint2 = $filedirchildPrint->toArray();

                    $filedirchildAlbum = collect(\Storage::cloud()->listContents($dirFileAlbumPhoto['path'], false))->where('type', '=', 'file');
                    $filedirchildAlbum2 = $filedirchildAlbum->toArray();


                    $filedirchild2[$j]['is_print'] = false;
                    for($k = 0; $k < count($filedirchildPrint2); $k++){
                        if($filedirchild2[$j]['name'] == $filedirchildPrint2[$k]['name']){
                            $filedirchild2[$j]['is_print'] = true;
                        }
                    }

                    $filedirchild2[$j]['is_album'] = false;
                    for ($k = 0; $k < count($filedirchildAlbum2); $k++) {
                        if ($filedirchild2[$j]['name'] == $filedirchildAlbum2[$k]['name']) {
                            $filedirchild2[$j]['is_album'] = true;
                        }
                    }

                }
            }
            $parent['file'] = $filedirchild2;
            array_push($data, $parent);

        }

        $response = [
            'success' => true,
            'data' => $data,
            'message' => 'Choice Photo retrieved successfully.',   
        ];

        \Cache::put('choice_photo_user_'.Auth::Id(), $response, 600);

        return $response;

    }

    public function getFinalPhoto(){
    
        $customer = DB::table('customers')
        ->leftJoin('users', 'customers.id_user', 'users.id')
        ->select('customers.id','customers.id_user', 'users.email', 'customers.name', 'customers.phone_no', 'customers.partner_name')
        ->where('customers.id_user', '=', Auth::Id())
        ->get()->toArray();

        
        $folder = $customer[0]->id .' - ' .$customer[0]->name;

        $contents = collect(\Storage::cloud()->listContents('/', false));
        $dir = $contents->where('type', '=', 'dir')
                ->where('filename', '=', $folder)
                ->first(); // There could be duplicate directory names!
        
        $contents = collect(\Storage::cloud()->listContents($dir['path'], false));
        $dir = $contents->where('type', '=', 'dir')
        ->where('filename', '=', 'Foto Akhir')
        ->first(); // There could be duplicate directory names!

        $filedir = collect(\Storage::cloud()->listContents($dir['path'], false));
        $directory = $filedir->where('type', '=', 'dir')->toArray();
        // $file= $filedir->where('type', '=', 'file')->toArray();


        $data = array();

        for($i = 0; $i < count($directory); $i++){
            $dataFile = array();

            $filedirchild = collect(\Storage::cloud()->listContents($directory[$i]['path'], false))->where('type', '=', 'file');
        
            $parent = new \ArrayObject();
            $parent['folder'] = $directory[$i]['name'];
            $parent['file'] = $filedirchild;

            array_push($data, $parent);

        }

        $response = [
            'success' => true,
            'data' => $data,
            'message' => 'Final Photo retrieved successfully.',   
        ];

        return $response;

    }

    public function getParentSubLink(Request $request){
        $tabValue = $request->tabValue;
        $customer = DB::table('customers')
        ->leftJoin('users', 'customers.id_user', 'users.id')
        ->leftJoin('packages', 'customers.id', 'packages.id_customer')
        ->select('customers.id','customers.id_user', 'users.email', 'customers.name', 'customers.phone_no', 'customers.partner_name', 'packages.id as package_id')
        ->where('customers.id_user', '=', Auth::Id())
        ->get()->toArray();
        
        $folder = $customer[0]->id .' - ' .$customer[0]->name;

        $contents = collect(\Storage::cloud()->listContents('/', false));
        $dir = $contents->where('type', '=', 'dir')
                ->where('filename', '=', $folder)
                ->first(); // There could be duplicate directory names!
        
        $contents = collect(\Storage::cloud()->listContents($dir['path'], false));
        if($tabValue == 0){
            $dir = $contents->where('type', '=', 'dir')
            ->where('filename', '=', 'Foto Mentah')
            ->first(); // There could be duplicate directory names!
        }

        if($tabValue == 1){
            $dir = $contents->where('type', '=', 'dir')
            ->where('filename', '=', 'Foto Pilihan')
            ->first(); // There could be duplicate directory names!
            }
        

        $filedir = collect(\Storage::cloud()->listContents($dir['path'], false));
        $directory = $filedir->where('type', '=', 'dir')->toArray();
        // $file= $filedir->where('type', '=', 'file')->toArray();

        // die(print_r($directory));

        $data['parent_filename'] = $dir['filename'];
        $data['parent_basename'] = $dir['basename'];

        $childArray = array();
        for($i = 0; $i < count($directory); $i++){
            $child['basename'] = $directory[$i]['basename'];
            $child['name'] = $directory[$i]['name'];
            array_push($childArray, $child);

        }

        $data['child'] = $childArray;

        $response = [
            'success' => true,
            'data' => $data,
            'message' => 'Parent folder retrieved.',   
        ];
        
        // die(print_r($response));
        return $response;
        
    }

    public function getOriginCachePhoto(){
        
        if (\Cache::has('origin_photo_user_'.Auth::Id())) {
            $response = \Cache::get('origin_photo_user_'.Auth::Id());
            return $response;
            
        } else {
            $response = $this->getOriginPhoto();
            return $response;
        }
    }

    public function getChoiceCachePhoto(){
        if (\Cache::has('choice_photo_user_'.Auth::Id())) {
            $response = \Cache::get('choice_photo_user_'.Auth::Id());
            return $response;
            
        } else {
            $response = $this->getChoicePhoto();
            return $response;
        }
    }

    public function getVideoCache(){
        if (\Cache::has('video_user_'.Auth::Id())) {
            $response = \Cache::get('video_user_'.Auth::Id());
            return $response;
            
        } else {
            $response = $this->getVideo();
            return $response;
        }
    }

    public function getAlbumCache(){
        if (\Cache::has('album_user_'.Auth::Id())) {
            $response = \Cache::get('album_user_'.Auth::Id());
            return $response;
            
        } else {
            $response = $this->getAlbum();
            return $response;
        }
    }
    
    public function getOriginPhotoWithPagination($kategori, $page){
    
        $customer = DB::table('customers')
        ->leftJoin('users', 'customers.id_user', 'users.id')
        ->select('customers.id','customers.id_user', 'users.email', 'customers.name', 'customers.phone_no', 'customers.partner_name')
        ->where('customers.id_user', '=', Auth::Id())
        ->get()->toArray();

        
        $folder = $customer[0]->id .' - ' .$customer[0]->name;

        $contents = collect(\Storage::cloud()->listContents('/', false));
        $dir = $contents->where('type', '=', 'dir')
                ->where('filename', '=', $folder)
                ->first(); // There could be duplicate directory names!
        
        $contents = collect(\Storage::cloud()->listContents($dir['path'], false));
        $dir = $contents->where('type', '=', 'dir')
        ->where('filename', '=', 'Foto Mentah')
        ->first(); // There could be duplicate directory names!

        $filedir = collect(\Storage::cloud()->listContents($dir['path'], false));
        $directory = $filedir->where('type', '=', 'dir')->where('filename', '=', $kategori)->first();
        // $file= $filedir->where('type', '=', 'file')->toArray();

        $filedirchild = collect(\Storage::cloud()->listContents($directory['path'], false))->where('type', '=', 'file')->ToArray();
        $data = array();

        $totalPage = 0;
        $currentPage = 0;

        $totalPage = ceil(count($filedirchild)/10);
        $response = new \stdClass();
        $response->folder = $directory['name'];
        

        if($page > $totalPage || $page < 1){
            $response = [
                'success' => false,
                'message' => 'Page is not found',  
            ];

            return $response;
        }else{
            if($page != $totalPage){
                for($i = ($page*10) - 10; $i < $page*10; $i++){
                    $dataFile = array();
                    $filePhoto = new \stdClass();
                    $filePhoto->name = $filedirchild[$i]['name'];
                    $filePhoto->basename = $filedirchild[$i]['basename'];
                    $filePhoto->path = $filedirchild[$i]['path'];
                    // $filePhoto->name = $filedirchild[$i]['name'];
                    // die(var_dump($filePhoto));
                    $parent = new \ArrayObject();
                    $parent['folder'] = $directory['name'];
                    // $parent['file'] = $filedirchild[$i];
                    $parent['file'] = $filePhoto;

                    array_push($response->photos, $parent);
                }
            }else{
                for($i = ($page*10) - 10; $i < count($filedirchild); $i++){
                    $dataFile = array();
                    $filePhoto = new \stdClass();
                    $filePhoto->name = $filedirchild[$i]['name'];
                    $filePhoto->basename = $filedirchild[$i]['basename'];
                    $filePhoto->path = $filedirchild[$i]['path'];
                    // die(var_dump($filePhoto));
                    $parent = new \ArrayObject();
                    // $parent['folder'] = $directory['name'];
                    // $parent['file'] = $filedirchild[$i];
                    // $parent['file'] = $filePhoto;

                    array_push($response->photos, $parent);
                }
            }

            $response = [
                'success' => true,
                'data' => $data,
                'message' => 'Origin Photo retrieved successfully.',   
                'totalPage' => $totalPage,
                'currentPage' => $page
            ];

            return $response;
        }

    }

    

    public function getOriginPhoto(){
    
        // $customer = DB::table('customers')
        // ->leftJoin('users', 'customers.id_user', 'users.id')
        // ->leftJoin('packages', 'customers.id', 'packages.id_customer')
        // ->select('customers.id','customers.id_user', 'users.email', 'customers.name', 'customers.phone_no', 'customers.partner_name', 'packages.id as package_id')
        // ->where('customers.id_user', '=', Auth::Id())
        // ->get()->toArray();

        $sub_package = DB::table('sub_packages')->where('id_package', '=', 19)->get()->toArray();
        // die(print_r($sub_package));
        
        // $sub_package = array();

        // $folder = $customer[0]->id .' - ' .$customer[0]->name;

        $contents = collect(\Storage::cloud()->listContents('/', false));
        $dir = $contents->where('type', '=', 'dir')
                ->where('filename', '=', '19 - Andin')
                ->first(); // There could be duplicate directory names!

        // $dir = $contents->where('type', '=', 'dir')
        //         ->where('basename', '=', $folder)
        //         ->first(); // There could be duplicate directory names!
        
        $contents = collect(\Storage::cloud()->listContents($dir['path'], false));
        $dir = $contents->where('type', '=', 'dir')
        ->where('filename', '=', 'Foto Mentah')
        ->first(); // There could be duplicate directory names!

        $filedir = collect(\Storage::cloud()->listContents($dir['path'], false));
        $directory = $filedir->where('type', '=', 'dir')->toArray();
        // $file= $filedir->where('type', '=', 'file')->toArray();

        $data = array();

        for($i = 0; $i < count($directory); $i++){
            $dataFile = array();
            

            $filedirchild = collect(\Storage::cloud()->listContents($directory[$i]['path'], false))->where('type', '=', 'file');
        
            $parent = new \ArrayObject();
            $parent['folder'] = $directory[$i]['name'];
            $parent['folder_basename'] = $directory[$i]['basename'];
            for($j = 0; $j < count($sub_package); $j++){
                if($sub_package[$j]->sub_package_name == $directory[$i]['name']){
                    $parent['num_edit_photo'] = $sub_package[$j]->num_edit_photo;
                    $parent['id_subpackage'] = $sub_package[$j]->id;
                    $parent['is_downloaded'] = $sub_package[$j]->is_downloaded;
                    $parent['num_selected_edit_photo'] = $sub_package[$j]->num_selected_edit_photo;
                }else{
                    continue;
                }
            }
            
            $parent['file'] = $filedirchild;

            array_push($data, $parent);

        }

        $response = [
            'success' => true,
            'data' => $data,
            'message' => 'Origin Photo retrieved successfully.',   
        ];

        \Cache::put('origin_photo_user_'.Auth::Id(), $response, 600);

        return $response;

    }

    public function getVideo(){
    
        $customer = DB::table('customers')
        ->leftJoin('users', 'customers.id_user', 'users.id')
        ->select('customers.id','customers.id_user', 'users.email', 'customers.name', 'customers.phone_no', 'customers.partner_name')
        ->where('customers.id_user', '=', Auth::Id())
        ->get()->toArray();

        
        $folder = $customer[0]->id .' - ' .$customer[0]->name;

        $contents = collect(\Storage::cloud()->listContents('/', false));
        $dir = $contents->where('type', '=', 'dir')
                ->where('filename', '=', $folder)
                ->first(); // There could be duplicate directory names!
        
        $contents = collect(\Storage::cloud()->listContents($dir['path'], false));
        $dir = $contents->where('type', '=', 'dir')
        ->where('filename', '=', 'Video')
        ->first(); // There could be duplicate directory names!

        $filedirchild = collect(\Storage::cloud()->listContents($dir['path'], false))->where('type', '=', 'file');

        $response = [
            'success' => true,
            'folder_basename'=>$dir['basename'],
            'data' => $filedirchild,
            'message' => 'Video retrieved successfully.',   
        ];

        \Cache::put('video_user_'.Auth::Id(), $response, 600);

        return $response;
    }

    public function getAlbum(){
    
        $customer = DB::table('customers')
        ->leftJoin('users', 'customers.id_user', 'users.id')
        ->select('customers.id','customers.id_user', 'users.email', 'customers.name', 'customers.phone_no', 'customers.partner_name')
        ->where('customers.id_user', '=', Auth::Id())
        ->get()->toArray();

        
        $folder = $customer[0]->id .' - ' .$customer[0]->name;

        $contents = collect(\Storage::cloud()->listContents('/', false));
        $dir = $contents->where('type', '=', 'dir')
                ->where('filename', '=', $folder)
                ->first(); // There could be duplicate directory names!
        
        $contents = collect(\Storage::cloud()->listContents($dir['path'], false));
        $dir = $contents->where('type', '=', 'dir')
        ->where('filename', '=', 'Album')
        ->first(); // There could be duplicate directory names!

        $filedirchild = collect(\Storage::cloud()->listContents($dir['path'], false))->where('type', '=', 'file');

        $response = [
            'success' => true,
            'data' => $filedirchild,
            'message' => 'Album retrieved successfully.',   
        ];

        \Cache::put('album_user_'.Auth::Id(), $response, 600);

        return $response;
    }

    public function createZipFile($folderName){
        // Enter the name of directory
        $pathdir = $folderName;
        
        // Enter the name to creating zipped directory
        $zipcreated = $folderName.".zip";

        // Create new zip class
        $zip = new ZipArchive;

        if($zip -> open($zipcreated, ZipArchive::CREATE ) === TRUE) {
      
            // Store the path into the variable
            $dir = opendir($pathdir);
               
            while($file = readdir($dir)) {
                if(is_file($pathdir.$file)) {
                    // echo (print_r($file));
                    $zip -> addFile($pathdir.$file, $file);
                }
            }
            $zip ->close();
        }

        echo print_r($zip);
  
    }

    public function getOriginChildFolder($type, $folderName, $subId){

        $decodeName =  urldecode($folderName);

        $customer = DB::table('customers')
        ->leftJoin('users', 'customers.id_user', 'users.id')
        ->select('customers.id','customers.id_user', 'users.email', 'customers.name', 'customers.phone_no', 'customers.partner_name')
        ->where('customers.id_user', '=', Auth::Id())
        ->get()->toArray();

        
        $folder = $customer[0]->id .' - ' .$customer[0]->name;

        $contents = collect(\Storage::cloud()->listContents('/', false));
        $dir = $contents->where('type', '=', 'dir')
                ->where('filename', '=', $folder)
                ->first(); // There could be duplicate directory names!

        // die(print_r($type));
        if($type == 'origin'){
            $contents = collect(\Storage::cloud()->listContents($dir['path'], false));
            $dir = $contents->where('type', '=', 'dir')
            ->where('filename', '=', 'Foto Mentah')
            ->first(); // There could be duplicate directory names!
        }

        if($type == 'final'){
            $contents = collect(\Storage::cloud()->listContents($dir['path'], false));
            $dir = $contents->where('type', '=', 'dir')
            ->where('filename', '=', 'Foto Akhir')
            ->first(); // There could be duplicate directory names!
        }

        if($type == null){
            return ['status'=>'type is null'];
        }
        

        $contents = collect(\Storage::cloud()->listContents($dir['path'], false));

        $dir = $contents->where('type', '=', 'dir')
        ->where('filename', '=', $decodeName)
        ->first(); 

        $files = collect(\Storage::cloud()->listContents($dir['path'], false))
        ->where('type', '=', 'file');


        $tempFileCustomer = $customer[0]->id."-".$type."-".$customer[0]->name."-".$folderName;
        $tempFolderName = "tmp/".$tempFileCustomer;
        
        
        // Enter the name of directory
        $pathdir = $tempFolderName;
        
        // Enter the name to creating zipped directory
        $zipcreated = $tempFolderName.".zip";

        if(!file_exists($zipcreated)){

            mkdir($tempFolderName);

            // Create new zip class
            $zip = new ZipArchive;
                    
                    
            echo "folder created!";

            if($zip -> open($zipcreated, ZipArchive::CREATE ) === TRUE) {
                $files->mapWithKeys(function($file) use ($tempFolderName,$zip) {
                    $filename = $file['filename'].'.'.$file['extension'];
                    $path = $file['path'];
                    
                    // Use the path to download each file via a generated link..
                    $test = \Storage::cloud()->get($file['path']);
                    // echo print_r($test);
                    // die(gettype($test));
                    file_put_contents($tempFolderName."/".$filename,$test);
                    $zip -> addFile($tempFolderName."/".$filename, $filename);
                    
                    return [$filename => $path];
                });

                $zip->close();
            }

            
        }

        if(file_exists($tempFolderName)){
            $this->deleteDir($tempFolderName);
        }
        

        // $this->createZipFile($tempFolderName);
        DB::table('sub_packages')
              ->where('id', $subId)
              ->update(['is_downloaded' => 1]);

        $headers = [
            'Content-Type: application/zip',
            'Content-Length: '.filesize($zipcreated),
            'Content-Disposition : attachment; filename='.$tempFileCustomer
         ];


         if(file_exists($zipcreated)){
            return response()->download(public_path($zipcreated),$tempFileCustomer,$headers);
         }else{
            return ['status'=>'zip file does not exist'];
         }
        
        // return response(['success' => true,'data' => $files, 'message' => 'Selected Photo inserted'], 201);

        // return response(['success' => true,'data' => $files 'message' => 'Selected Photo inserted'], 201);
    }

    public static function updateDownloadedSubData($subId){
        if($subId!=null){
            $subPackage = SubPackage::find($subId);
            $subPackage->is_downloaded = 1;
            $subPackage->save();
            // die(print_r($subPackage));
            return response(['success' => true, 'message' => 'Sub Package is download updated'], 201);    
        }else{
            return response(['success' => false, 'message' => 'Sub Package id is missing'], 201);
        }
        
    }

    public static function deleteDir($dirPath) {
        if (! is_dir($dirPath)) {
            throw new InvalidArgumentException("$dirPath must be a directory");
        }
        if (substr($dirPath, strlen($dirPath) - 1, 1) != '/') {
            $dirPath .= '/';
        }
        $files = glob($dirPath . '*', GLOB_MARK);
        foreach ($files as $file) {
            if (is_dir($file)) {
                self::deleteDir($file);
            } else {
                unlink($file);
            }
        }
        rmdir($dirPath);
    }
    


    public function moveOriginToChoice(Request $request){
        $body = $request->getContent();
        $bodyJson = json_decode($body, true);

        $customer = DB::table('customers')
        ->leftJoin('users', 'customers.id_user', 'users.id')
        ->leftJoin('packages', 'customers.id', 'packages.id_customer')
        ->select('customers.id','customers.id_user', 'users.email', 'customers.name', 'customers.phone_no', 'customers.partner_name', 'packages.id as package_id')
        ->where('customers.id_user', '=', Auth::Id())
        ->get()->toArray();

        $sub_package = DB::table('sub_packages')
            ->where('id_package', '=', $customer[0]->package_id)
            ->where('sub_package_name', '=', $bodyJson['folderName'])
            ->get()->toArray();
        // die(print_r($sub_package));
        
        $folder = $customer[0]->id .' - ' .$customer[0]->name;

        $contents = collect(\Storage::cloud()->listContents('/', false));
        $dir = $contents->where('type', '=', 'dir')
                ->where('filename', '=', $folder)
                ->first(); // There could be duplicate directory names!
        
        $contents = collect(\Storage::cloud()->listContents($dir['path'], false));

        $originPhotoDir = $contents->where('type', '=', 'dir')
        ->where('filename', '=', 'Foto Mentah')
        ->first(); // There could be duplicate directory names!

        $choicePhotoDir = $contents->where('type', '=', 'dir')
        ->where('filename', '=', 'Foto Pilihan')
        ->first(); // There could be duplicate directory names!

        $fileOriginDir = collect(\Storage::cloud()->listContents($originPhotoDir['path'], false));
        $fileChoiceDir = collect(\Storage::cloud()->listContents($choicePhotoDir['path'], false));

        $filesSubOrigin = $fileOriginDir->where('type', '=', 'dir')
        ->where('filename', '=', $bodyJson['folderName'])
        ->first(); // There could be duplicate directory names!

        $filesSubChoice = $fileChoiceDir->where('type', '=', 'dir')
        ->where('filename', '=', $bodyJson['folderName'])
        ->first(); // There could be duplicate directory names!

        // $subPackageDirFile = collect(\Storage::cloud()->listContents($filesSubOrigin['path'], false));

        $filePhoto = $bodyJson['pictures'];

        $data = array();

        foreach($filePhoto as $picture){
            if($picture['selected']){
                    \Storage::cloud()->move($filesSubOrigin['path']."/".$picture['img'], $filesSubChoice['path']."/".$picture['name']);
                    // echo "move ".$filesSubOrigin['path'].$picture['img']." to ".$filesSubChoice['path'].$picture['img'];
                    // die(print_r($customer[0]->id." ".$picture['name']." ".$sub_package[0]->id));
                    // DB::table('selected_photo')->insert([
                    //     ['id_customer' => $customer[0]->id, 'basename' => $picture['img'], 'id_subpackage'=>$sub_package[0]->id]
                    // ]);
                    array_push($data, $picture);

            }
        }

        DB::table('sub_packages')
              ->where('id', $sub_package[0]->id)
              ->update(['num_selected_edit_photo' => $sub_package[0]->num_selected_edit_photo + count($data)]);
        // $sub_package[0]->num_selected_edit_photo = $sub_package[0]->num_selected_edit_photo + count($data);
        // $sub_package[0]->udpate();

        \Cache::flush();

        return response(['success' => true,'data' => $data, 'message' => 'Selected Photo inserted'], 201);
        //get data from origin photo

        //get folder 
    }

    public function moveChoiceToOrigin(Request $request){
        $body = $request->getContent();
        $bodyJson = json_decode($body, true);

        $customer = DB::table('customers')
        ->leftJoin('users', 'customers.id_user', 'users.id')
        ->leftJoin('packages', 'customers.id', 'packages.id_customer')
        ->select('customers.id','customers.id_user', 'users.email', 'customers.name', 'customers.phone_no', 'customers.partner_name', 'packages.id as package_id')
        ->where('customers.id_user', '=', Auth::Id())
        ->get()->toArray();

        $sub_package = DB::table('sub_packages')
            ->where('id_package', '=', $customer[0]->package_id)
            ->where('sub_package_name' ,'=', $bodyJson['folderName'])
        ->get()->toArray();

        
        // die(print_r($sub_package));
        
        $folder = $customer[0]->id .' - ' .$customer[0]->name;

        $contents = collect(\Storage::cloud()->listContents('/', false));
        $dir = $contents->where('type', '=', 'dir')
                ->where('filename', '=', $folder)
                ->first(); // There could be duplicate directory names!
        
        $contents = collect(\Storage::cloud()->listContents($dir['path'], false));

        $originPhotoDir = $contents->where('type', '=', 'dir')
        ->where('filename', '=', 'Foto Mentah')
        ->first(); // There could be duplicate directory names!

        $choicePhotoDir = $contents->where('type', '=', 'dir')
        ->where('filename', '=', 'Foto Pilihan')
        ->first(); // There could be duplicate directory names!

        $fileOriginDir = collect(\Storage::cloud()->listContents($originPhotoDir['path'], false));
        $fileChoiceDir = collect(\Storage::cloud()->listContents($choicePhotoDir['path'], false));

        $filesSubOrigin = $fileOriginDir->where('type', '=', 'dir')
        ->where('filename', '=', $bodyJson['folderName'])
        ->first(); // There could be duplicate directory names!

        $filesSubChoice = $fileChoiceDir->where('type', '=', 'dir')
        ->where('filename', '=', $bodyJson['folderName'])
        ->first(); // There could be duplicate directory names!

        // $subPackageDirFile = collect(\Storage::cloud()->listContents($filesSubOrigin['path'], false));

        $filePhoto = $bodyJson['pictures'];

        $data = array();

        foreach($filePhoto as $picture){
            if($picture['selected']){
                    \Storage::cloud()->move($filesSubChoice['path']."/".$picture['img'], $filesSubOrigin['path']."/".$picture['name']);
                    array_push($data, $picture);

            }
        }

        DB::table('sub_packages')
              ->where('id', $sub_package[0]->id)
              ->update(['num_selected_edit_photo' => $sub_package[0]->num_selected_edit_photo - count($data)]);

        \Cache::flush();

        return response(['success' => true,'data' => $data, 'message' => 'Move photo to origin success'], 201);
        //get data from origin photo

        //get folder 
    }

    public function downloadVideo(){

        $customer = DB::table('customers')
        ->leftJoin('users', 'customers.id_user', 'users.id')
        ->select('customers.id','customers.id_user', 'users.email', 'customers.name', 'customers.phone_no', 'customers.partner_name')
        ->where('customers.id_user', '=', Auth::Id())
        ->get()->toArray();

        
        $folder = $customer[0]->id .' - ' .$customer[0]->name;

        $contents = collect(\Storage::cloud()->listContents('/', false));
        $dir = $contents->where('type', '=', 'dir')
                ->where('filename', '=', $folder)
                ->first(); // There could be duplicate directory names!

        $contents = collect(\Storage::cloud()->listContents($dir['path'], false));
        $dir = $contents->where('type', '=', 'dir')
        ->where('filename', '=', 'Video')
        ->first(); // There could be duplicate directory names!

        $files = collect(\Storage::cloud()->listContents($dir['path'], false))
        ->where('type', '=', 'file');

        $tempFileCustomer = $customer[0]->id."-"."video"."-".$customer[0]->name;
        $tempFolderName = "tmp/".$tempFileCustomer;
        
        
        // Enter the name of directory
        $pathdir = $tempFolderName;
        
        // Enter the name to creating zipped directory
        $zipcreated = $tempFolderName.".zip";

        if(!file_exists($zipcreated)){

            mkdir($tempFolderName);

            // Create new zip class
            $zip = new ZipArchive;
                    
                    
            echo "folder created!";

            if($zip -> open($zipcreated, ZipArchive::CREATE ) === TRUE) {
                $files->mapWithKeys(function($file) use ($tempFolderName,$zip) {
                    $filename = $file['filename'].'.'.$file['extension'];
                    $path = $file['path'];
                    
                    // Use the path to download each file via a generated link..
                    $test = \Storage::cloud()->get($file['path']);
                    // echo print_r($test);
                    // die(gettype($test));
                    file_put_contents($tempFolderName."/".$filename,$test);
                    $zip -> addFile($tempFolderName."/".$filename, $filename);
                    
                    return [$filename => $path];
                });

                $zip->close();
            }

            
        }

        if(file_exists($tempFolderName)){
            $this->deleteDir($tempFolderName);
        }
        

        $headers = [
            'Content-Type: application/zip',
            'Content-Length: '. filesize($zipcreated),
            'Content-Disposition : attachment; filename='.$tempFileCustomer
         ];


         if(file_exists($zipcreated)){
            return response()->download(public_path($zipcreated),$tempFileCustomer,$headers);
         }else{
            return ['status'=>'zip file does not exist'];
         }
    }
    
    public function insertChoicePhoto(Request $request){
        $body = $request->getContent();
        $bodyJson = json_decode($body, true);
        $data = $bodyJson['data'];

        $customer = DB::table('customers')
        ->leftJoin('users', 'customers.id_user', 'users.id')
        ->select('customers.id', 'customers.id_user', 'users.email', 'customers.name', 'customers.phone_no', 'customers.partner_name')
        ->where('customers.id_user', '=', Auth::Id())
        ->get()->toArray();

        $folder = $customer[0]->id . ' - ' . $customer[0]->name;

        $mainFolder = collect(\Storage::cloud()->listContents('/', false));
        $dirMainFolder = $mainFolder->where('type', '=', 'dir')
            ->where('filename', '=', $folder)
            ->first(); // There could be duplicate directory names!

        $originPhotoFolder = collect(\Storage::cloud()->listContents($dirMainFolder['path'], false));
        $dirOriginPhotoFolder = $originPhotoFolder->where('type', '=', 'dir')
            ->where('filename', '=', 'Foto Mentah')
            ->first(); // There could be duplicate directory names!

        $choicePhotoFolder = collect(\Storage::cloud()->listContents($dirMainFolder['path'], false));
        $dirChoicePhotoFolder = $choicePhotoFolder->where('type', '=', 'dir')
            ->where('filename', '=', 'Foto Pilihan')
            ->first(); // There could be duplicate directory names!


        for($i = 0; $i < count($data); $i++){
            $childOriginFolder = collect(\Storage::cloud()->listContents($dirOriginPhotoFolder['path'], false));
            $dirChildOriginFolder = $childOriginFolder->where('type', '=', 'dir')
                ->where('filename', '=', $data[$i]['folder'])
                ->first(); // There could be duplicate directory names!

            $childChoiceFolder = collect(\Storage::cloud()->listContents($dirChoicePhotoFolder['path'], false));
            $dirChildChoiceFolder = $childChoiceFolder->where('type', '=', 'dir')
                ->where('filename', '=', $data[$i]['folder'])
                ->first(); // There could be duplicate directory names!

            for($j = 0; $j < count($data[$i]['file']); $j++){
                $dataFile = collect(\Storage::cloud()->listContents($dirChildOriginFolder['path'], false))->where('type', '=', 'file')
                ->where('filename', '=', $data[$i]['file'][$j])->first();

                \Storage::cloud()->move($dataFile['path'], $dirChildChoiceFolder['path'] ."/" .$dataFile['name']);
            }
        }

        return response(['success' => true, 'message' => 'Selected Photo inserted'], 201);

    }

    public function insertPrintPhoto(Request $request){
        $body = $request->getContent();
        $bodyJson = json_decode($body, true);
        $data = $bodyJson['data'];

        $customer = DB::table('customers')
        ->leftJoin('users', 'customers.id_user', 'users.id')
        ->select('customers.id', 'customers.id_user', 'users.email', 'customers.name', 'customers.phone_no', 'customers.partner_name')
        ->where('customers.id_user', '=', Auth::Id())
        ->get()->toArray();

        $folder = $customer[0]->id . ' - ' . $customer[0]->name;

        $mainFolder = collect(\Storage::cloud()->listContents('/', false));
        $dirMainFolder = $mainFolder->where('type', '=', 'dir')
            ->where('filename', '=', $folder)
            ->first(); // There could be duplicate directory names!

        $originPhotoFolder = collect(\Storage::cloud()->listContents($dirMainFolder['path'], false));
        $dirOriginPhotoFolder = $originPhotoFolder->where('type', '=', 'dir')
            ->where('filename', '=', 'Foto Pilihan')
            ->first(); // There could be duplicate directory names!

        $choicePhotoFolder = collect(\Storage::cloud()->listContents($dirMainFolder['path'], false));
        $dirChoicePhotoFolder = $choicePhotoFolder->where('type', '=', 'dir')
            ->where('filename', '=', 'Foto Cetak')
            ->first(); // There could be duplicate directory names!


        for($i = 0; $i < count($data); $i++){
            $childOriginFolder = collect(\Storage::cloud()->listContents($dirOriginPhotoFolder['path'], false));
            $dirChildOriginFolder = $childOriginFolder->where('type', '=', 'dir')
                ->where('filename', '=', $data[$i]['folder'])
                ->first(); // There could be duplicate directory names!

            $childChoiceFolder = collect(\Storage::cloud()->listContents($dirChoicePhotoFolder['path'], false));
            $dirChildChoiceFolder = $childChoiceFolder->where('type', '=', 'dir')
                ->where('filename', '=', $data[$i]['folder'])
                ->first(); // There could be duplicate directory names!

            if(count($data[$i]['file']) > 0){
                for($j = 0; $j < count($data[$i]['file']); $j++){
                    $dataFile = collect(\Storage::cloud()->listContents($dirChildOriginFolder['path'], false))->where('type', '=', 'file')
                    ->where('name', '=', $data[$i]['file'][$j])->first();
    
                    \Storage::cloud()->copy($dataFile['path'], $dirChildChoiceFolder['path'] ."/" .$dataFile['name']);
                }
            }
            
        }

        return response(['success' => true, 'message' => 'Print Photo inserted'], 201);

    }

    public function insertAlbumPhoto(Request $request){
        $body = $request->getContent();
        $bodyJson = json_decode($body, true);
        $data = $bodyJson['data'];
        

        $customer = DB::table('customers')
        ->leftJoin('users', 'customers.id_user', 'users.id')
        ->select('customers.id', 'customers.id_user', 'users.email', 'customers.name', 'customers.phone_no', 'customers.partner_name')
        ->where('customers.id_user', '=', Auth::Id())
        ->get()->toArray();

        $folder = $customer[0]->id . ' - ' . $customer[0]->name;

        $mainFolder = collect(\Storage::cloud()->listContents('/', false));
        $dirMainFolder = $mainFolder->where('type', '=', 'dir')
            ->where('filename', '=', $folder)
            ->first(); // There could be duplicate directory names!

        $originPhotoFolder = collect(\Storage::cloud()->listContents($dirMainFolder['path'], false));
        $dirOriginPhotoFolder = $originPhotoFolder->where('type', '=', 'dir')
            ->where('filename', '=', 'Foto Pilihan')
            ->first(); // There could be duplicate directory names!

        $choicePhotoFolder = collect(\Storage::cloud()->listContents($dirMainFolder['path'], false));
        $dirChoicePhotoFolder = $choicePhotoFolder->where('type', '=', 'dir')
            ->where('filename', '=', 'Foto Album')
            ->first(); // There could be duplicate directory names!


        for($i = 0; $i < count($data); $i++){
            $childOriginFolder = collect(\Storage::cloud()->listContents($dirOriginPhotoFolder['path'], false));
            $dirChildOriginFolder = $childOriginFolder->where('type', '=', 'dir')
                ->where('filename', '=', $data[$i]['folder'])
                ->first(); // There could be duplicate directory names!

            $childChoiceFolder = collect(\Storage::cloud()->listContents($dirChoicePhotoFolder['path'], false));
            $dirChildChoiceFolder = $childChoiceFolder->where('type', '=', 'dir')
                ->where('filename', '=', $data[$i]['folder'])
                ->first(); // There could be duplicate directory names!

            if(count($data[$i]['file']) > 0){
                for($j = 0; $j < count($data[$i]['file']); $j++){
                    $dataFile = collect(\Storage::cloud()->listContents($dirChildOriginFolder['path'], false))->where('type', '=', 'file')
                    ->where('name', '=', $data[$i]['file'][$j])->first();
                    \Storage::cloud()->copy($dataFile['path'], $dirChildChoiceFolder['path'] ."/" .$dataFile['name']);
                }
            }
            
        }


        DB::table('customers')
              ->where('id', $customer[0]->id)
              ->update(['restrict_album_print' => 1]);

        \Cache::flush();

        return response(['success' => true, 'message' => 'Album Photo inserted'], 201);

    }

    public function downloadZip(Request $request){

        // $sub = isset($request->$subId) ? $request->$subId:-1;
        $client = new Client();
        $drivezipapi = env('GOOGLE_SCRIPT_ZIP');
        $res = $client->request('GET', $drivezipapi.'/exec?IdFolder='.$request->IdFolder.'&Type='.$request->type);
        if(isset($request->subId) != false){
            DB::table('sub_packages')
            ->where('id', $request->subId)
            ->update(['is_downloaded' => 1]);
        }
        
        return response($res->getBody(), 201);
    }

    public function updateDownload(Request $request){

        $sub_package = DB::table('sub_packages')
            ->select('sub_packages.id')
            ->leftJoin('packages','sub_packages.id_package', 'packages.id')
            ->leftJoin('customers','packages.id_customer', 'customers.id')
            ->where('customers.id_user', '=', Auth::Id())
            ->where('sub_package_name' ,'=',$request->subName)
        ->get()->toArray();

        if(count($sub_package) > 0){

            DB::table('sub_packages')
              ->where('id', $sub_package[0]->id)
              ->update(['is_downloaded' => 1]);

            return response(['success' => true, 'message' => 'Update subpackage success'], 200);
        }else{
            return response(['success' => false, 'message' => 'Sub Package not found'], 404);
        }
    }

    public function refreshPhoto(Request $request){
        $user = User::find(Auth::Id());

        $customer = DB::table('customers')
        ->leftJoin('users', 'customers.id_user', 'users.id')
        ->select('customers.id','customers.id_user', 'users.email', 'customers.name', 'customers.phone_no', 'customers.partner_name')
        ->where('customers.id', '=', $request->customerId)
        ->get()->toArray();

        $isSuccess = false;
        $userId = $customer[0]->id_user;
        if ($user['role_id'] == 2) {
            if(\Cache::has('origin_photo_user_'.$userId)){
                \Cache::forget('origin_photo_user_'.$userId);
                \Cache::forget('choice_photo_user_'.$userId);
                \Cache::forget('album_user_'.$userId);
                \Cache::forget('video_user_'.$userId);
                $isSuccess = true;
            }
        }else{
            return response(['success' => false, 'message' => 'Unauthorization'], 401);    
        }

        if($isSuccess){
            return response(['success' => true, 'message' => 'Cache refresh success for user '.$userId], 200);
        }else{
            return response(['success' => false, 'message' => 'No cache for user '.$userId], 200);
        }
        
        
    }

    public function saveOriginToDB($customerId){

        try{

            Log::info('-------- start saveOriginToDB ------------');
            $user = Auth::user();

            if($user->role_id != 2){
                return response(['message' => 'Unauthorized'], 401);
            }
            $customer = DB::table('customers')
            ->leftJoin('users', 'customers.id_user', 'users.id')
            ->leftJoin('packages', 'customers.id', 'packages.id_customer')
            ->select('customers.id','customers.id_user', 'users.email', 'customers.name', 'customers.phone_no', 'customers.partner_name', 'packages.id as package_id')
            ->where('customers.id', '=', $customerId)
            ->get()->toArray();
        
            DB::delete('DELETE from origin_photo where id_customer = '.$customer[0]->id);
        
            $sub_package = DB::table('sub_packages')->where('id_package', '=', $customer[0]->package_id)->get()->toArray();
            // die(print_r($sub_package));
            
            $folder = $customer[0]->id .' - ' .$customer[0]->name;
        
            Log::info('-------- find filename of '.$folder.' -------------');
            $contents = collect(\Storage::cloud()->listContents('/', false));
            $dir = $contents->where('type', '=', 'dir')
                    ->where('filename', '=', $folder)
                    ->first(); // There could be duplicate directory names!
            
            $contents = collect(\Storage::cloud()->listContents($dir['path'], false));
            $dir = $contents->where('type', '=', 'dir')
            ->where('filename', '=', 'Foto Mentah')
            ->first(); // There could be duplicate directory names!
        
            $filedir = collect(\Storage::cloud()->listContents($dir['path'], false));
            $directory = $filedir->where('type', '=', 'dir')->toArray();
            // $file= $filedir->where('type', '=', 'file')->toArray();
        
            $data = array();
        
            for($i = 0; $i < count($directory); $i++){
                Log::info('-------- start looping of directory -------');
                $filedirchild = collect(\Storage::cloud()->listContents($directory[$i]['path'], false))->where('type', '=', 'file')->toArray();
                Log::info('------ file name :'.$directory[$i]['name']);
                for($j = 0; $j < count($filedirchild); $j++){
                    // DB::delete('DELETE from origin_photo where basename = '.$customer[0]->id);
                    $filedirchild[$j]['basename'];
                    Log::info('------- start looping of dir child --------');
                    $bodyJson['id_customer'] = $customer[0]->id;
                    $bodyJson['sub_package_name'] = $directory[$i]['name'];
                    foreach ( $sub_package as $element ) {
                        if ( $bodyJson['sub_package_name'] == $element->sub_package_name ) {
                            Log::info('----- subpackagename : '.$element->sub_package_name);
                            $bodyJson['sub_package_id'] = $element->id;
                        }
                    }
                    $bodyJson['filename'] = $filedirchild[$j]['filename'];
                    $bodyJson['path'] = $filedirchild[$j]['path'];
                    $bodyJson['basename'] = $filedirchild[$j]['basename'];
        
                    
                    Origin::create($bodyJson);
                    Log::info('----- indexed file : '.$filedirchild[$j]['filename']);
        
                }
            }

            $notif = new Notification;
            $notif->notification_type = 'CUSTOMER';
            $notif->message = 'Foto mentah telah diperbarui';
            $notif->description = 'FOTO MENTAH';
            $notif->is_read = 0;
            $notif->created_by = User::where('role_id', '=', 2)->get()->first()->id;
            $notif->id_customer = $customerId;
            $notif->save();

            Log::info('----- index origin photo success -------- ');
        
            return response(['success' => true, 'message' => 'Synchronize Successfully']);
        }catch(\Exception $e){
            echo $e;
            Log::error('----- index origin photo failed -------- '.$e);
            return response(['success' => false, 'message' => 'Failed '.$e]);
        }
    
    }

    public function countSelectedOriginPhoto($subPackageId){
        $customer = Customer::where('id_user', '=', Auth::id())->get()->first();
        $tbl = DB::table('origin_photo as op')
        ->rightJoin('(select basename, 
        choice_basename, 
        id_subpackage 
        from selected_photo where id_subpackage = '.$subpackageId.') as sp',
         'op.basename', 
         'sp.basename')
        ->select('op.id','op.sub_package_id', 'op.sub_package_name', 'op.filename', 'op.path', 'op.basename', 'op.id_customer', 
            DB::raw('(CASE WHEN sp.basename is null THEN false ELSE true END) AS is_selected')
        )
        ->where('op.id_customer', '=', $customer->id)
        ->where('op.sub_package_id', '=', $subPackageId)->get();
        // ->orWhere('sp.id_subpackage', '=', $subPackageId)->get();
        // $selectedPhoto = SelectedPhoto::where('id_customer', '=', $customer->id)->get()->toArray();
        // die(print_r(count($selectedPhoto)));
        return response(['success' => true,'data'=>count($tbl), 'message' => 'Synchronize Successfully']);
    }
    
    public function getDownloadLinkGoogleDrive($type){

        $gdriveFolderName = '';
        if($type == NULL){
            return response(['success' => false,'message' => 'Tipe folder tidak ditemukan']);
        }

        if($type == 'origin'){
            $gdriveFolderName = 'Foto Mentah';
        }

        if($type == 'choice'){
            $gdriveFolderName = 'Foto Pilihan';
        }

        if($type == 'album'){
            $gdriveFolderName = 'Album';
        }

        if($type == 'video'){
            $gdriveFolderName = 'Video';
        }

        $customer = Customer::where('id_user', '=', Auth::id())->get()->first();
        $drivelink = 'drive.google.com/drive/folders/';
        $drivesharing = '?usp=sharing';


        $obj = new \stdClass();
        $contents = collect(\Storage::cloud()->listContents('/', false));
        $dir = $contents->where('type', '=', 'dir')
                ->where('basename', '=', $customer->basename_gdrive)
                ->first(); // There could be duplicate directory names!

                
        $contents = collect(\Storage::cloud()->listContents($dir['path'], false));
        $dir = $contents->where('type', '=', 'dir')
            ->where('filename', '=', $gdriveFolderName)
            ->first(); // There could be duplicate directory names!

        $obj->parent_folder_name  =  $dir['name'];
        $obj->parent_link = $drivelink.$dir['basename'].$drivesharing;

        $contents = collect(\Storage::cloud()->listContents($dir['path'], false));
        $dir = $contents->where('type', '=', 'dir');
        $obj->child = array();

        foreach($dir as $value){
            $childDir = new \stdClass();
            $childDir->child_folder_name = $value['name'];
            $childDir->child_link = $drivelink.$value['basename'].$drivesharing;
            array_push($obj->child, $childDir);

        }

        return response(['success' => true,'data'=>$obj, 'message' => 'Link retrieved']);
    }

    public function saveChoiceToDB($customerId){


        $user = Auth::user();

        if($user->role_id != 2){
            return response(['message' => 'Unauthorized'], 401);
        }
        $customer = DB::table('customers')
        ->leftJoin('users', 'customers.id_user', 'users.id')
        ->leftJoin('packages', 'customers.id', 'packages.id_customer')
        ->select('customers.id','customers.id_user', 'users.email', 'customers.name', 'customers.phone_no', 'customers.partner_name', 'packages.id as package_id', 'customers.basename_gdrive')
        ->where('customers.id', '=', $customerId)
        ->get()->toArray();
    
        DB::delete('DELETE from choice_photo where id_customer = '.$customer[0]->id);
    
        $sub_package = DB::table('sub_packages')->where('id_package', '=', $customer[0]->package_id)->get()->toArray();
        // die(print_r($sub_package));
        
        $folder = $customer[0]->id .' - ' .$customer[0]->name;
    
        $contents = collect(\Storage::cloud()->listContents('/', false));
        $dir = $contents->where('type', '=', 'dir')
                ->where('basename', '=', $customer[0]->basename_gdrive)
                ->first(); // There could be duplicate directory names!
        
        $contents = collect(\Storage::cloud()->listContents($dir['path'], false));
        $dir = $contents->where('type', '=', 'dir')
        ->where('filename', '=', 'Foto Pilihan')
        ->first(); // There could be duplicate directory names!
    
        $filedir = collect(\Storage::cloud()->listContents($dir['path'], false));
        $directory = $filedir->where('type', '=', 'dir')->toArray();
        // $file= $filedir->where('type', '=', 'file')->toArray();
    
        $data = array();

        $selectedPhotoArray = collect(DB::table('selected_photo as select')
            ->join('sub_packages as sp', 'sp.id', 'select.id_subpackage')
            ->join('packages as p', 'p.id', 'sp.id_package')
            ->join('customers as c', 'c.id', 'p.id_customer')
            ->select('select.choice_basename')
            ->where('c.id', '=', $customerId)
            ->whereNotNull('select.choice_basename')->get()->toArray());
            // ->where('select.sub_package_id', '=', $subpackageId)
    
        for($i = 0; $i < count($directory); $i++){
    
            $filedirchild = collect(\Storage::cloud()->listContents($directory[$i]['path'], false))->where('type', '=', 'file')->toArray();
    
            for($j = 0; $j < count($filedirchild); $j++){
                if(count($selectedPhotoArray->where('choice_basename','=',$filedirchild[$j]['basename'])) > 0){
                    $bodyJson['is_edited'] = false;
                }else{
                    $bodyJson['is_edited'] = true;
                }
                $bodyJson['id_customer'] = $customer[0]->id;
                $bodyJson['sub_package_name'] = $directory[$i]['name'];
                foreach ( $sub_package as $element ) {
                    if ( $bodyJson['sub_package_name'] == $element->sub_package_name ) {
                        $bodyJson['sub_package_id'] = $element->id;
                    }
                }
                $bodyJson['filename'] = $filedirchild[$j]['filename'];
                $bodyJson['path'] = $filedirchild[$j]['path'];
                $bodyJson['basename'] = $filedirchild[$j]['basename'];
    
                Choice::create($bodyJson);
    
            }
        }

        $notif = new Notification;
        $notif->notification_type = 'CUSTOMER';
        $notif->message = 'Foto pilihan telah diperbarui';
        $notif->description = 'FOTO PILIHAN';
        $notif->is_read = 0;
        $notif->created_by = User::where('role_id', '=', 2)->get()->first()->id;
        $notif->id_customer = $customerId;
        $notif->save();
    
        return response(['success' => true, 'message' => 'Synchronize Successfully']);
    
    }

}
    