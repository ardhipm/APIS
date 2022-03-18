<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Origin extends Model
{
    protected $fillable = [
        'sub_package_id','sub_package_name', 'filename', 'path', 'basename', 'id_customer'
    ];

    protected $table = 'origin_photo';

    public $timestamps = false;
}
