<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class OrderPackage extends Model
{
    protected $fillable = [
        'album_dir_name','photo_limit'
    ];
}
