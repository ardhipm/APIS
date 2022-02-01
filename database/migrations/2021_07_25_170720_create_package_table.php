<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePackageTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('packages', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('package_name');
            $table->text('package_description');
            $table->integer('id_customer');
            $table->integer('num_print_photo')->default('0');
            $table->integer('num_album_photo')->default('0');
            $table->integer('num_selected_print_photo')->default('0');
            $table->integer('num_selected_album_photo')->default('0');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('packages');
    }
}
