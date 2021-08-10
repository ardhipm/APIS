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
        $dir = $contents->where('type', '=', 'dir')
                ->where('filename', '=', $folder)
                ->first(); // There could be duplicate directory names!
        
        $contents = collect(\Storage::cloud()->listContents($dir['path'], false));
        $dir = $contents->where('type', '=', 'dir')
        ->where('filename', '=', 'Foto Pilihan')
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
}
