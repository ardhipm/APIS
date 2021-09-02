<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class FAQ extends Model
{
    protected $fillable = [
        'faq_description'
    ];

    public $timestamps = true;

    public $table = 'faqs';
}
