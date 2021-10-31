<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Notification;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
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

    
}
