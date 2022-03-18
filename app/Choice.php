<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Choice extends Model
{
    protected $fillable = [
        'sub_package_id','sub_package_name', 'filename', 'path', 'basename', 'id_customer', 'is_edited'
    ];

    protected $table = 'choice_photo';

    public $timestamps = false;
}
