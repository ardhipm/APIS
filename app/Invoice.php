<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    protected $fillable = [
        'invoice_no', 'id_payment_status', 'id_customer'
    ];

    public $timestamps = true;
}
