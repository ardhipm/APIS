<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Google_Client;
use Google_Service_DriveActivity;
use Google_Service_DriveActivity_QueryDriveActivityRequest;



class DriveActivityController extends Controller
{

    public function index(){

    }
    public function getClient()
    {
        $client = new Google_Client();
        $client->setClientId(env('GOOGLE_DRIVE_CLIENT_ID_PHOTO'));
        $client->setClientSecret(env('GOOGLE_DRIVE_CLIENT_SECRET_PHOTO'));
        $client->refreshToken(env('GOOGLE_DRIVE_REFRESH_TOKEN_PHOTO'));
        // $client->setAuthConfig('credentials.json');
        // $client->setAccessType('offline');
        // $client->setPrompt('select_account consent');

        // Load previously authorized token from a file, if it exists.
        // The file token.json stores the user's access and refresh tokens, and is
        // created automatically when the authorization flow completes for the first
        // time.
        // $tokenPath = 'token.json';
        // if (file_exists($tokenPath)) {
        //     $accessToken = json_decode(file_get_contents($tokenPath), true);
        //     $client->setAccessToken($accessToken);
        // }

        // If there is no previous token or it's expired.
        if ($client->isAccessTokenExpired()) {
            // Refresh the token if possible, else fetch a new one.
            if ($client->getRefreshToken()) {
                $client->fetchAccessTokenWithRefreshToken($client->getRefreshToken());
            } else {
                // Request authorization from the user.
                $authUrl = $client->createAuthUrl();
                printf("Open the following link in your browser:\n%s\n", $authUrl);
                print 'Enter verification code: ';
                $authCode = trim(fgets(STDIN));

                // Exchange authorization code for an access token.
                $accessToken = $client->fetchAccessTokenWithAuthCode($authCode);
                $client->setAccessToken($accessToken);

                // Check to see if there was an error.
                if (array_key_exists('error', $accessToken)) {
                    throw new Exception(join(', ', $accessToken));
                }
            }
            // Save the token to a file.
            if (!file_exists(dirname($tokenPath))) {
                mkdir(dirname($tokenPath), 0700, true);
            }
            file_put_contents($tokenPath, json_encode($client->getAccessToken()));
        }
        return $client;
    }

    public function getActivity(){
        // Get the API client and construct the service object.
        $client = $this->getClient();
        $service = new Google_Service_DriveActivity($client);

        // die(print_r(json_encode($service)));
        // Print the recent activity in your Google Drive.
        $request = new Google_Service_DriveActivity_QueryDriveActivityRequest();
        $request->setPageSize(1);
        $request->setAncestorName("items/100yAar_Zc4bvM1jvAQSOd7Ewlqc5Ue50");
        $request->setFilter("detail.action_detail_case:(CREATE)");
        $results = $service->activity->query($request);
        die(print_r(json_encode($request)));

        if (count($results->getActivities()) == 0) {
            print "No activity.\n";
        } else {
            // die(var_dump(count($results->getActivities())));
            print "Recent activity:\n";
            foreach ($results->getActivities() as $activity) {
                $time = $this->getTimeInfo($activity);
                $action = $this->getActionInfo($activity->getPrimaryActionDetail());
                die(print_r(json_encode($activity)));
                $actors = array_map("getActorInfo", $activity->getActors());
                $targets = array_map("getTargetInfo", $activity->getTargets());
                printf("%s: %s, %s, %s\n", $time, truncated($actors), $action, truncated($targets));
            }
        }
    }

    // Returns a string representation of the first elements in a list.
    function truncated($array, $limit = 2)
    {
        $contents = implode(', ', array_slice($array, 0, $limit));
        $more = count($array) > $limit ? ', ...' : '';
        return sprintf('[%s%s]', $contents, $more);
    }

    // Returns the name of a set property in an object, or else "unknown".
    function getOneOf($obj)
    {
        foreach ($obj as $key => $val) {
            return $key;
        }
        return 'unknown';
    }

    // Returns a time associated with an activity.
    function getTimeInfo($activity)
    {
        if ($activity->getTimestamp() != null) {
            return $activity->getTimestamp();
        }
        if ($activity->getTimeRange() != null) {
            return $activity->getTimeRange()->getEndTime();
        }
        return 'unknown';
    }

    // Returns the type of action.
    function getActionInfo($actionDetail)
    {
        return $this->getOneOf($actionDetail);
    }

    // Returns user information, or the type of user if not a known user.
    function getUserInfo($user)
    {
        if ($user->getKnownUser() != null) {
            $knownUser = $user->getKnownUser();
            $isMe = $knownUser->getIsCurrentUser();
            return $isMe ? "people/me" : $knownUser->getPersonName();
        }
        return $this->getOneOf($user);
    }

    // Returns actor information, or the type of actor if not a user.
    function getActorInfo($actor)
    {
        if ($actor->getUser() != null) {
            return getUserInfo($actor->getUser());
        }
        return $this->getOneOf($actor);
    }

    // Returns the type of a target and an associated title.
    function getTargetInfo($target)
    {
        if ($target->getDriveItem() != null) {
            return sprintf('driveItem:"%s"', $target->getDriveItem()->getTitle());
        }
        if ($target->getDrive() != null) {
            return sprintf('drive:"%s"', $target->getDrive()->getTitle());
        }
        if ($target->getFileComment() != null) {
            $parent = $target->getFileComment()->getParent();
            if ($parent != null) {
                return sprintf('fileComment:"%s"', $parent->getTitle());
            }
            return 'fileComment:unknown';
        }
        return $this->getOneOf($target);
    }
}