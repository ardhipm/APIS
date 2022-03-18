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
    PATCH_INVOICE_ADMIN,
    PATCH_INVOICE_ADMIN_SUCCESS,
    PATCH_INVOICE_ADMIN_FAIL,
    GET_ADMIN_SHIPMENT_DETAIL,
    GET_ADMIN_SHIPMENT_DETAIL_SUCCESS,
    GET_ADMIN_SHIPMENT_DETAIL_FAIL,
    GET_ADMIN_INVOICE_DETAIL,
    GET_ADMIN_INVOICE_DETAIL_SUCCESS,
    GET_ADMIN_INVOICE_DETAIL_FAIL,
    GET_ADMIN_MEMBER_DETAIL,
    GET_ADMIN_MEMBER_DETAIL_FAIL,
    GET_ADMIN_MEMBER_DETAIL_SUCCESS,
    PATCH_MEMBER_ADMIN,
    PATCH_MEMBER_ADMIN_SUCCESS,
    PATCH_MEMBER_ADMIN_FAIL,
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

const initialState ={
    customers:{
        loading: false,
		error: false,
		data: [],
    },
    logistics:{
        loading: false,
		error: false,
		data: [],
    },
    invoices:{
        loading: false,
		error: false,
		data: [],
    },
    admins:{
        loading: false,
		error: false,
		data: [],
    },
    faq:{
        loading: false,
		error: false,
		data: [],
    },
    terms:{
        loading: false,
		error: false,
		data: [],
    },
    detailAdmin:{
        loading: false,
		error: false,
		data: {},
    },
    detailInvoice:{
        loading: false,
		error: false,
		data: {},
    },
    detailShipment:{
        loading: false,
		error: false,
		data: {},
    },
    patch:{
        loading: false,
		error: false,
		data: [],
    },
    post: {
		loading: false,
		error: false,
		data: [],
	},
    index: {
        loading: false,
    }

}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_CUSTOMER_VIEW:
            return {...state, customers:{...state.customers, loading: true, error: false}};
		case GET_CUSTOMER_VIEW_SUCCESS:
			return {...state, customers:{...state.customers, data: action.payload, loading: false, error: false}};
		case GET_CUSTOMER_VIEW_FAIL:
            return {...state, customers:{...state.customers, loading: false, error: action.payload}};
        case GET_SHIPMENT_VIEW:
            return {...state, logistics:{...state.logistics, loading: true, error: false}};
        case GET_SHIPMENT_VIEW_SUCCESS:
            return {...state, logistics:{...state.logistics, data: action.payload, loading: false, error: false}};
        case GET_SHIPMENT_VIEW_FAIL:
            return {...state, logistics:{...state.logistics, loading: false, error: action.payload}};
        case GET_INVOICE_VIEW:
            return {...state, invoices:{...state.invoices, loading: true, error: false}};
        case GET_INVOICE_VIEW_SUCCESS:
            return {...state, invoices:{...state.invoices, data: action.payload, loading: false, error: false}};
        case GET_INVOICE_VIEW_FAIL:
            return {...state, invoices:{...state.invoices, loading: false, error: action.payload}};
        case GET_ADMIN_MEMBER_VIEW:
            return {...state, admins:{...state.admins, loading: true, error: false}};
        case GET_ADMIN_MEMBER_VIEW_SUCCESS:
            return {...state, admins:{...state.admins, data: action.payload, loading: false, error: false}};
        case GET_ADMIN_MEMBER_VIEW_FAIL:
            return {...state, admins:{...state.admins, loading: false, error: action.payload}};
        case GET_ADMIN_SHIPMENT_DETAIL:
            return {...state, detailShipment:{...state.detailShipment, loading: true, error: false}};
        case GET_ADMIN_SHIPMENT_DETAIL_SUCCESS:
            return {...state, detailShipment:{...state.detailShipment, data: action.payload, loading: false, error: false}};
        case GET_ADMIN_SHIPMENT_DETAIL_FAIL:
            return {...state, detailShipment:{...state.detailShipment, loading: false, error: action.payload}};
        case PATCH_SHIPMENTS_ADMIN:			
			return {...state, patch: {...state.patch, loading: true, error: false}};
		case PATCH_SHIPMENTS_ADMIN_SUCCESS:
			return {...state, patch:{...state.patch, data: action.payload, loading: false, error: false}};
		case PATCH_SHIPMENTS_ADMIN_FAIL:
			return {...state, patch:{...state.patch, loading: false, error: action.payload}};
        case GET_ADMIN_INVOICE_DETAIL:
            return {...state, detailInvoice:{...state.detailInvoice, loading: true, error: false}};
        case GET_ADMIN_INVOICE_DETAIL_SUCCESS:
            return {...state, detailInvoice:{...state.detailInvoice, data: action.payload, loading: false, error: false}};
        case GET_ADMIN_INVOICE_DETAIL_FAIL:
            return {...state, detailInvoice:{...state.detailInvoice, loading: false, error: action.payload}};
        case GET_ADMIN_MEMBER_DETAIL:
            return {...state, detailAdmin:{...state.detailAdmin, loading: true, error: false}};
        case GET_ADMIN_MEMBER_DETAIL_SUCCESS:
            return {...state, detailAdmin:{...state.detailAdmin, data: action.payload, loading: false, error: false}};
        case GET_ADMIN_MEMBER_DETAIL_FAIL:
            return {...state, detailAdmin:{...state.detailAdmin, loading: false, error: action.payload}};
        case PATCH_MEMBER_ADMIN:			
			return {...state, patch: {...state.patch, loading: true, error: false}};
		case PATCH_MEMBER_ADMIN_SUCCESS:
			return {...state, patch:{...state.patch, data: action.payload, loading: false, error: false}};
		case PATCH_MEMBER_ADMIN_FAIL:
			return {...state, patch:{...state.patch, loading: false, error: action.payload}};
        case PATCH_INVOICE_ADMIN:			
			return {...state, patch: {...state.patch, loading: true, error: false}};
		case PATCH_INVOICE_ADMIN_SUCCESS:
			return {...state, patch:{...state.patch, data: action.payload, loading: false, error: false}};
		case PATCH_INVOICE_ADMIN_FAIL:
			return {...state, patch:{...state.patch, loading: false, error: action.payload}};
        case ADD_MEMBER_ADMIN:			
			return {...state, post: {...state.post, loading: true, error: false}};
		case ADD_MEMBER_ADMIN_SUCCESS:
			return {...state, post:{...state.post, data: action.payload, loading: false, error: false}};
		case ADD_MEMBER_ADMIN_FAIL:
			return {...state, post:{...state.post, loading: false, error: action.payload}};
        case DELETE_SHIPMENT_ADMIN:			
			return {...state, post: {...state.post, loading: true, error: false}};
		case DELETE_SHIPMENT_ADMIN_SUCCESS:
			return {...state, post:{...state.post, data: action.payload, loading: false, error: false}};
		case DELETE_SHIPMENT_ADMIN_FAIL:
			return {...state, post:{...state.post, loading: false, error: action.payload}};
        case DELETE_INVOICE_ADMIN:			
			return {...state, post: {...state.post, loading: true, error: false}};
		case DELETE_INVOICE_ADMIN_SUCCESS:
			return {...state, post:{...state.post, data: action.payload, loading: false, error: false}};
		case DELETE_INVOICE_ADMIN_FAIL:
			return {...state, post:{...state.post, loading: false, error: action.payload}};
        case DELETE_MEMBER_ADMIN:			
			return {...state, post: {...state.post, loading: true, error: false}};
		case DELETE_MEMBER_ADMIN_SUCCESS:
			return {...state, post:{...state.post, data: action.payload, loading: false, error: false}};
		case DELETE_MEMBER_ADMIN_FAIL:
			return {...state, post:{...state.post, loading: false, error: action.payload}};
        case GET_TERMS_ADMIN:
            return {...state, terms:{...state.terms, loading: true, error: false}};
        case GET_TERMS_ADMIN_SUCCESS:
            return {...state, terms:{...state.terms, data: action.payload, loading: false, error: false}};
        case GET_TERMS_ADMIN_FAIL:
            return {...state, terms:{...state.terms, loading: false, error: action.payload}};
        case GET_FAQ_ADMIN:
            return {...state, faq:{...state.faq, loading: true, error: false}};
        case GET_FAQ_ADMIN_SUCCESS:
            return {...state, faq:{...state.faq, data: action.payload, loading: false, error: false}};
        case GET_FAQ_ADMIN_FAIL:
            return {...state, faq:{...state.faq, loading: false, error: action.payload}};
        case ADD_FAQ_ADMIN:
            return {...state, post:{...state.post, loading: true, error: false}};
        case ADD_FAQ_ADMIN_SUCCESS:
            return {...state, post:{...state.post, data: action.payload, loading: false, error: false}};
        case ADD_FAQ_ADMIN_FAIL:
            return {...state, post:{...state.post, loading: false, error: action.payload}};
        case ADD_TERMS_ADMIN:
            return {...state, post:{...state.post, loading: true, error: false}};
        case ADD_TERMS_ADMIN_SUCCESS:
            return {...state, post:{...state.post, data: action.payload, loading: false, error: false}};
        case ADD_TERMS_ADMIN_FAIL:
            return {...state, post:{...state.post, loading: false, error: action.payload}};
        case PATCH_TERMS_ADMIN:
            return {...state, patch:{...state.patch, loading: true, error: false}};
        case PATCH_TERMS_ADMIN_SUCCESS:
            return {...state, patch:{...state.patch, data: action.payload, loading: false, error: false}};
        case PATCH_TERMS_ADMIN_FAIL:
            return {...state, patch:{...state.patch, loading: false, error: action.payload}};
        case PATCH_FAQ_ADMIN:
            return {...state, patch:{...state.patch, loading: true, error: false}};
        case PATCH_FAQ_ADMIN_SUCCESS:
            return {...state, patch:{...state.patch, data: action.payload, loading: false, error: false}};
        case PATCH_FAQ_ADMIN_FAIL:
            return {...state, patch:{...state.patch, loading: false, error: action.payload}};
        case INDEX_ORIGIN_PHOTO: 
            return {
                ...state,
                index: {
                    ...state.index,
                    loading:true
                }
            };
        case INDEX_ORIGIN_PHOTO_SUCCESS: 
            return {
                ...state,
                index: {
                    ...state.index,
                    loading:false
                }
            };
        case INDEX_ORIGIN_PHOTO_FAIL: 
            return {
                ...state,
                index: {
                    ...state.index,
                    loading:false
                }
            };
        case INDEX_CHOICE_PHOTO: 
            return {
                ...state,
                index: {
                    ...state.index,
                    loading:true
                }
            };
        case INDEX_CHOICE_PHOTO_SUCCESS: 
            return {
                ...state,
                index: {
                    ...state.index,
                    loading:false
                }
            };
        case INDEX_CHOICE_PHOTO_FAIL: 
            return {
                ...state,
                index: {
                    ...state.index,
                    loading:false
                }
            };
            
        default:
            return state;
    }
}
export default reducer;