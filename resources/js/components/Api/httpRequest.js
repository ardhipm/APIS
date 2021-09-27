import axios from "axios";
// import { store } from "../../config";

const token = localStorage.getItem('authToken')
const defaultHeaders = {
    'Content-Type': 'application/json',
    'Authorization':'Bearer '+token
}
export default function AxiosRequest(method, url, data, params, responseType) {
//   const { REACT_APP_API_URL } = process.env;

  return axios({
    method: method,
    url:  `/api${url}`,
    // url: "http://localhost:3030" + `/api${url}`,
    data: data,
    params: params,
    headers: defaultHeaders,
    responseType: responseType ? responseType : null,
  }
  );
}


export function getData(url, params, data) {
  return AxiosRequest("GET", url, data, params, null);
}

export function getBlob(url, params) {
  return AxiosRequest("GET", url, null, params, "arraybuffer");
}

export function postBlob(url, data, params) {
  return AxiosRequest("POST", url, data, params, "arraybuffer");
}

export function postData(url, data, params) {
  return AxiosRequest("POST", url, data, params);
}
