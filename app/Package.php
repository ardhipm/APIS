<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\SubPackage;

class Package extends Model
{

    protected $table = 'packages';
    protected $fillable = [
        'package_name', 'package_description','id_customer','num_print_photo','num_album_photo','num_selected_print_photo','num_selected_album_photo'
    ];

    public function sub_packages(){
        return $this->hasMany(SubPackage::class, 'id_package', 'id');
    }
}
