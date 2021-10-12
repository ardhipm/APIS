<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Notification;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;




class NotificationController extends Controller
{
    public function indexCustomer()
    {
        $notification = DB::table('notification')
        ->leftJoin('customers', 'notification.id_customer', 'customers.id')
        ->select('notification.notification_desc', 'notification.is_read', 'notification.id', 'customers.id as cust_id', 'customers.name')
        ->where('customers.id_user', '=', Auth::Id())
        ->get()->toArray();

        $response = [
                'success' => true,
                'data' => $notification,
                'message' => 'Notification retrieved successfully.',
            ];

            return response()->json($response, 200);
    }

    public function readNotification()
    {
        $notification = DB::table('notification')
        ->leftJoin('customers', 'notification.id_customer', 'customers.id')
        ->select('notification.notification_desc', 'notification.is_read', 'notification.id', 'customers.id as cust_id', 'customers.name')
        ->where('customers.id_user', '=', Auth::Id())
        ->get()->toArray();

        $dataNotification = DB::table('notification')
            ->where('id_customer', $notification[0]->cust_id)
            ->update(['is_read' => true]);

            $response = [
                'success' => true,
                'message' => 'Notification updated successfully.',
            ];
    
            return response()->json($response, 200);
        
    }

    public function isAnyPhoto(){
    
        $customer = DB::table('customers')
        ->leftJoin('users', 'customers.id_user', 'users.id')
        ->select('customers.id','customers.id_user', 'users.email', 'customers.name', 'customers.phone_no', 'customers.partner_name')
        ->where('customers.id_user', '=', Auth::Id())
        ->get()->toArray();

        $countFile = 0;
        $folder = $customer[0]->id .' - ' .$customer[0]->name;

        $dir = '/';
        $recursive = true; // Get subdirectories also?
        $contents = collect(\Storage::cloud()->listContents($dir, $recursive));

        //return $contents->where('type', '=', 'dir'); // directories
        $data = $contents->where('type', '=', 'file'); // files

        return $data;


        // $contents = collect(\Storage::cloud()->listContents('/', false));
        // $dir = $contents->where('type', '=', 'folder')
        //         ->where('filename', '=', $folder); // There could be duplicate directory names!

        // $response = [
        //     'success' => true,
        //     'data' => count($dir),
        //     'message' => 'Final Photo retrieved successfully.',   
        // ];

        // return $response;

    }

    
}
