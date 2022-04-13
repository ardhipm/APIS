import axios from "axios";
import { BASE_URL } from "../../../../config/config";

export const api = {
    getChoicePhotoMetadata,
    getChoicePhotoWithPagination,
    selectAlbumPhoto,
    selectPrintPhoto,
    deleteAlbumPhoto,
    deletePrintPhoto,
    countSelectedAlbumPhoto,
    countSelectedPrintPhoto,
    checkoutAlbumPrintPhoto
}

function getHeader() {
    const token = localStorage.getItem('authToken')

    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }

    return defaultHeaders;
}


async function getChoicePhotoMetadata(){
    // const authToken = {'Authorization':'Bearer '+token}

    const defaultHeaders = getHeader();
    try {
        const url = `${BASE_URL}/api/choice/metadata`;
        // console.log(url);
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

async function getChoicePhotoWithPagination(subpackage, page) {
    // const authToken = {'Authorization':'Bearer '+token}
    const defaultHeaders = getHeader();
    try {
        const url = `${BASE_URL}/api/v2/drive/get_choice_photo/subpackage/${subpackage}?page=${page}`;
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

async function selectAlbumPhoto(basename, subpackageId = NULL){
    const defaultHeaders = getHeader();
    try{
        const url = `${BASE_URL}/api/drive/choice/selected_album_photo?basename=${basename}&subpackageId=${subpackageId}`;
        const headers = { ...defaultHeaders };
        const response = await axios({
            method: 'GET',
            url, 
            headers
        })
        return response;
    }catch (error) {
        if(error.response === 401) {

        }
        return Promise.reject(error.response);
    }
}

async function selectPrintPhoto(basename, subpackageId = NULL){
    const defaultHeaders = getHeader();
    try{
        const url = `${BASE_URL}/api/drive/choice/selected_print_photo?basename=${basename}&subpackageId=${subpackageId}`;
        const headers = { ...defaultHeaders };
        const response = await axios({
            method: 'GET',
            url, 
            headers
        })
        return response;
    }catch (error) {
        if(error.response === 401) {

        }
        return Promise.reject(error.response);
    }
}

async function deleteAlbumPhoto(basename){
    const defaultHeaders = getHeader();
    try{
        const url = `${BASE_URL}/api/drive/choice/delete_album_photo/${basename}`;
        const headers = { ...defaultHeaders };
        const response = await axios({
            method: 'GET',
            url, 
            headers
        })
        return response;
    }catch (error) {
        if(error.response === 401) {

        }
        return Promise.reject(error.response);
    }
}

async function deletePrintPhoto(basename){
    const defaultHeaders = getHeader();
    try{
        const url = `${BASE_URL}/api/drive/choice/delete_print_photo/${basename}`;
        const headers = { ...defaultHeaders };
        const response = await axios({
            method: 'GET',
            url, 
            headers
        })
        return response;
    }catch (error) {
        if(error.response === 401) {

        }
        return Promise.reject(error.response);
    }
}

async function countSelectedAlbumPhoto(){
    const defaultHeaders = getHeader();
    try{
        const url = `${BASE_URL}/api/drive/choice/get_count_selected_album_photo`;
        const headers = { ...defaultHeaders };
        const response = await axios({
            method: 'GET',
            url, 
            headers
        })
        return response;
    }catch (error) {
        if(error.response === 401) {

        }
        return Promise.reject(error.response);
    }
}

async function countSelectedPrintPhoto(){
    const defaultHeaders = getHeader();
    try{
        const url = `${BASE_URL}/api/drive/choice/get_count_selected_print_photo`;
        const headers = { ...defaultHeaders };
        const response = await axios({
            method: 'GET',
            url, 
            headers
        })
        return response;
    }catch (error) {
        if(error.response === 401) {

        }
        return Promise.reject(error.response);
    }
}
// drive/choice/checkout_album_print_photo
async function checkoutAlbumPrintPhoto(){
    const defaultHeaders = getHeader();
    try{
        const url = `${BASE_URL}/api/drive/choice/checkout_album_print_photo`;
        const headers = { ...defaultHeaders };
        const response = await axios({
            method: 'GET',
            url, 
            headers
        })
        return response;
    }catch (error) {
        if(error.response === 401) {

        }
        return Promise.reject(error.response);
    }
}