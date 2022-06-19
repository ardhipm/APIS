import axios from "axios";
import { BASE_URL } from "../../../../config/config";

export const api = {
    getAlbumPhoto
}

function clearStoredCreds() {
    localStorage.removeItem('authToken');
}

function getHeader() {
    const token = localStorage.getItem('authToken')

    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }

    return defaultHeaders;
}

async function getAlbumPhoto(albumName) {
    const defaultHeaders = getHeader();
    try {
        const url = `${BASE_URL}/api/drive/get_album_photo/${albumName}`;
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