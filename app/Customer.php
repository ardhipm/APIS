<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    protected $fillable = [
        'name', 'phone_no', 'partner_name','id_user'
    ];

    public $timestamps = true;
}
