<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SelectedPrintPhoto extends Model
{
    //
    public $table = 'selected_print_photo';
    protected $fillable = [
        'id_customer','id_subpackage', 'basename', 'print_basename'
    ];

    public $timestamps = false;
}
