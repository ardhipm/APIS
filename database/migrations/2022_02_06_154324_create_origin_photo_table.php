<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateOriginPhotoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('origin_photo', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('sub_package_name');
            $table->string('filename');
            $table->string('path');
            $table->string('basename');
            $table->integer('id_customer');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('origin_photo');
    }
}
