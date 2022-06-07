<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddColumnNumEditAlbumPhotoSubpackagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table("sub_packages", function(Blueprint $table){
            $table->integer('num_print_photo');
            $table->integer('num_album_photo');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
        Schema::table("sub_packages", function(Blueprint $table){
            $table->dropColumn('num_print_photo');
            $table->dropColumn('num_album_photo');

        });
    }
}
