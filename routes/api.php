<?php

use App\Http\Controllers\API\RoleController;
use Illuminate\Http\Request;
use App\Http\Controllers\API\CustomerController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\DrivePhotoController;
use App\Http\Controllers\API\InvoiceController;
use Illuminate\Support\Facades\Auth;



/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

//user customer
Route::post('login', [UserController::class, 'login']);
Route::post('register', [UserController::class, 'registerUserCustomer']);
Route::middleware('auth:api')->group(function () {
    Route::post('logout', [UserController::class, 'logout']);
});
Route::middleware('auth:api')->group(function () {
    Route::post('update/{id}', [UserController::class, 'updateUserCustomer']);
});

//user
Route::middleware('auth:api')->group(function () {
    Route::post('is_active/{id}', [UserController::class, 'updateIsActive']);
});
Route::post('registerUser', [UserController::class, 'register']);


//customer
// Route::middleware('auth:api')->group(function () {
//     Route::resource('customer/view', 'API\CustomerController');
// });
// Route::middleware('auth:api')->group(function () {
//     Route::post('customer/create', 'API\CustomerController@store');
// });
Route::middleware('auth:api')->group(function () {
    Route::get('customer/show', 'API\CustomerController@show');
});
// Route::middleware('auth:api')->group(function ($id) {
//     Route::post('customer/update/{id}', 'API\CustomerController@update');
// });
// Route::middleware('auth:api')->group(function ($id) {
//     Route::post('customer/delete/{id}', 'API\CustomerController@destroy');
// });

//invoice
Route::middleware('auth:api')->group(function () {
    Route::post('invoice/create', 'API\InvoiceController@store');
});
Route::middleware('auth:api')->group(function () {
    Route::get('invoice/view', 'API\InvoiceController@index');
});
Route::middleware('auth:api')->group(function () {
    Route::post('invoice/update/{id}', 'API\InvoiceController@update');
});
Route::middleware('auth:api')->group(function () {
    Route::post('invoice/delete/{id}', 'API\InvoiceController@destroy');
});

//shipment
Route::middleware('auth:api')->group(function () {
    Route::post('shipment/create', 'API\ShipmentController@store');
});
Route::middleware('auth:api')->group(function () {
    Route::get('shipment/view', 'API\ShipmentController@index');
});
Route::middleware('auth:api')->group(function () {
    Route::post('shipment/update/{id}', 'API\ShipmentController@update');
});
Route::middleware('auth:api')->group(function () {
    Route::post('shipment/delete/{id}', 'API\ShipmentController@destroy');
});

//order status
Route::middleware('auth:api')->group(function () {
    Route::get('order_status/view', 'API\OrderStatusController@index');
});

//role
Route::middleware('auth:api')->group(function () {
    Route::resource('role/view', 'API\RoleController');
});

//drive
Route::middleware('auth:api')->group(function () {
    Route::get('drive/get_choice_photo', 'API\DrivePhotoController@getChoicePhoto');
});
Route::middleware('auth:api')->group(function () {
    Route::get('drive/get_final_photo', 'API\DrivePhotoController@getFinalPhoto');
});




Route::get('test', function() {
    // Storage::disk('google')->create('yuk.txt', 'Ardhi Putra Mahardika');

    // Storage::disk('google')->makeDirectory('AMOR1');
    // return 'Directory was created in Google Drive';

        Storage::disk('google')->makeDirectory('aawwew');

        $dir = '/';
        $recursive = false; // Get subdirectories also?
        $contents = collect(Storage::cloud()->listContents($dir, $recursive));

        $dir = $contents->where('type', '=', 'dir')
            ->where('filename', '=', 'tes')
            ->first(); // There could be duplicate directory names!

        if ( ! $dir) {
            return 'Directory does not exist!';
        }

        // Create sub dir
        Storage::cloud()->makeDirectory($dir['path'].'/Sub Dir');
});

Route::get('test2', function () {
    // $dir = '/';
    // $recursive = false; // Get subdirectories also?
    // $contents = collect(Storage::cloud()->listContents($dir, $recursive));

    // return $contents->where('type', '=', 'dir'); // directories
    // // return $contents->where('type', '=', 'file'); // files

    $folder = 'Mahardika - Revy';

    // Get root directory contents...
    $contents = collect(\Storage::cloud()->listContents('/', false));

    $album = array("Akad","Lamaran","Prewedding","Resepsi");

    // Find the folder you are looking for...

    foreach($album as $package){
        $dir = $contents->where('type', '=', 'dir')
            ->where('filename', '=', $folder)
            ->first(); // There could be duplicate directory names!



            // return $dir['path'];

            $file = collect(\Storage::cloud()->listContents($dir['path'], true))
                ->where('type', '=', 'file')
                ->where('filename', '=', 'Capture')
                ->where('extension', '=', 'PNG');

            $rawData = Storage::cloud()->get($file['3']['path']);

            // return response($rawData, 200)
            //     ->header('ContentType', 'image/png')
            //     ->header('Content-Disposition', "attachment; filename='a.png'");


            return $file->mapWithKeys(function ($file) {
                $filename = $file['filename'] . '.' . $file['extension'];
                $path = $file['path'];

                // Use the path to download each file via a generated link..
                // Storage::cloud()->get($file['path']);

                return [$filename => $path];
            });

    }

    // Get the files inside the folder...

});
