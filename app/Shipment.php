<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Shipment extends Model
{
    protected $fillable = [
        'receipt_no', 'receipt_link', 'id_customer'
    ];
}
