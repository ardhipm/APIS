<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableSelectedAlbumPhoto extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('selected_album_photo', function (Blueprint $table) {
            $table->integer('id_customer');
            $table->integer('id_subpackage');
            $table->string('basename')->unique()->nullable();
            $table->string('album_basename')->unique()->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('selected_album_photo');
    }
}
