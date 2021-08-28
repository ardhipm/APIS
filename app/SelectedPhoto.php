<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SelectedPhoto extends Model
{
    protected $fillable = [
        'basename', 'id_customer'
    ];

    public $timestamps = false;
}
