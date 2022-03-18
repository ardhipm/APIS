<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $table = 'notifications';
    protected $fillable = [
        'id','id_customer','description', 'notification_type', 'message','created_by','created_at','updated_at','is_read'
    ];
}
