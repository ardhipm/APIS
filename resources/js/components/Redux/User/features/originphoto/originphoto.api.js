import axios from "axios";
import { BASE_URL } from "../../../../config/config";

export const api = {
    getOriginPhoto,
    getOriginPhotoWithPagination,
    getOriginPhotoMetadata,
    getSubpackage,
    selectOriginPhoto,
    removeSelectedOriginPhoto,
    countSelectedOriginPhoto,
    checkoutSelectedPhoto,
    getLinkOfDownload
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


async function getOriginPhoto(page) {
    // const authToken = {'Authorization':'Bearer '+token}
    const defaultHeaders = getHeader();
    try {
        // const url = `${BASE_URL}drive/get_origin_photo`;
        const url = `https://jsonplaceholder.typicode.com/photos?_page=${page}&_limit=50`;
        // console.log(url);
        // const headers = { ...defaultHeaders };
        const response = await axios({
            method: 'GET',
            url,
            // headers,
        });
        return response;
    } catch (error) {
        if (error.response === 401) {
            // clearStoredCreds();
        }
        return Promise.reject(error.response);
    }
}

async function getOriginPhotoWithPagination(subpackage, page) {
    // const authToken = {'Authorization':'Bearer '+token}
    const defaultHeaders = getHeader();
    try {
        const url = `${BASE_URL}get_origin_photo/subpackage/${subpackage}?page=${page}`;
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

async function getOriginPhotoMetadata() {
    const defaultHeaders = getHeader();
    try {
        const url = `${BASE_URL}origin/metadata`;
        const headers = { ...defaultHeaders };
        const response = await axios({
            method: 'GET',
            url,
            headers
        })
        return response;
    } catch (error) {
        if (error.response === 401) {

        }
        return Promise.reject(error.response);
    }
}

async function getSubpackage(id) {
    const defaultHeaders = getHeader();
    try {
        const url = `${BASE_URL}customer/subpackage/${id}`;
        const headers = { ...defaultHeaders };
        const response = await axios({
            method: 'GET',
            url,
            headers
        })
        return response;
    } catch (error) {
        if (error.response === 401) {

        }
        return Promise.reject(error.response);
    }
}

async function selectOriginPhoto(basename, subpackageId = NULL) {
    const defaultHeaders = getHeader();
    try {
        const url = `${BASE_URL}drive/selected_photo?basename=${basename}&subpackageId=${subpackageId}`;
        const headers = { ...defaultHeaders };
        const response = await axios({
            method: 'GET',
            url,
            headers
        })
        return response;
    } catch (error) {
        if (error.response === 401) {

        }
        return Promise.reject(error.response);
    }
}

async function removeSelectedOriginPhoto(basename) {
    const defaultHeaders = getHeader();
    try {
        const url = `${BASE_URL}drive/delete_selected_origin_photo/${basename}`;
        const headers = { ...defaultHeaders };
        const response = await axios({
            method: 'GET',
            url,
            headers
        })
        return response;
    } catch (error) {
        if (error.response === 401) {

        }
        return Promise.reject(error.response);
    }
}

async function countSelectedOriginPhoto(subPackageId) {
    const defaultHeaders = getHeader();
    try {
        const url = `${BASE_URL}drive/get_count_selected_photo/${subPackageId}`;
        const headers = { ...defaultHeaders };
        const response = await axios({
            method: 'GET',
            url,
            headers
        })
        return response;
    } catch (error) {
        if (error.response === 401) {

        }
        return Promise.reject(error.response);
    }
}

async function checkoutSelectedPhoto(subpackageId) {
    const defaultHeaders = getHeader();
    try {
        const url = `${BASE_URL}drive/checkout_origin_photo?subpackageId=${subpackageId}`;
        const headers = { ...defaultHeaders };
        const response = await axios({
            method: 'GET',
            url,
            headers
        })
        return response;
    } catch (error) {
        if (error.response === 401) {

        }
        return Promise.reject(error.response);
    }
}

async function getLinkOfDownload(type) {
    const defaultHeaders = getHeader();
    try {
        const url = `${BASE_URL}drive/get_origin_photo_download_link/${type}`;
        const headers = { ...defaultHeaders };
        const response = await axios({
            method: 'GET',
            url,
            headers
        })
        return response;
    } catch (error) {
        if (error.response === 401) {

        }
        return Promise.reject(error.response);
    }
}