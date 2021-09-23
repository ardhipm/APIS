<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Validator;
use App\Shipment;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;


class ShipmentController extends Controller
{
    public function index()
    {
        // $shipment = Shipment::all();

        $shipment = DB::table('shipments')
        ->leftJoin('customers', 'customers.id', 'shipments.id_customer')
        ->select('shipments.id as shipment_id', 'shipments.receipt_no','shipments.receipt_link', 'shipments.id_customer as customer_id','customers.name', 'customers.partner_name')
        ->get();
        $data = $shipment->toArray();

        $response = [
            'success' => true,
            'data' => $data,
            'message' => 'Shipment retrieved successfully.',
        ];

        return response()->json($response, 200);
    }

    public function viewAdmin($id)
    {
        
        $shipment = DB::table('shipments')
            ->leftJoin('customers', 'shipments.id_customer', 'customers.id')
            ->select('customers.id as customer_id', 'customers.id_user', 'customers.name as customer_name', 'customers.phone_no', 'customers.partner_name', 'shipments.receipt_no', 'shipments.receipt_link')
            ->where('shipments.id', '=', $id)
            ->get()->toArray();

        $folder = $shipment[0]->customer_id . ' - ' . $shipment[0]->customer_name;

        $contents = collect(\Storage::cloud()->listContents('/', false));
        $dir = $contents->where('type', '=', 'dir')
            ->where('filename', '=', $folder)
            ->first(); // There could be duplicate directory names!

        $contents = collect(\Storage::cloud()->listContents($dir['path'], false));
        $dir = $contents->where('type', '=', 'dir')
            ->where('filename', '=', 'Shipment')
            ->first(); // There could be duplicate directory names!

        $filedirchild = collect(\Storage::cloud()->listContents($dir['path'], false))->where('type', '=', 'file');

        if(count($filedirchild) == 0){
            $shipment['shimpent_photo_link'] = '';

        } else {
            $shipment['shimpent_photo_link'] = $filedirchild[0]['basename'];
        }
        

        $response = [
            'success' => true,
            'data' => $shipment,
            'message' => 'Invoice retrieved successfully.',
        ];

        

        return response()->json($response, 200);
    }

    public function viewCustomer()
    {
        $customer = DB::table('shipments')
        ->leftJoin('customers', 'shipments.id_customer', 'customers.id')
        ->select('shipments.id as shipment_id', 'customers.id', 'customers.name')
        ->where('customers.id_user', '=', Auth::Id())
        ->get()->toArray();

        $invoice= Shipment::find($customer[0]->shipment_id);

        $folder = $customer[0]->id . ' - ' . $customer[0]->name;

        $contents = collect(\Storage::cloud()->listContents('/', false));
        $dir = $contents->where('type', '=', 'dir')
            ->where('filename', '=', $folder)
            ->first(); // There could be duplicate directory names!

        $contents = collect(\Storage::cloud()->listContents($dir['path'], false));
        $dir = $contents->where('type', '=', 'dir')
            ->where('filename', '=', 'Shipment')
            ->first(); // There could be duplicate directory names!

        $filedirchild = collect(\Storage::cloud()->listContents($dir['path'], false))->where('type', '=', 'file');

        if (count($filedirchild) == 0) {
            $invoice['shimpent_photo_link'] = '';

        } else {
            $invoice['shipment_photo_link'] = $filedirchild[0]['basename'];
        }


        $response = [
                'success' => true,
                'data' => $invoice,
                'message' => 'Invoice retrieved successfully.',
            ];

            return response()->json($response, 200);
    }

    public function store(Request $request)
    {
        $body = $request->getContent();
        $bodyJson = json_decode($body, true);

        $rules = [
            'receipt_no' => 'required|unique:shipments',
            'receipt_link' => 'required',
            'id_customer' => 'required'
        ];

        $validator = Validator::make($bodyJson, $rules);
        if ($validator->fails()) { 
            return response(['success' => false, 'message' => $validator->errors()], 201);
        } else {
            $shipment = Shipment::create($bodyJson);

            $response = [
                'success' => true,
                'message' => 'Shipment stored successfully.'
            ];
            return response()->json($response, 404);
        }
    }

    public function update(Request $request, $id)
    {
        $body = $request->getContent();
        $bodyJson = json_decode($body, true);

        $rules = [
            'receipt_no' => 'required',
            'receipt_link' => 'required'
        ];

        $validator = Validator::make($bodyJson, $rules);
        if ($validator->fails()) { 
            return response(['success' => false, 'message' => $validator->errors()], 201);
        } else {

        $dataShipment= Shipment::find($id);

        if ($dataShipment == null) {
            $response = [
                'success' => false,
                'message' => 'Shipment not found.',
            ];
            return response()->json($response, 404);
        } else {
            $dataShipment->receipt_no = $bodyJson['receipt_no'];
            $dataShipment->receipt_link = $bodyJson['receipt_link'];
            $dataShipment->save();

            $response = [
                'success' => true,
                'message' => 'Shipment updated successfully.',
            ];
        }

        return response()->json($response, 200);
    }
}

    public function destroy($id)
    {
        $shipment = Shipment::find($id);

        if (count($shipment) == 0) {
            $response = [
                'success' => false,
                'message' => 'Shipment not found.',
            ];
            return response()->json($response, 404);
        } else {
            $shipment->delete();

            $response = [
                'success' => true,
                'message' => 'Shipment deleted successfully.',
            ];

        }

        return response()->json($response, 200);
    }

    public function deleteMultiple(Request $request)
    {
        $body = $request->getContent();
        $bodyJson = json_decode($body, true);

        $listDelete = $bodyJson['list_delete'];
        for ($x = 0; $x <= count($listDelete) - 1; $x++) {
            DB::delete('DELETE from shipments where id = ' .$listDelete[$x]);
        }

        return response(['success' => true, 'message' => 'Deleted Successfully'], 201);

    }
}
