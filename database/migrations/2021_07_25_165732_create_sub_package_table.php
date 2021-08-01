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
        Schema::create('sub_package', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('sub_package_name');
            $table->text('description');
            $table->integer('num_edit_photo');
            $table->integer('num_print_photo');
            $table->integer('id_package');
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
        Schema::dropIfExists('detail_package');
    }
}
