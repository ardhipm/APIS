<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SelectedAlbumPhoto extends Model
{
    //
    public $table = 'selected_album_photo';
    protected $fillable = [
        'id_customer','id_subpackage', 'basename', 'album_basename'
    ];

    public $timestamps = false;
}
