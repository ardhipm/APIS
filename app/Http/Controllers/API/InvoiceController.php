<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Validator;
use App\Invoice;


class InvoiceController extends Controller
{
    public function index()
    {
        $invoice = Invoice::all();
        $data = $invoice->toArray();

        $response = [
            'success' => true,
            'data' => $data,
            'message' => 'Invoice retrieved successfully.',
        ];

        return response()->json($response, 200);
    }

    public function store(Request $request)
    {
        $body = $request->getContent();
        $bodyJson = json_decode($body, true);

        $rules = [
            'invoice_no' => 'required|unique:invoices',
            'id_payment_status' => 'required',
            'id_customer' => 'required'
        ];

        $validator = Validator::make($bodyJson, $rules);
        if ($validator->fails()) { 
            return response(['success' => false, 'message' => $validator->errors()], 201);
        } else {
            $invoice = Invoice::create($bodyJson);

            $response = [
                'success' => true,
                'message' => 'Invoice stored successfully.'
            ];
            return response()->json($response, 404);
        }
    }

    public function update(Request $request, $id)
    {
        $body = $request->getContent();
        $bodyJson = json_decode($body, true);

        $rules = [
            'invoice_no' => 'required|unique:invoices',
            'id_payment_status' => 'required',
            'id_customer' => 'required'
        ];

        $validator = Validator::make($bodyJson, $rules);
        if ($validator->fails()) { 
            return response(['success' => false, 'message' => $validator->errors()], 201);
        } else {

        $dataInvoice= Invoice::find($id);

        if (count($dataInvoice) == 0) {
            $response = [
                'success' => false,
                'message' => 'Invoice not found.',
            ];
            return response()->json($response, 404);
        } else {
            $dataInvoice->invoice_no = $bodyJson['invoice_no'];
            $dataInvoice->id_payment_status = $bodyJson['id_payment_status'];
            $dataInvoice->id_customer = $bodyJson['id_customer'];
            $dataInvoice->save();

            $response = [
                'success' => true,
                'message' => 'Invoice updated successfully.',
            ];
        }

        return response()->json($response, 200);
    }
}

    public function destroy($id)
    {
        $invoice = Invoice::find($id);

        if (count($invoice) == 0) {
            $response = [
                'success' => false,
                'message' => 'Invoice not found.',
            ];
            return response()->json($response, 404);
        } else {
            $invoice->delete();

            $response = [
                'success' => true,
                'message' => 'Customer deleted successfully.',
            ];

        }

        return response()->json($response, 200);
    }
}
