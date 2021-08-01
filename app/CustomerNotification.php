<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CustomerNotification extends Model
{
    protected $fillable = [
        'is_read'
    ];
}
