<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

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

    public function viewAdmin($id)
    {
        $invoice = Invoice::find($id);

        if (count($invoice) == 0) {
            $response = [
                'success' => false,
                'message' => 'Invoice not found.',
            ];
            return response()->json($response, 404);
        } else {
            $customer = DB::table('invoices')
            ->leftJoin('customers', 'invoices.id_customer', 'customers.id')
            ->select('customers.id', 'customers.id_user', 'customers.name', 'customers.phone_no', 'customers.partner_name')
            ->where('invoices.id', '=', $id)
            ->get()->toArray();

            $folder = $customer[0]->id . ' - ' . $customer[0]->name;

            $contents = collect(\Storage::cloud()->listContents('/', false));
            $dir = $contents->where('type', '=', 'dir')
                ->where('filename', '=', $folder)
                ->first(); // There could be duplicate directory names!

            $contents = collect(\Storage::cloud()->listContents($dir['path'], false));
            $dir = $contents->where('type', '=', 'dir')
                ->where('filename', '=', 'Invoice')
                ->first(); // There could be duplicate directory names!

            $filedirchild = collect(\Storage::cloud()->listContents($dir['path'], false))->where('type', '=', 'file');

            if (count($filedirchild) == 0) {
                $invoice['invoice_photo_link'] = '';

            } else {
                $invoice['invoice_photo_link'] = $filedirchild[0]['basename'];
            }


            $response = [
                'success' => true,
                'data' => $invoice,
                'message' => 'Invoice retrieved successfully.',
            ];

        }

        return response()->json($response, 200);
    }

    public function viewCustomer()
    {
        $customer = DB::table('invoices')
        ->leftJoin('customers', 'invoices.id_customer', 'customers.id')
        ->select('invoices.id as invoice_id', 'customers.id', 'customers.name')
        ->where('customers.id_user', '=', Auth::Id())
        ->get()->toArray();

        $invoice= Invoice::find($customer[0]->invoice_id);

        $folder = $customer[0]->id . ' - ' . $customer[0]->name;

        $contents = collect(\Storage::cloud()->listContents('/', false));
        $dir = $contents->where('type', '=', 'dir')
            ->where('filename', '=', $folder)
            ->first(); // There could be duplicate directory names!

        $contents = collect(\Storage::cloud()->listContents($dir['path'], false));
        $dir = $contents->where('type', '=', 'dir')
            ->where('filename', '=', 'Invoice')
            ->first(); // There could be duplicate directory names!

        $filedirchild = collect(\Storage::cloud()->listContents($dir['path'], false))->where('type', '=', 'file');

        if (count($filedirchild) == 0) {
            $invoice['invoice_photo_link'] = '';

        } else {
            $invoice['invoice_photo_link'] = $filedirchild[0]['basename'];
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
            'invoice_no' => 'required',
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
                'message' => 'Invoice deleted successfully.',
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
            DB::delete('DELETE from invoices where id = ' .$listDelete[$x]['delete']);
        }

        return response(['success' => true, 'message' => 'Deleted Successfully'], 201);

    }
}
