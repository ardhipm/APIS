import {
    GET_CUSTOMER_VIEW,
    GET_CUSTOMER_VIEW_SUCCESS,
    GET_CUSTOMER_VIEW_FAIL,
    GET_SHIPMENT_VIEW,
    GET_SHIPMENT_VIEW_SUCCESS,
    GET_SHIPMENT_VIEW_FAIL,
    GET_INVOICE_VIEW,
    GET_INVOICE_VIEW_SUCCESS,
    GET_INVOICE_VIEW_FAIL,
    GET_ADMIN_MEMBER_VIEW,
    GET_ADMIN_MEMBER_VIEW_SUCCESS,
    GET_ADMIN_MEMBER_VIEW_FAIL,
    PATCH_SHIPMENTS_ADMIN,
    PATCH_SHIPMENTS_ADMIN_SUCCESS,
    PATCH_SHIPMENTS_ADMIN_FAIL,
    PATCH_INVOICE_ADMIN,
    PATCH_INVOICE_ADMIN_SUCCESS,
    PATCH_INVOICE_ADMIN_FAIL,
    PATCH_MEMBER_ADMIN,
    PATCH_MEMBER_ADMIN_SUCCESS,
    PATCH_MEMBER_ADMIN_FAIL,
    GET_ADMIN_SHIPMENT_DETAIL,
    GET_ADMIN_SHIPMENT_DETAIL_SUCCESS,
    GET_ADMIN_SHIPMENT_DETAIL_FAIL,
    GET_ADMIN_INVOICE_DETAIL,
    GET_ADMIN_INVOICE_DETAIL_SUCCESS,
    GET_ADMIN_INVOICE_DETAIL_FAIL,
    GET_ADMIN_MEMBER_DETAIL,
    GET_ADMIN_MEMBER_DETAIL_FAIL,
    GET_ADMIN_MEMBER_DETAIL_SUCCESS,
    ADD_MEMBER_ADMIN,
    ADD_MEMBER_ADMIN_SUCCESS,
    ADD_MEMBER_ADMIN_FAIL,
    DELETE_SHIPMENT_ADMIN,
    DELETE_SHIPMENT_ADMIN_SUCCESS,
    DELETE_SHIPMENT_ADMIN_FAIL,
    DELETE_INVOICE_ADMIN,
    DELETE_INVOICE_ADMIN_SUCCESS,
    DELETE_INVOICE_ADMIN_FAIL,
    DELETE_MEMBER_ADMIN,
    DELETE_MEMBER_ADMIN_SUCCESS,
    DELETE_MEMBER_ADMIN_FAIL,
    PATCH_FAQ_ADMIN,
    PATCH_FAQ_ADMIN_SUCCESS,
    PATCH_FAQ_ADMIN_FAIL,
    PATCH_TERMS_ADMIN,
    PATCH_TERMS_ADMIN_SUCCESS,
    PATCH_TERMS_ADMIN_FAIL,
    ADD_TERMS_ADMIN,
    ADD_TERMS_ADMIN_SUCCESS,
    ADD_TERMS_ADMIN_FAIL,
    ADD_FAQ_ADMIN,
    ADD_FAQ_ADMIN_SUCCESS,
    ADD_FAQ_ADMIN_FAIL,
    GET_FAQ_ADMIN,
    GET_FAQ_ADMIN_SUCCESS,
    GET_FAQ_ADMIN_FAIL,
    GET_TERMS_ADMIN,
    GET_TERMS_ADMIN_SUCCESS,
    GET_TERMS_ADMIN_FAIL,
    INDEX_CHOICE_PHOTO,
    INDEX_CHOICE_PHOTO_FAIL,
    INDEX_CHOICE_PHOTO_SUCCESS,
    INDEX_ORIGIN_PHOTO,
    INDEX_ORIGIN_PHOTO_FAIL,
    INDEX_ORIGIN_PHOTO_SUCCESS
} from '../actionTypes'

import {api} from '../../Api/api'
import { getAction } from 'connected-react-router';
import { setOpenLoadingPopup } from '../Popup/Loading/loading.action';
import { setOpenAlertPopup } from '../Popup/Alert/alert.action';

export const getCustomers = () => dispatch => {
    dispatch({
        type: GET_CUSTOMER_VIEW
    });
    const request = api.getCustomers();

    return request.then(
        response => dispatch(getCustomersSuccess(response.data)),        
        err => dispatch(getCustomersFail(err)),
    );
    
};

export const getAllCustomers = () => dispatch => {
    dispatch({
        type: GET_CUSTOMER_VIEW
    });
    const request = api.getAllCustomers();

    return request.then(
        response => dispatch(getCustomersSuccess(response.data)),        
        err => dispatch(getCustomersFail(err)),
    );
    
};

export const getCustomersSuccess = ({
    data
}) => dispatch => {
    return dispatch({
        type: GET_CUSTOMER_VIEW_SUCCESS,
        payload: data
    })
}

export const getCustomersFail = (data) => dispatch => {
    return dispatch({
        type: GET_CUSTOMER_VIEW_FAIL,
        payload: data
    })
}

export const getLogistic = () => dispatch => {
    dispatch({
        type: GET_SHIPMENT_VIEW
    });
    const request = api.getLogistic();

    return request.then(
        response => dispatch(getLogisticSuccess(response.data)),        
        err => dispatch(getLogisticFail(err)),
    );
    
};

export const getLogisticSuccess = ({
    data
}) => dispatch => {
    return dispatch({
        type: GET_SHIPMENT_VIEW_SUCCESS,
        payload: data
    })
}

export const getLogisticFail = (data) => dispatch => {
    return dispatch({
        type: GET_SHIPMENT_VIEW_FAIL,
        payload: data
    })
}

export const getInvoice = () => dispatch => {
    dispatch({
        type: GET_INVOICE_VIEW
    });
    const request = api.getInvoice();

    return request.then(
        response => dispatch(getInvoiceSuccess(response.data)),        
        err => dispatch(getInvoiceFail(err)),
    );
    
};

export const getInvoiceSuccess = ({
    data
}) => dispatch => {
    return dispatch({
        type: GET_INVOICE_VIEW_SUCCESS,
        payload: data
    })
}

export const getInvoiceFail = (data) => dispatch => {
    return dispatch({
        type: GET_INVOICE_VIEW_FAIL,
        payload: data
    })
}

export const getAdminMember = () => dispatch => {
    dispatch({
        type: GET_ADMIN_MEMBER_VIEW
    });
    const request = api.getAdminMember();

    return request.then(
        response => dispatch(getAdminMemberSuccess(response.data)),        
        err => dispatch(getAdminMemberFail(err)),
    );
    
};

export const getAdminMemberSuccess = ({
    data
}) => dispatch => {
    return dispatch({
        type: GET_ADMIN_MEMBER_VIEW_SUCCESS,
        payload: data
    })
}

export const getAdminMemberFail = (data) => dispatch => {
    return dispatch({
        type: GET_ADMIN_MEMBER_VIEW_FAIL,
        payload: data
    })
}

export const patchShipmentAdmin = (data,id) => dispatch => {
    dispatch({
        type: PATCH_SHIPMENTS_ADMIN
    });
    const request = api.patchShipmentAdmin(data,id);

    return request.then(
        response => dispatch(patchShipmentAdminSuccess(response.data)),        
        err => dispatch(patchShipmentAdminFail(err)),
    );
    
};

export const patchShipmentAdminSuccess = ({
    data
}) => dispatch => {
    return dispatch({
        type: PATCH_SHIPMENTS_ADMIN_SUCCESS,
        payload: data
    })
}

export const patchShipmentAdminFail = (data) => dispatch => {
    return dispatch({
        type: PATCH_SHIPMENTS_ADMIN_FAIL,
        payload: data
    })
}

export const patchInvoiceAdmin = (data,id) => dispatch => {
    dispatch({
        type: PATCH_INVOICE_ADMIN
    });
    const request = api.patchInvoiceAdmin(data,id);

    return request.then(
        response => dispatch(patchInvoiceAdminSuccess(response.data)),        
        err => dispatch(patchInvoiceAdminFail(err)),
    );
    
};

export const patchInvoiceAdminSuccess = ({
    data
}) => dispatch => {
    return dispatch({
        type: PATCH_INVOICE_ADMIN_SUCCESS,
        payload: data
    })
}

export const patchInvoiceAdminFail = (data) => dispatch => {
    return dispatch({
        type: PATCH_INVOICE_ADMIN_FAIL,
        payload: data
    })
}

export const getAdminShipmentDetail = (id) => dispatch => {
    dispatch({
        type: GET_ADMIN_SHIPMENT_DETAIL
    });
    const request = api.getAdminShipmentDetail(id);

    return request.then(
        response => dispatch(getAdminShipmentDetailSuccess(response.data)),        
        err => dispatch(getAdminShipmentDetailFail(err)),
    );
    
};

export const getAdminShipmentDetailSuccess = ({
    data
}) => dispatch => {
    return dispatch({
        type: GET_ADMIN_SHIPMENT_DETAIL_SUCCESS,
        payload: data
    })
}

export const getAdminShipmentDetailFail = (data) => dispatch => {
    return dispatch({
        type: GET_ADMIN_SHIPMENT_DETAIL_FAIL,
        payload: data
    })
}

export const getAdminMemberDetail = (id) => dispatch => {
    dispatch({
        type: GET_ADMIN_MEMBER_DETAIL
    });
    const request = api.getAdminMemberDetail(id);

    return request.then(
        response => dispatch(getAdminMemberDetailSuccess(response.data)),        
        err => dispatch(getAdminMemberDetailFail(err)),
    );
    
};

export const getAdminMemberDetailSuccess = ({
    data
}) => dispatch => {
    return dispatch({
        type: GET_ADMIN_MEMBER_DETAIL_SUCCESS,
        payload: data
    })
}

export const getAdminMemberDetailFail = (data) => dispatch => {
    return dispatch({
        type: GET_ADMIN_MEMBER_DETAIL_FAIL,
        payload: data
    })
}

export const getAdminInvoiceDetail = (id) => dispatch => {
    dispatch({
        type: GET_ADMIN_INVOICE_DETAIL
    });
    const request = api.getAdminInvoiceDetail(id);

    return request.then(
        response => dispatch(getAdminInvoiceDetailSuccess(response.data)),        
        err => dispatch(getAdminInvoiceDetailFail(err)),
    );
    
};

export const getAdminInvoiceDetailSuccess = ({
    data
}) => dispatch => {
    return dispatch({
        type: GET_ADMIN_INVOICE_DETAIL_SUCCESS,
        payload: data
    })
}

export const getAdminInvoiceDetailFail = (data) => dispatch => {
    return dispatch({
        type: GET_ADMIN_INVOICE_DETAIL_FAIL,
        payload: data
    })
}

export const patchMemberAdmin = (data,id) => dispatch => {
    dispatch({
        type: PATCH_MEMBER_ADMIN
    });
    const request = api.patchMemberAdmin(data,id);

    return request.then(
        response => dispatch(patchMemberAdminSuccess(response.data)),        
        err => dispatch(patchMemberAdminFail(err)),
    );
    
};

export const patchMemberAdminSuccess = ({
    data
}) => dispatch => {
    return dispatch({
        type: PATCH_MEMBER_ADMIN_SUCCESS,
        payload: data
    })
}

export const patchMemberAdminFail = (data) => dispatch => {
    return dispatch({
        type: PATCH_MEMBER_ADMIN_FAIL,
        payload: data
    })
}

export const addMemberAdmin = (data) => dispatch => {
    dispatch({
        type: ADD_MEMBER_ADMIN
    });
    const request = api.addMemberAdmin(data);

    return request.then(
        response => dispatch(addMemberAdminSuccess(response.data)),        
        err => dispatch(addMemberAdminFail(err)),
    );
    
};

export const addMemberAdminSuccess = ({
    data
}) => dispatch => {
    return dispatch({
        type: ADD_MEMBER_ADMIN_SUCCESS,
        payload: data
    })
}

export const addMemberAdminFail = (data) => dispatch => {
    return dispatch({
        type: ADD_MEMBER_ADMIN_FAIL,
        payload: data
    })
}

export const deleteAdminMember = (data) => dispatch => {
    dispatch({
        type: DELETE_MEMBER_ADMIN
    });
    const request = api.deleteAdminMember(data);

    return request.then(
        response => dispatch(deleteAdminMemberSuccess(response.data)),        
        err => dispatch(deleteAdminMemberFail(err)),
    );
    
};

export const deleteAdminMemberSuccess = ({
    data
}) => dispatch => {
    return dispatch({
        type: DELETE_MEMBER_ADMIN_SUCCESS,
        payload: data
    })
}

export const deleteAdminMemberFail = (data) => dispatch => {
    return dispatch({
        type: DELETE_MEMBER_ADMIN_FAIL,
        payload: data
    })
}

export const deleteShipment = (data) => dispatch => {
    dispatch({
        type: DELETE_SHIPMENT_ADMIN
    });
    const request = api.deleteShipment(data);

    return request.then(
        response => dispatch(deleteShipmentSuccess(response.data)),        
        err => dispatch(deleteShipmentFail(err)),
    );
    
};

export const deleteShipmentSuccess = ({
    data
}) => dispatch => {
    return dispatch({
        type: DELETE_SHIPMENT_ADMIN_SUCCESS,
        payload: data
    })
}

export const deleteShipmentFail = (data) => dispatch => {
    return dispatch({
        type: DELETE_SHIPMENT_ADMIN_FAIL,
        payload: data
    })
}

export const deleteInvoice = (data) => dispatch => {
    dispatch({
        type: DELETE_INVOICE_ADMIN
    });
    const request = api.deleteInvoice(data);

    return request.then(
        response => dispatch(deleteInvoiceSuccess(response.data)),        
        err => dispatch(deleteInvoiceFail(err)),
    );
    
};

export const deleteInvoiceSuccess = ({
    data
}) => dispatch => {
    return dispatch({
        type: DELETE_INVOICE_ADMIN_SUCCESS,
        payload: data
    })
}

export const deleteInvoiceFail = (data) => dispatch => {
    return dispatch({
        type: DELETE_INVOICE_ADMIN_FAIL,
        payload: data
    })
}

export const getFaq = () => dispatch => {
    dispatch({
        type: GET_FAQ_ADMIN
    });
    const request = api.getFaq();

    return request.then(
        response => dispatch(getFaqSuccess(response.data)),        
        err => dispatch(getFaqFail(err)),
    );
    
};

export const getFaqSuccess = ({
    data
}) => dispatch => {
    return dispatch({
        type: GET_FAQ_ADMIN_SUCCESS,
        payload: data
    })
}

export const getFaqFail = (data) => dispatch => {
    return dispatch({
        type: GET_FAQ_ADMIN_FAIL,
        payload: data
    })
}

export const getTerms = () => dispatch => {
    dispatch({
        type: GET_TERMS_ADMIN
    });
    const request = api.getTerms();

    return request.then(
        response => dispatch(getTermsSuccess(response.data)),        
        err => dispatch(getTermsFail(err)),
    );
    
};

export const getTermsSuccess = ({
    data
}) => dispatch => {
    return dispatch({
        type: GET_TERMS_ADMIN_SUCCESS,
        payload: data
    })
}

export const getTermsFail = (data) => dispatch => {
    return dispatch({
        type: GET_TERMS_ADMIN_FAIL,
        payload: data
    })
}

export const addFaq = (data) => dispatch => {
    dispatch({
        type: ADD_FAQ_ADMIN
    });
    const request = api.addFaq(data);

    return request.then(
        response => dispatch(addFaqSuccess(response.data)),        
        err => dispatch(addFaqFail(err)),
    );
    
};

export const addFaqSuccess = ({
    data
}) => dispatch => {
    return dispatch({
        type: ADD_FAQ_ADMIN_SUCCESS,
        payload: data
    })
}

export const addFaqFail = (data) => dispatch => {
    return dispatch({
        type: ADD_FAQ_ADMIN_FAIL,
        payload: data
    })
}

export const addTerms = (data) => dispatch => {
    dispatch({
        type: ADD_TERMS_ADMIN
    });
    const request = api.addTerms(data);

    return request.then(
        response => dispatch(addTermsSuccess(response.data)),        
        err => dispatch(addTermsFail(err)),
    );
    
};

export const addTermsSuccess = ({
    data
}) => dispatch => {
    return dispatch({
        type: ADD_TERMS_ADMIN_SUCCESS,
        payload: data
    })
}

export const addTermsFail = (data) => dispatch => {
    return dispatch({
        type: ADD_TERMS_ADMIN_FAIL,
        payload: data
    })
}

export const updateFaq = (data,id) => dispatch => {
    dispatch({
        type: PATCH_FAQ_ADMIN
    });
    const request = api.updateFaq(data,id);

    return request.then(
        response => dispatch(updateFaqSuccess(response.data)),        
        err => dispatch(updateFaqFail(err)),
    );
    
};

export const updateFaqSuccess = ({
    data
}) => dispatch => {
    return dispatch({
        type: PATCH_FAQ_ADMIN_SUCCESS,
        payload: data
    })
}

export const updateFaqFail = (data) => dispatch => {
    return dispatch({
        type: PATCH_FAQ_ADMIN_FAIL,
        payload: data
    })
}

export const updateTerms = (data,id) => dispatch => {
    dispatch({
        type: PATCH_TERMS_ADMIN
    });
    const request = api.updateTerms(data,id);

    return request.then(
        response => dispatch(updateTermsSuccess(response.data)),        
        err => dispatch(updateTermsFail(err)),
    );
    
};

export const updateTermsSuccess = ({
    data
}) => dispatch => {
    return dispatch({
        type: PATCH_TERMS_ADMIN_SUCCESS,
        payload: data
    })
}

export const updateTermsFail = (data) => dispatch => {
    return dispatch({
        type: PATCH_TERMS_ADMIN_FAIL,
        payload: data
    })
}

export const indexOriginPhoto = (customerId) => async dispatch => {
    dispatch(setOpenLoadingPopup(true, 'Proses indeks sedang berlangsung'))
    await dispatch({
        type: INDEX_ORIGIN_PHOTO
    });
    console.log('api')
    const response = api.indexOriginPhoto(customerId);

    return response.then(
        response => {
            dispatch(setOpenLoadingPopup(false, ''))
            dispatch(setOpenAlertPopup(true, 'Indeks foto pilihan berhasil', 'success'))
            dispatch({type: INDEX_ORIGIN_PHOTO_SUCCESS, payload: response})
        },
        err => {
            dispatch(setOpenLoadingPopup(false, ''))
            dispatch(setOpenAlertPopup(true, 'Indeks foto pilihan gagal', 'error'))
            dispatch({type: INDEX_ORIGIN_PHOTO_FAIL, payload: err})
        }
    )
}

export const indexChoicePhoto = (customerId) => async dispatch => {
    dispatch(setOpenLoadingPopup(true, 'Sedang mengindeks foto pilihan'));
    await dispatch({
        type: INDEX_CHOICE_PHOTO
    });
    const response = api.indexChoicePhoto(customerId);

    return response.then(
        response => {
            dispatch(setOpenLoadingPopup(false, ''));
            dispatch(setOpenAlertPopup(true, 'Indeks foto pilihan berhasil', 'success'))
            dispatch({type: INDEX_CHOICE_PHOTO_SUCCESS, payload: response})
        },
        err => {
            dispatch(setOpenLoadingPopup(false, ''));
            dispatch(setOpenAlertPopup(true, 'Indeks foto pilihan gagal', 'error'))
            dispatch({type: INDEX_CHOICE_PHOTO_FAIL, payload: err})
        }
    )
}