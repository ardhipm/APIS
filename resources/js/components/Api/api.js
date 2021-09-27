import axios from "axios";
import { BASE_URL } from "../config/config";

export const api = {
    getCustomers,
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
    updateTerms
}

const token = localStorage.getItem('authToken')

const defaultHeaders = {
    'Content-Type': 'application/json',
    'Authorization':'Bearer '+token
}

function clearStoredCreds() {
    localStorage.removeItem('authToken'); 
}


async function getCustomers() {
    // const authToken = {'Authorization':'Bearer '+token}
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

async function getInvoice() {
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
    // const authToken = {'Authorization':'Bearer '+token}
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
