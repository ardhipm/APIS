<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Validator;
use App\Shipment;


class ShipmentController extends Controller
{
    public function index()
    {
        $shipment = Shipment::all();
        $data = $shipment->toArray();

        $response = [
            'success' => true,
            'data' => $data,
            'message' => 'Shipment retrieved successfully.',
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
            'receipt_no' => 'required|unique:shipments',
            'receipt_link' => 'required',
            'id_customer' => 'required'
        ];

        $validator = Validator::make($bodyJson, $rules);
        if ($validator->fails()) { 
            return response(['success' => false, 'message' => $validator->errors()], 201);
        } else {

        $dataShipment= Shipment::find($id);

        if (count($dataShipment) == 0) {
            $response = [
                'success' => false,
                'message' => 'Shipment not found.',
            ];
            return response()->json($response, 404);
        } else {
            $dataShipment->receipt_no = $bodyJson['receipt_no'];
            $dataShipment->receipt_link = $bodyJson['receipt_link'];
            $dataShipment->id_customer = $bodyJson['id_customer'];
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
}
