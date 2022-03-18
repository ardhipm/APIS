<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
// use Google_Client;
// use Illuminate\Support\Facades\Storage;

class GoogleDriveActivityServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap the application services.
     *
     * @return void
     */
    public function boot()
    {
        \Storage::extend('google', function($app, $config) {
            $client = new \Google_Client();
            $client->setClientId($config['clientId']);
            $client->setClientSecret($config['clientSecret']);
            $client->refreshToken($config['refreshToken']);
            $service = new \Google_Service_DriveActivity($client);
            $client->fetchAccessTokenWithRefreshToken($config['refreshToken']);
            $adapter = new \Hypweb\Flysystem\GoogleDrive\GoogleDriveAdapter($service, $config['folderId']);

            return new \League\Flysystem\Filesystem($adapter);
        });
    }
 
    /**
     * Register the application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }
}