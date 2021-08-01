<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SubPackage extends Model
{
    protected $fillable = [
        'sub_package_name', 'sub_package_description', 'num_edit_photo', 'num_print_photo', 'id_package'
    ];
}
