<?php

namespace App\Http\Controllers\API;
use App\Customer;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;


use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class DrivePhotoController extends Controller
{
    public function index(){

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
            ->where('filename', '=', 'Album')
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


                    $filedirchild2[$j]['is_print'] = '0';
                    for($k = 0; $k < count($filedirchildPrint2); $k++){
                        if($filedirchild2[$j]['name'] == $filedirchildPrint2[$k]['name']){
                            $filedirchild2[$j]['is_print'] = '1';
                        }
                    }

                    $filedirchild2[$j]['is_album'] = '0';
                    for ($k = 0; $k < count($filedirchildAlbum2); $k++) {
                        if ($filedirchild2[$j]['name'] == $filedirchildAlbum2[$k]['name']) {
                            $filedirchild2[$j]['is_album'] = '1';
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
            'data' => $filedirchild,
            'message' => 'Video retrieved successfully.',   
        ];

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

        return $response;
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

            for($j = 0; $j < count($data[$i]['file']); $j++){
                $dataFile = collect(\Storage::cloud()->listContents($dirChildOriginFolder['path'], false))->where('type', '=', 'file')
                ->where('filename', '=', $data[$i]['file'][$j])->first();

                \Storage::cloud()->copy($dataFile['path'], $dirChildChoiceFolder['path'] ."/" .$dataFile['name']);
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
            ->where('filename', '=', 'Album')
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

                \Storage::cloud()->copy($dataFile['path'], $dirChildChoiceFolder['path'] ."/" .$dataFile['name']);
            }
        }

        return response(['success' => true, 'message' => 'Album Photo inserted'], 201);

    }
}
