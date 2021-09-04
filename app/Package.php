<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\SubPackage;

class Package extends Model
{

    protected $table = 'packages';
    protected $fillable = [
        'package_name', 'package_description','id_customer'
    ];

    public function sub_packages(){
        return $this->hasMany(SubPackage::class, 'id_package', 'id');
    }
}
