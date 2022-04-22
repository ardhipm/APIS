<?php

use App\Http\Controllers\API\RoleController;
use Illuminate\Http\Request;
use App\Http\Controllers\API\CustomerController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\ChoicePhotoController;
use App\Http\Controllers\API\DrivePhotoController;
use App\Http\Controllers\API\DriveActivityController;
use App\Http\Controllers\API\PhotoSelectedController;
use App\Http\Controllers\API\InvoiceController;
use Illuminate\Support\Facades\Auth;
use App\Origin;
use App\Customer;
use App\SelectedPhoto;



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
Route::get('account', [UserController::class, 'checkUserRemember']);
Route::get('/checkuser', 'API\UserController@checkUserRemember');
Route::middleware('auth:api')->group(function () {
    Route::post('admin/register_customer', [UserController::class, 'registerUserCustomer']);
});
Route::middleware('auth:api')->group(function () {
    Route::post('logout', [UserController::class, 'logout']);
});
Route::middleware('auth:api')->group(function () {
    Route::post('admin/update_customer/{id}', [UserController::class, 'updateUserCustomer']);
});

Route::middleware('auth:api')->group(function (){
    Route::get('origin/metadata', [CustomerController::class, 'customerMetadata']);
});

Route::middleware('auth:api')->group(function () {
    Route::get('choice/metadata', [ChoicePhotoController::class, 'choicePhotoMetadata']);
});

//user
Route::middleware('auth:api')->group(function () {
    Route::post('admin/is_active_user/{id}', [UserController::class, 'updateIsActive']);
});
Route::post('admin/register_admin', [UserController::class, 'registerAdmin']);
Route::middleware('auth:api')->group(function () {
    Route::post('admin/user/update/{id}', [UserController::class, 'update']);
});
Route::middleware('auth:api')->group(function () {
    Route::post('admin/user/delete/{id}', [UserController::class, 'destroy']);
});
Route::middleware('auth:api')->group(function () {
    Route::post('user/delete_multiple', 'API\UserController@deleteMultiple');
});
Route::middleware('auth:api')->group(function () {
    Route::get('admin/member/view', 'API\UserController@viewMember');
});
Route::middleware('auth:api')->group(function () {
    Route::get('admin/member/detail/{id}', 'API\UserController@viewMemberDetail');
});
Route::middleware('auth:api')->group(function () {
    Route::post('admin/member/register', 'API\UserController@createMember');
});
Route::middleware('auth:api')->group(function () {
    Route::get('auth/account', 'API\UserController@currentAccount');
});

Route::get('/subpackage/update_downloaded/{id}', 'API\DrivePhotoController@updateDownloadedSubData');


//notification
Route::middleware('auth:api')->group(function () {
    Route::get('notification/view', 'API\NotificationController@indexCustomer');
});
Route::middleware('auth:api')->group(function () {
    Route::post('notification/read', 'API\NotificationController@readNotification');
});
Route::middleware('auth:api')->group(function () {
    Route::get('notification/check_notification', 'API\NotificationController@checkNotification');
});
Route::middleware('auth:api')->group(function () {
    Route::get('notification/fetch_notification', 'API\NotificationController@fetchNotifFromGScript');
});


//customer
Route::middleware('auth:api')->group(function () {
    Route::resource('customer/view', 'API\CustomerController');
});
Route::middleware('auth:api')->group(function () {
    Route::get('customer/viewAll', 'API\CustomerController@showAllCustomer');
});
Route::middleware('auth:api')->group(function () {
    Route::post('customer/create', 'API\CustomerController@store');
});
Route::middleware('auth:api')->group(function () {
    Route::get('customer/show/{id}', 'API\CustomerController@show');
});
Route::middleware('auth:api')->group(function ($id) {
    Route::post('customer/update/{id}', 'API\CustomerController@update');
});
Route::middleware('auth:api')->group(function ($id) {
    Route::post('customer/delete/{id}', 'API\CustomerController@destroy');
});
Route::middleware('auth:api')->group(function () {
    Route::post('customer/updateCustomer', 'API\CustomerController@updateCustomer');
});
Route::middleware('auth:api')->group(function () {
    Route::post('customer/sub_package/delete_multiple', 'API\CustomerController@deleteMultipleSubpackage');
    Route::get('customer/subpackage/{id}', 'API\CustomerController@customerSelectedSubpackage');
});

//invoice
// Route::middleware('auth:api')->group(function () {
//     Route::post('invoice/create', 'API\InvoiceController@store');
// });
Route::middleware('auth:api')->group(function () {
    Route::get('admin/invoice/view', 'API\InvoiceController@index');
});
Route::middleware('auth:api')->group(function () {
    Route::post('admin/invoice/update/{id}', 'API\InvoiceController@update');
});
Route::middleware('auth:api')->group(function () {
    Route::post('admin/invoice/delete/{id}', 'API\InvoiceController@destroy');
});
Route::middleware('auth:api')->group(function () {
    Route::get('admin/invoice/detail/{id}', 'API\InvoiceController@viewAdmin');
});
Route::middleware('auth:api')->group(function () {
    Route::get('invoice/customer/param', 'API\InvoiceController@viewDetailInvoiceByCustomer');
});

Route::middleware('auth:api')->group(function () {
    Route::get('invoice/view', 'API\InvoiceController@viewFromCustomer');
});
Route::middleware('auth:api')->group(function () {
    Route::post('invoice/delete_multiple', 'API\InvoiceController@deleteMultiple');
});
Route::middleware('auth:api')->group(function () {
    Route::get('invoice/get_photo', 'API\InvoiceController@getInvoicePhoto');
});



//shipment
// Route::middleware('auth:api')->group(function () {
//     Route::post('shipment/create', 'API\ShipmentController@store');
// });
Route::middleware('auth:api')->group(function () {
    Route::get('admin/shipment/view', 'API\ShipmentController@index');
});
Route::middleware('auth:api')->group(function () {
    Route::post('admin/shipment/update/{id}', 'API\ShipmentController@update');
});
Route::middleware('auth:api')->group(function () {
    Route::post('admin/shipment/delete/{id}', 'API\ShipmentController@destroy');
});
Route::middleware('auth:api')->group(function () {
    Route::get('admin/shipment/detail/{id}', 'API\ShipmentController@viewAdmin');
});
Route::middleware('auth:api')->group(function () {
    Route::get('shipment/view', 'API\ShipmentController@viewCustomer');
});
Route::middleware('auth:api')->group(function () {
    Route::post('shipment/delete_multiple', 'API\ShipmentController@deleteMultiple');
});


//FAQ
Route::middleware('auth:api')->group(function () {
    Route::get('faq/view', 'API\FAQController@index');
});
Route::middleware('auth:api')->group(function () {
    Route::post('faq/update/{id}', 'API\FAQController@update');
});
Route::middleware('auth:api')->group(function () {
    Route::post('faq/delete/{id}', 'API\FAQController@destroy');
});
Route::middleware('auth:api')->group(function () {
    Route::post('faq/create', 'API\FAQController@store');
});

Route::middleware('auth:api')->group(function () {
    Route::get('term/view', 'API\TermController@index');
});
Route::middleware('auth:api')->group(function () {
    Route::post('term/update/{id}', 'API\TermController@update');
});
Route::middleware('auth:api')->group(function () {
    Route::post('term/delete/{id}', 'API\TermController@destroy');
});
Route::middleware('auth:api')->group(function () {
    Route::post('term/create', 'API\TermController@store');
});




//order status
Route::middleware('auth:api')->group(function () {
    Route::get('order_status/view', 'API\OrderStatusController@index');
});

//role
Route::middleware('auth:api')->group(function () {
    Route::resource('role/view', 'API\RoleController');
});

// drive
Route::middleware('auth:api')->group(function () {
    Route::get('drive/get_origin_photo_with_pagination/{kategori}/{page}', 'API\DrivePhotoController@getOriginPhotoWithPagination');
});
Route::middleware('auth:api')->group(function () {
    Route::get('drive/get_origin_photo', 'API\DrivePhotoController@getOriginCachePhoto');
});

Route::get('drive/get_origin_photo_test', 'API\DrivePhotoController@getOriginPhoto');

// Route::middleware('auth:api')->group(function () {
//     Route::get('drive/get_choice_photo', 'API\DrivePhotoController@getChoicePhoto');
// });

//origin
Route::middleware('auth:api')->group(function () {
    Route::get('/get_origin_photo/subpackage/{id}', function ($id) {
        $customer = Customer::where('id_user', '=', Auth::id())->get()->first();
        $joinedTbl = DB::table('selected_photo as sp')->where('sp.id_subpackage', '=', $id);
        $tbl = DB::table('origin_photo as op')
        ->leftJoinSub($joinedTbl, 'sp', function($join){
            $join->on('op.basename','=', 'sp.basename');
        })
        ->select('op.id','op.sub_package_id', 'op.sub_package_name', 'op.filename', 'op.path', 'op.basename', 'op.id_customer', 
            DB::raw('(CASE WHEN sp.basename is null THEN false ELSE true END) AS is_selected')
        )
        ->where('op.id_customer', '=', $customer->id)
        ->where('op.sub_package_id', '=', $id)->paginate(50);
        // ->orWhere('sp.id_subpackage', '=', $id)
        return $tbl;
    });
});

//inactive
Route::middleware('auth:api')->group(function () {
    Route::get('drive/save_to_db/{customerId}', 'API\DrivePhotoController@saveOriginToDB');
    Route::get('drive/save_choice_to_db/{customerId}', 'API\DrivePhotoController@saveChoiceToDB');
});

Route::middleware('auth:api')->group(function () {
    Route::get('drive/get_choice_photo', 'API\DrivePhotoController@getChoiceCachePhoto');
    Route::get('drive/get_count_selected_photo/{subPackageId}', 'API\DrivePhotoController@countSelectedOriginPhoto');
});

// notification
Route::middleware('auth:api')->group(function () {
    Route::post('notification/create', 'API\NotificationController@testCreate');
    Route::get('notification', 'API\NotificationController@getNotificationByCustomer');
    Route::get('notification/updateIsRead/{notifId}', 'API\NotificationController@updateIsRead');
});

//inactive
Route::middleware('auth:api')->group(function () {
    Route::get('drive/get_final_photo', 'API\DrivePhotoController@getFinalPhoto');
});

Route::middleware('auth:api')->group(function () {
    Route::get('drive/get_video', 'API\DrivePhotoController@getVideoCache');
});

Route::middleware('auth:api')->group(function () {
    Route::get('drive/get_album', 'API\DrivePhotoController@getAlbumCache');
});

Route::middleware('auth:api')->group(function () {
    Route::post('drive/download_file/{type}/{folderName}/{subId}', 'API\DrivePhotoController@getOriginChildFolder');    
});

Route::middleware('auth:api')->group(function () {
    Route::post('drive/download_video', 'API\DrivePhotoController@downloadVideo');    
});
// Route::middleware('auth:api')->group(function () {
//     Route::post('drive/get_choice_photo_item/{folderName}', 'API\DrivePhotoController@getChoicePhotoFolder');    
// });
Route::middleware('auth:api')->group(function () {
    Route::post('drive/insert_choice_photo', 'API\DrivePhotoController@insertChoicePhoto');
});
Route::middleware('auth:api')->group(function () {
    Route::post('drive/insert_print_photo', 'API\DrivePhotoController@insertPrintPhoto');
});
Route::middleware('auth:api')->group(function () {
    Route::post('drive/insert_album_photo', 'API\DrivePhotoController@insertAlbumPhoto');
});
Route::middleware('auth:api')->group(function () {
    Route::get('drive/get_link_download_photo/param', 'API\DrivePhotoController@getParentSubLink');
});
Route::get('drive/download_zip_file/param', 'API\DrivePhotoController@downloadZip');
Route::middleware('auth:api')->group(function () {
    Route::get('drive/update_download/param', 'API\DrivePhotoController@updateDownload');
});

//choice photo
Route::middleware('auth:api')->group(function () {
    // Route::get('drive/update_download/param', 'API\DrivePhotoController@updateDownload');
    Route::get('v2/drive/get_choice_photo/subpackage/{subpackageId}', 'API\ChoicePhotoController@findChoicePhotoBasedSubpackage');
});


//test
// Route::get('drive/test', 'API\PhotoSelectedController@test');
Route::get('drive/checkDelete', 'API\PhotoSelectedController@checkDeleteSelectedPhoto');
//selected photo
Route::middleware('auth:api')->group(function () {
    Route::get('drive/selected_photo', 'API\PhotoSelectedController@insertSelected');
    Route::get('drive/delete_selected_origin_photo/{basename}', 'API\PhotoSelectedController@deleteSelected');
    Route::get('drive/checkout_origin_photo', 'API\PhotoSelectedController@checkoutSelectedPhoto');
    Route::get('drive/test', 'API\PhotoSelectedController@test');
    Route::get('drive/choice/checkout_album_print_photo', 'API\ChoicePhotoController@checkoutAlbumPrintPhoto');
    
});

//selected album photo
Route::middleware('auth:api')->group(function () {
    Route::get('drive/choice/selected_album_photo', 'API\SelectedAlbumPhotoController@insertSelectedAlbum');
    Route::get('drive/choice/delete_album_photo/{basename}', 'API\SelectedAlbumPhotoController@deleteSelectedAlbum');
    Route::get('drive/choice/get_count_selected_album_photo', 'API\SelectedAlbumPhotoController@countSelectedAlbumPhoto');
});

//selected print photo
Route::middleware('auth:api')->group(function () {
    Route::get('drive/choice/selected_print_photo', 'API\SelectedPrintPhotoController@insertSelectedPrint');
    Route::get('drive/choice/delete_print_photo/{basename}', 'API\SelectedPrintPhotoController@deleteSelectedPrint');
    Route::get('drive/choice/get_count_selected_print_photo', 'API\SelectedPrintPhotoController@countSelectedPrintPhoto');
});

Route::middleware('auth:api')->group(function () {
    Route::get('drive/get_origin_photo_download_link/{type}', 'API\DrivePhotoController@getDownloadLinkGoogleDrive');
});



// deleteSelected
Route::middleware('auth:api')->group(function () {
    
});
Route::middleware('auth:api')->group(function () {
    Route::post('drive/move_to_choice', 'API\DrivePhotoController@moveOriginToChoice');
});
Route::middleware('auth:api')->group(function () {
    Route::post('drive/move_to_origin', 'API\DrivePhotoController@moveChoiceToOrigin');
});
Route::middleware('auth:api')->group(function () {
    Route::post('admin/drive/refresh_photo/param', 'API\DrivePhotoController@refreshPhoto');
});

// Route::group(['middleware' => ['cors', 'json.response']], function () {

//     // ...

//     // public routes
//     Route::post('/login', 'Auth\ApiAuthController@login')->name('login.api');
//     // Route::post('/register','Auth\ApiAuthController@register')->name('register.api');
//     Route::post('/logout', 'Auth\ApiAuthController@logout')->name('logout.api');

//     // ...

// });





Route::get('test', function() {
    // Storage::disk('google')->create('yuk.txt', 'Ardhi Putra Mahardika');

    // Storage::disk('google')->makeDirectory('AMOR1');
    // return 'Directory was created in Google Drive';

        Storage::disk('main_google')->makeDirectory('tesssssss');

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
