<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Notification;
use App\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use GuzzleHttp\Client;
use Validator;





class NotificationController extends Controller
{
    public function indexCustomer()
    {
        $customer = DB::table('customers')
            ->leftJoin('users', 'customers.id_user', 'users.id')
            ->select('customers.id', 'customers.id_user', 'users.email', 'customers.name', 'customers.phone_no', 'customers.partner_name')
            ->where('customers.id_user', '=', Auth::Id())
            ->get()->toArray();

        $notification = DB::table('notifications')
            ->leftJoin('customers', 'notifications.id_customer', 'customers.id')
            ->select('notifications.notification_desc', 'notifications.is_read', 'notifications.id', 'customers.id as cust_id', 'customers.name')
            ->where('notifications.id_customer', '=', $customer[0]->id)
            ->get()->toArray();


        $response = [
                'success' => true,
                'data' => $notification,
                'message' => 'Notification retrieved successfully.',
            ];

            return response()->json($response, 200);
    }

    public function readNotification(Request $request)
    {

        $body = $request->getContent();
        $bodyJson = json_decode($body, true);

        $rules = [
            'id' => 'required',
        ];

        $validator = Validator::make($bodyJson, $rules);
        if ($validator->fails()) { 
            return response(['success' => false, 'message' => $validator->errors()], 201);
        } else {

            $dataNotification= Notification::find($bodyJson['id']);

            if (count($dataNotification) == 0) {
                $response = [
                    'success' => false,
                    'message' => 'Notification not found.',
                ];
                return response()->json($response, 404);
            } else {
                $dataNotification->is_read = '1';
                $dataNotification->save();

                $response = [
                    'success' => true,
                    'message' => 'Notification updated successfully.',
                ];
            }
        }
        return $response;
    }
    
    public function checkNotification(){
        $customer = DB::table('customers')
            ->leftJoin('users', 'customers.id_user', 'users.id')
            ->select('customers.id', 'customers.id_user', 'users.email', 'customers.name', 'customers.phone_no', 'customers.partner_name')
            ->where('customers.id_user', '=', Auth::Id())
            ->get()->toArray();

        $notification = DB::table('notifications')
            ->leftJoin('customers', 'notifications.id_customer', 'customers.id')
            ->select('notifications.notification_desc', 'notifications.is_read', 'notifications.id', 'customers.id as cust_id', 'customers.name')
            ->where('notifications.id_customer', '=', $customer[0]->id)
            ->get()->toArray();

        $folder = $customer[0]->id . ' - ' . $customer[0]->name;

        $mainFolder = collect(\Storage::cloud()->listContents('/', false));
        $dirMainFolder = $mainFolder->where('type', '=', 'dir')
            ->where('filename', '=', $folder)
            ->first(); // There could be duplicate directory names!

        $childFolder = collect(\Storage::cloud()->listContents($dirMainFolder['path'], true));
        $dirChildFolder = $childFolder->where('type', '=', 'file')
            ->first(); // There could be duplicate directory names!


        if(sizeof($dirChildFolder) > 0){
            if(sizeof($notification) == 0){
                DB::table('notification')->insert([
                    'id_customer' => $customer[0]->id, 'notification_desc' => 'Foto telah diupload', 'is_read' => '0',
                ]);

                $response = [
                    'success' => true,
                    'message' => 'Notification inserted.',
                ];
            }else{
                $response = [
                    'success' => true,
                    'message' => 'Notification is exist.',
                ];
            }
        }else{
            $response = [
                'success' => true,
                'message' => 'Folder is empty',
            ];

        }
        return $response;
    }

    public function fetchNotifFromGScript(Request $request){
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

        $client = new Client();
        $drivezipapi = env('GOOGLE_SCRIPT_NOTIFICATION_STATUS');
        $res = $client->request('GET', $drivezipapi.'/exec?IdFolder='.$dir['basename']);
        
        return response($res->getBody(), 201);
    }

    public function testCreate(){
        $notif = new Notification;
        $notif->notification_type = 'ADMIN';
        $notif->message = 'sala123 telah memilih foto mentah';
        $notif->description = 'FOTO MENTAH';
        $notif->is_read = 0;
        $notif->id_customer = User::where('role_id', '=', 2)->get()->first()->id;
        $notif->created_by = 4;
        $notif->save();
    }

    public function getNotificationByCustomer(){
        // die(print_r($customerId));

        $userId = Auth::Id();
        $notif = null;
        
        if(Auth::user()->role_id == 2 || Auth::user()->role_id == 3){
            $notif = Notification::where('notification_type', '=', 'ADMIN')->orderBy('created_at', 'desc')->get();
        }else{
            $customer = DB::table('customers')
            ->leftJoin('users', 'customers.id_user', 'users.id')
            ->select('customers.id')
            ->where('customers.id_user', '=', $userId)
            ->get()->first();
            // die(print_r($customer));
            $notif = Notification::where('id_customer', '=', $customer->id)->orderBy('created_at', 'desc')->get();
        }

        return response(['success' => true, 'data' => $notif, 'message'=>'Notification retrieve']);
    }

    public function updateIsRead($notifId){
        Notification::where('id', '=', $notifId)->update(['is_read' => 1]);
        return response(['success' => true, 'message'=>'Notif readed']);
    }
    
}
