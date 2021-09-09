<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Package;

class Customer extends Model
{

    protected $table = 'customers';
    protected $fillable = [
        'name', 'phone_no', 'partner_name','id_user'
    ];

    public $timestamps = true;

    public function packages(){
        return $this->hasMany(Package::class, 'id_customer', 'id');
    }


}
