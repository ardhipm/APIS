<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableChoicePhoto extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('choice_photo', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('sub_package_name');
            $table->integer('sub_package_id');
            $table->string('filename');
            $table->string('path');
            $table->string('basename');
            $table->integer('id_customer');
            $table->boolean('is_edited');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('choice_photo');
    }
}
