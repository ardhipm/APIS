import axios from "axios";
import { BASE_URL } from "../../config/config";

export const api = {
    getUserNotification,
    readNotification
}

function getHeader() {
    const token = localStorage.getItem('authToken')

    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }

    return defaultHeaders;
}


async function getUserNotification(){
    const defaultHeaders = getHeader();
    try {
        const url = `${BASE_URL}/api/notification`;
        // console.log('aljasdlksdjflksdlksfdj',url);
        const headers = { ...defaultHeaders };
        const response = await axios({
            method: 'GET',
            url,
            headers,
        });
        return response;
    } catch (error) {
        if (error.response === 401) {
            // clearStoredCreds();
        }
        return Promise.reject(error.response);
    }
}

async function readNotification(notifId){
    const defaultHeaders = getHeader();
    try {
        const url = `${BASE_URL}/api/notification/updateIsRead/${notifId}`;
        const headers = { ...defaultHeaders };
        const response = await axios({
            method: 'GET',
            url,
            headers,
        });
        return response;
    } catch (error) {
        if (error.response === 401) {
            // clearStoredCreds();
        }
        return Promise.reject(error.response);
    }
}