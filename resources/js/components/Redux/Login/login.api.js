import axios from "axios";
import { BASE_URL } from "../../config/config";
import { getCustomers } from "./../Admin/action";

export const api = {
    login
}

const defaultHeaders = {
    'Content-Type': 'application/json',
}

async function login(userId, password, rememberMe) {
    // console.log('here');
    try {
        const url = `${BASE_URL}/api/login`;
        const headers = { ...defaultHeaders };
        const response = await axios({
            method: 'POST',
            url,
            headers,
            data: {
                username: userId,
                password: password,
                rememberMe: rememberMe
            }
        })
        return response;
    } catch (error) {
        if (error.response === 401) {
            // clearStoredCreds();
        }
        return Promise.reject(error.response);
    }
}

// async function getUser(){
//     try{
//         const url = `${BASE_URL}`;
//         const headers = { ...defaultHeaders };
//         const response = await axios({
//             method: 'POST',
//             url,
//             headers,
//             data: {
//                 username: userId,
//                 password: password,
//                 rememberMe: rememberMe
//             }
//         })

//         getCustomers()
//         return response;
//     }catch
// }

