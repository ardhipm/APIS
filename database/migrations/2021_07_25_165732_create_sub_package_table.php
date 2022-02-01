<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSubPackageTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sub_packages', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('sub_package_name');
            $table->text('sub_package_description');
            $table->integer('num_edit_photo');
            $table->integer('id_package');
            $table->tinyInteger('is_downloaded')->default('0');
            $table->integer('num_selected_edit_photo')->default('0');

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
        Schema::dropIfExists('sub_packages');
    }
}
