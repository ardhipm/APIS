<?php

namespace App\Http\Controllers;


use App\SelectedPhoto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PhotoSelectedController extends Controller
{
    public function insertSelected(Request $request)
    {
        $body = $request->getContent();
        $bodyJson = json_decode($body, true);

        $customer = DB::table('customers')
            ->leftJoin('users', 'customers.id_user', 'users.id')
            ->select('customers.id', 'customers.id_user', 'users.email', 'customers.name', 'customers.phone_no', 'customers.partner_name')
            ->where('customers.id_user', '=', Auth::Id())
            ->get()->toArray();

        DB::delete('DELETE from selected_photo where id_customer = ?', [$customer[0]->id]);

        $listBasename = $bodyJson['list_basename'];
        for ($x = 0; $x <= count($listBasename) - 1; $x++) {
            SelectedPhoto::create($listBasename[$x]);
        }

        return response(['success' => true, 'message' => 'Selected Photo inserted'], 201);

    }
}
