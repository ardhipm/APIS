<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $fillable = [
        'id_customer', 'notification_desc', 'is_read'
    ];
}
