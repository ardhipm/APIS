<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SubPackage extends Model
{

    protected $table = 'sub_packages';
    protected $fillable = [
        'sub_package_name', 'sub_package_description','num_selected_edit_photo', 'num_edit_photo', 'id_package','is_downloaded', 'num_album_photo', 'num_print_photo'
    ];
}
