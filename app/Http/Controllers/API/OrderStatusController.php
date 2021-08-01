<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\OrderStatus;

class OrderStatusController extends Controller
{
    public function index()
    {
        $orderStatus = OrderStatus::all();
        $data = $orderStatus->toArray();

        $response = [
            'success' => true,
            'data' => $data,
            'message' => 'Order Status retrieved successfully.',
        ];

        return response()->json($response, 200);
    }
}
