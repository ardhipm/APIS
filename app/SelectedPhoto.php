<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SelectedPhoto extends Model
{

    public $table = 'selected_photo';
    protected $fillable = [
        'id_customer','id_subpackage', 'basename', 'choice_basename'
    ];

    public $timestamps = false;
}
