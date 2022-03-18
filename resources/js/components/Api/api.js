import axios from "axios";
import { BASE_URL } from "../config/config";

export const api = {
    getCustomers,
    getAllCustomers,
    getInvoice,
    getLogistic,
    getAdminMember,
    getShipmentUser,
    patchShipmentAdmin,
    getAdminMemberDetail,
    getAdminShipmentDetail,
    getAdminInvoiceDetail,
    patchInvoiceAdmin,
    patchMemberAdmin,
    addMemberAdmin,
    deleteInvoice,
    deleteShipment,
    deleteAdminMember,
    getFaq,
    getTerms,
    addFaq,
    addTerms,
    updateFaq,
    updateTerms,
    indexOriginPhoto,
    indexChoicePhoto
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

async function getCustomers() {
    // const authToken = {'Authorization':'Bearer '+token}
    const defaultHeaders = getHeader();
    try {
        const url = '/api/customer/view';
        const headers = {...defaultHeaders};
        const response = await axios({
            method: 'GET',
            url,
            headers,
        });
        return response;
    } catch (error) {
        if(error.response === 401) {
            clearStoredCreds();
        }
        return Promise.reject(error.response);
    }
}

async function getAllCustomers() {
    // const authToken = {'Authorization':'Bearer '+token}
    const defaultHeaders = getHeader();
    try {
        const url = '/api/customer/viewAll';
        const headers = {...defaultHeaders};
        const response = await axios({
            method: 'GET',
            url,
            headers,
        });
        return response;
    } catch (error) {
        if(error.response === 401) {
            clearStoredCreds();
        }
        return Promise.reject(error.response);
    }
}

async function getInvoice() {
    const defaultHeaders = getHeader();
    try {
        const url = '/api/admin/invoice/view';
        const headers = {...defaultHeaders};
        const response = await axios({
            method: 'GET',
            url,
            headers,
        });
        return response;
    } catch (error) {
        if(error.response.status === 401) {
            clearStoredCreds();
        }
        return Promise.reject(error.response);
    }
}

async function getLogistic() {
    const defaultHeaders = getHeader();
    try {
        const url = '/api/admin/shipment/view';
        const headers = {...defaultHeaders};
        const response = await axios({
            method: 'GET',
            url,
            headers,
        });
        return response;
    } catch (error) {
        if(error.response.status === 401) {
            clearStoredCreds();
        }
        return Promise.reject(error.response);
    }
}

async function getShipmentUser() {
    const defaultHeaders = getHeader();
    try {
        const url = `${BASE_URL}shipment/view`;
        const headers = {...defaultHeaders, token};
        const response = await axios({
            method: 'GET',
            url,
            headers,
        });
        return response;
    } catch (error) {
        if(error.response.status === 401) {
            clearStoredCreds();
        }
        return Promise.reject(error.response);
    }
}

async function getAdminMember() {
    const defaultHeaders = getHeader();
    // const authToken = {'Authorization':'Bearer '+token}
    // console.log(defaultHeaders);
    try {
        const url = '/api/admin/member/view';
        const headers = {...defaultHeaders};
        const response = await axios({
            method: 'GET',
            url,
            headers,
        });
        return response;
    } catch (error) {
        if(error.response === 401) {
            clearStoredCreds();
        }
        return Promise.reject(error.response);
    }
}

async function patchShipmentAdmin(data,id) {
    const defaultHeaders = getHeader();
    // const authToken = {'Authorization':'Bearer '+token}
    try {
        const url = `/api/admin/shipment/update/${id}`;
        const headers = {...defaultHeaders};
        const response = await axios({
            method: 'POST',
            url,
            data,
            headers,
        });
        return response;
    } catch (error) {
        if(error.response === 401) {
            clearStoredCreds();
        }
        return Promise.reject(error.response);
    }
}

async function patchInvoiceAdmin(data,id) {
    const defaultHeaders = getHeader();
    // const authToken = {'Authorization':'Bearer '+token}
    try {
        const url = `/api/admin/invoice/update/${id}`;
        const headers = {...defaultHeaders};
        const response = await axios({
            method: 'POST',
            url,
            data,
            headers,
        });
        return response;
    } catch (error) {
        if(error.response === 401) {
            clearStoredCreds();
        }
        return Promise.reject(error.response);
    }
}

async function patchMemberAdmin(data,id) {
    const defaultHeaders = getHeader();
    // const authToken = {'Authorization':'Bearer '+token}
    try {
        const url = `/api/admin/user/update/${id}`;
        const headers = {...defaultHeaders};
        const response = await axios({
            method: 'POST',
            url,
            data,
            headers,
        });
        return response;
    } catch (error) {
        if(error.response === 401) {
            clearStoredCreds();
        }
        return Promise.reject(error.response);
    }
}

async function addMemberAdmin(data) {
    const defaultHeaders = getHeader();
    // const authToken = {'Authorization':'Bearer '+token}
    try {
        const url = `/api/admin/member/register`;
        const headers = {...defaultHeaders};
        const response = await axios({
            method: 'POST',
            url,
            data,
            headers,
        });
        return response;
    } catch (error) {
        if(error.response === 401) {
            clearStoredCreds();
        }
        return Promise.reject(error.response);
    }
}

async function getAdminMemberDetail(id) {
    const defaultHeaders = getHeader();
    // const authToken = {'Authorization':'Bearer '+token}
    try {
        const url = `/api/admin/member/detail/${id}`;
        const headers = {...defaultHeaders};
        const response = await axios({
            method: 'GET',
            url,
            headers,
        });
        return response;
    } catch (error) {
        if(error.response === 401) {
            clearStoredCreds();
        }
        return Promise.reject(error.response);
    }
}

async function getAdminShipmentDetail(id) {
    const defaultHeaders = getHeader();
    // const authToken = {'Authorization':'Bearer '+token}
    try {
        const url = `/api/admin/shipment/detail/${id}`;
        const headers = {...defaultHeaders};
        const response = await axios({
            method: 'GET',
            url,
            headers,
        });
        return response;
    } catch (error) {
        if(error.response === 401) {
            clearStoredCreds();
        }
        return Promise.reject(error.response);
    }
}

async function getAdminInvoiceDetail(id) {
    const defaultHeaders = getHeader();
    // const authToken = {'Authorization':'Bearer '+token}
    try {
        const url = `/api/admin/invoice/detail/${id}`;
        const headers = {...defaultHeaders};
        const response = await axios({
            method: 'GET',
            url,
            headers,
        });
        return response;
    } catch (error) {
        if(error.response === 401) {
            clearStoredCreds();
        }
        return Promise.reject(error.response);
    }
}

async function deleteInvoice(data) {
    const defaultHeaders = getHeader();
    // const authToken = {'Authorization':'Bearer '+token}
    try {
        const url = `/api/invoice/delete_multiple`;
        const headers = {...defaultHeaders};
        const response = await axios({
            method: 'POST',
            url,
            data,
            headers,
        });
        return response;
    } catch (error) {
        if(error.response === 401) {
            clearStoredCreds();
        }
        return Promise.reject(error.response);
    }
}

async function deleteShipment(data) {
    const defaultHeaders = getHeader();
    // const authToken = {'Authorization':'Bearer '+token}
    try {
        const url = `/api/shipment/delete_multiple`;
        const headers = {...defaultHeaders};
        const response = await axios({
            method: 'POST',
            url,
            data,
            headers,
        });
        return response;
    } catch (error) {
        if(error.response === 401) {
            clearStoredCreds();
        }
        return Promise.reject(error.response);
    }
}


async function deleteAdminMember(data) {
    const defaultHeaders = getHeader();
    // const authToken = {'Authorization':'Bearer '+token}
    try {
        const url = `/api/user/delete_multiple`;
        const headers = {...defaultHeaders};
        const response = await axios({
            method: 'POST',
            url,
            data,
            headers,
        });
        return response;
    } catch (error) {
        if(error.response === 401) {
            clearStoredCreds();
        }
        return Promise.reject(error.response);
    }
}

async function getFaq() {
    const defaultHeaders = getHeader();
    // const authToken = {'Authorization':'Bearer '+token}
    try {
        const url = `/api/faq/view`;
        const headers = {...defaultHeaders};
        const response = await axios({
            method: 'GET',
            url,
            headers,
        });
        return response;
    } catch (error) {
        if(error.response === 401) {
            clearStoredCreds();
        }
        return Promise.reject(error.response);
    }
}



async function getTerms() {
    const defaultHeaders = getHeader();
    // const authToken = {'Authorization':'Bearer '+token}
    try {
        const url = `/api/term/view`;
        const headers = {...defaultHeaders};
        const response = await axios({
            method: 'GET',
            url,
            headers,
        });
        return response;
    } catch (error) {
        if(error.response === 401) {
            clearStoredCreds();
        }
        return Promise.reject(error.response);
    }
}

async function updateFaq(data,id) {
    const defaultHeaders = getHeader();
    // const authToken = {'Authorization':'Bearer '+token}
    try {
        const url = `/api/faq/update/${id}`;
        const headers = {...defaultHeaders};
        const response = await axios({
            method: 'POST',
            url,
            headers,
            data
        });
        return response;
    } catch (error) {
        if(error.response === 401) {
            clearStoredCreds();
        }
        return Promise.reject(error.response);
    }
}


async function updateTerms(data,id) {
    const defaultHeaders = getHeader();
    // const authToken = {'Authorization':'Bearer '+token}
    try {
        const url = `/api/term/update/${id}`;
        const headers = {...defaultHeaders};
        const response = await axios({
            method: 'POST',
            url,
            headers,
            data
        });
        return response;
    } catch (error) {
        if(error.response === 401) {
            clearStoredCreds();
        }
        return Promise.reject(error.response);
    }
}

async function addFaq(data) {
    const defaultHeaders = getHeader();
    // const authToken = {'Authorization':'Bearer '+token}
    try {
        const url = `/api/faq/create`;
        const headers = {...defaultHeaders};
        const response = await axios({
            method: 'POST',
            url,
            headers,
            data
        });
        return response;
    } catch (error) {
        if(error.response === 401) {
            clearStoredCreds();
        }
        return Promise.reject(error.response);
    }
}

async function addTerms(data) {
    const defaultHeaders = getHeader();
    // const authToken = {'Authorization':'Bearer '+token}
    try {
        const url = `/api/term/create`;
        const headers = {...defaultHeaders};
        const response = await axios({
            method: 'POST',
            url,
            headers,
            data
        });
        return response;
    } catch (error) {
        if(error.response === 401) {
            clearStoredCreds();
        }
        return Promise.reject(error.response);
    }
}

async function indexOriginPhoto(customerId){
    const defaultHeaders = getHeader();
    // const authToken = {'Authorization':'Bearer '+token}
    // console.log('asdlkfjsadfl')
    try {
        const url = `/api/drive/save_to_db/${customerId}`;
        const headers = {...defaultHeaders};
        const response = await axios({
            method: 'GET',
            url,
            headers
        });
        // console.log(response);
        return response;
    } catch (error) {
        if(error.response === 401) {
            // clearStoredCreds();
        }
        // console.log(error);
        return Promise.reject(error.response);
    }
}

async function indexChoicePhoto(customerId){
    const defaultHeaders = getHeader();
    // const authToken = {'Authorization':'Bearer '+token}
    try {
        const url = `/api/drive/save_choice_to_db/${customerId}`;
        const headers = {...defaultHeaders};
        const response = await axios({
            method: 'GET',
            url,
            headers
        });
        return response;
    } catch (error) {
        if(error.response === 401) {
            // clearStoredCreds();
        }
        return Promise.reject(error.response);
    }
}