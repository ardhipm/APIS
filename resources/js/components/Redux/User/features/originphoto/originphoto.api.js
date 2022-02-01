import axios from "axios";
import { BASE_URL } from "../../../../config/config";

export const api = {
    getOriginPhoto,
    getOriginPhotoWithPagination
}

const token = localStorage.getItem('authToken')

const defaultHeaders = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
}

function clearStoredCreds() {
    localStorage.removeItem('authToken');
}


async function getOriginPhoto() {
    // const authToken = {'Authorization':'Bearer '+token}
    try {
        const url = `${BASE_URL}drive/get_origin_photo`;
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

async function getOriginPhotoWithPagination(kategori, page) {
    // const authToken = {'Authorization':'Bearer '+token}
    try {
        const url = `${BASE_URL}drive/get_origin_photo_with_pagination/${kategori}/${page}`;
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

