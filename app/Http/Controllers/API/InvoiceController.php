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
        // $invoice = Invoice::all();

        $invoice = DB::table('invoices')->distinct()
        ->leftJoin('customers', 'customers.id', 'invoices.id_customer')
        ->select('invoices.id as invoice_id', 'invoices.invoice_no', 'invoices.id_customer as customer_id','invoices.id_payment_status', 'customers.name','invoices.id_customer', 'customers.partner_name')
        ->get();
        
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

        if ($invoice== null) {
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
            $invoice['customer_name'] = $customer[0]->name;
            $invoice['partner_name'] = $customer[0]->partner_name;
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

    public function viewDetailInvoiceByCustomer(Request $request){

        $customer = DB::table('customers')
        ->select('*')
        ->where('id', '=', $request->id_customer)
        ->get()->toArray();

        $customerInvoiceDetail = new \stdClass();
        $customerInvoiceDetail->id_customer = $request->id_customer;
        $customerInvoiceDetail->name = $customer[0]->name;
        $customerInvoiceDetail->partner_name = $customer[0]->partner_name;

        $invoiceDb = DB::table('invoices')
        ->select('*')
        ->where('id_customer', '=', $request->id_customer)
        ->get()->toArray();

        $invoices = array();
        foreach ($invoiceDb as $x => $val) {
            $invoiceItem = new \stdClass();
            $invoiceItem->id = $val->id;
            $invoiceItem->invoice_no = $val->invoice_no;
            $invoiceItem->id_payment_status = $val->id_payment_status;
            $invoiceItem->id_google_drive_photo = $val->id_google_drive_photo;
            array_push($invoices, $invoiceItem);
        } 

        $customerInvoiceDetail->invoices = $invoices;

        $response = [
            'success' => true,
            'data' => $customerInvoiceDetail,
            'message' => 'Customer invoice detail retrieved successfully.',
        ];

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
            ->first(); // There could be duplicate sdirectory names!
        
        $checkDirInvoice = collect(\Storage::cloud()->listContents($dir['path'], false))->where('type', '=', 'dir')->
        where('filename', '=', 'InvoiceMerged')->first();

        if($checkDirInvoice != NULL && count($checkDirInvoice) > 0){
            \Storage::cloud()->deleteDirectory($checkDirInvoice['path']);
        }

        $filedirchild = collect(\Storage::cloud()->listContents($dir['path'], false))->where('type', '=', 'file');

        if($filedirchild != NULL && count($filedirchild) > 0){

            \Storage::disk('local')->deleteDirectory('pdf/' .$customer[0]->id . ' - ' . $customer[0]->name);

            $pdf = \PDFMerger::init();

            for($k = 0; $k < count($filedirchild); $k++){
                $rawData = \Storage::cloud()->get($filedirchild[$k]['path']);
                \Storage::disk('local')->put('pdf/'.$customer[0]->id . ' - ' . $customer[0]->name .'/' .$filedirchild[$k]['filename'] .'.pdf', $rawData, 'public');
            }

            $allFiles = \Storage::disk('public')->allFiles('pdf/' .$customer[0]->id . ' - ' . $customer[0]->name);

            for($k = 0; $k < count($filedirchild); $k++){
                $pdf->addPDF(base_path('storage/app/pdf/'.$customer[0]->id . ' - ' . $customer[0]->name .'/' .$filedirchild[$k]['filename'] .'.pdf'), 'all');
            }

            $pdf->merge();
            $pdf->save(base_path('storage/app/pdf/' .$customer[0]->id . ' - ' . $customer[0]->name .'/InoviceMerged.pdf' ));

            \Storage::cloud()->makeDirectory($dir['path'] . '/InvoiceMerged');

            $contentInvoice = collect(\Storage::cloud()->listContents($dir['path'], false));
            $dirInvoice = $contentInvoice->where('type', '=', 'dir')
                ->where('filename', '=', 'InvoiceMerged')
                ->first();

            \Storage::cloud()->put($dirInvoice['path'] . '/InvoiceMerged.pdf', $pdf->output());

            $fileinvoice = collect(\Storage::cloud()->listContents($dirInvoice['path'], false))->where('type', '=', 'file');

            if (count($fileinvoice) == 0) {
                $invoice['invoice_link'] = '';
            } else {
                $invoice['invoice_link'] = $fileinvoice[0]['basename'];
            }

        } else {
            $invoice['invoice_link'] = '';
        }
        
        $response = [
                'success' => true,
                'data' => $invoice,
                'message' => 'Invoice Successfully Retrieved',
            ];

        return response()->json($response, 200);
    }

    public function viewFromCustomer()
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
            'id'=> 'required',
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
            'id_payment_status' => 'required'
        ];

        $validator = Validator::make($bodyJson, $rules);
        if ($validator->fails()) { 
            return response(['success' => false, 'message' => $validator->errors()], 201);
        } else {

        $dataInvoice= Invoice::find($id);

        if ($dataInvoice == null) {
            $response = [
                'success' => false,
                'message' => 'Invoice not found.',
            ];
            return response()->json($response, 404);
        } else {
            $dataInvoice->invoice_no = $bodyJson['invoice_no'];
            $dataInvoice->id_payment_status = $bodyJson['id_payment_status'];
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
            DB::delete('DELETE from invoices where id = ' .$listDelete[$x]);
        }

        return response(['success' => true, 'message' => 'Deleted Successfully'], 201);

    }

    public function getInvoicePhoto(){
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
        ->where('filename', '=', 'Invoice')
        ->first(); // There could be duplicate directory names!

        $filedir = collect(\Storage::cloud()->listContents($dir['path'], false));
        $file = $filedir->where('type', '=', 'file')->toArray();

        $response = [
            'success' => true,
            'data' => $file,
            'message' => 'Invoice Photo retrieved successfully.',   
        ];

        return $response;
        // $file= $filedir->where('type', '=', 'file')->toArray();
    }
}
