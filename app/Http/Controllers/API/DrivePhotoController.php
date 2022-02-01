<?php

namespace App\Http\Controllers\API;
use App\SelectedPhoto;
use App\Customer;
use App\SubPackage;
use App\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\RedirectResponse;

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

                    $parent = new \ArrayObject();
                    $parent['folder'] = $directory['name'];
                    $parent['file'] = $filedirchild[$i];

                    array_push($data, $parent);
                }
            }else{
                for($i = ($page*10) - 10; $i < count($filedirchild); $i++){
                    $dataFile = array();

                    $parent = new \ArrayObject();
                    $parent['folder'] = $directory['name'];
                    $parent['file'] = $filedirchild[$i];

                    array_push($data, $parent);
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
    
        $customer = DB::table('customers')
        ->leftJoin('users', 'customers.id_user', 'users.id')
        ->leftJoin('packages', 'customers.id', 'packages.id_customer')
        ->select('customers.id','customers.id_user', 'users.email', 'customers.name', 'customers.phone_no', 'customers.partner_name', 'packages.id as package_id')
        ->where('customers.id_user', '=', Auth::Id())
        ->get()->toArray();

        $sub_package = DB::table('sub_packages')->where('id_package', '=', $customer[0]->package_id)->get()->toArray();
        // die(print_r($sub_package));
        
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

    public function insertSelected(Request $request)
    {
        $body = $request->getContent();
        $bodyJson = json_decode($body, true);

        $customer = DB::table('customers')
            ->leftJoin('users', 'customers.id_user', 'users.id')
            ->select('customers.id', 'customers.id_user', 'users.email', 'customers.name', 'customers.phone_no', 'customers.partner_name')
            ->where('customers.id_user', '=', Auth::Id())
            ->get()->toArray();

        DB::delete('DELETE from selected_photos where id_customer = '/$customer[0]->id);


        $listBasename = $bodyJson['list_basename'];
        for ($x = 0; $x <= count($listBasename) - 1; $x++) {
            $parent = new \ArrayObject();
            $parent['id_customer'] = $customer[0]->id;
            $parent['basename'] = $listBasename[$x]['basename'];

            $parentArray = (array) $parent;

            // return $parent;
            SelectedPhoto::create($parentArray);
        }

        return response(['success' => true, 'message' => 'Selected Photo inserted'], 201);

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
}
