import {
    GET_ORIGIN_PHOTO,
    GET_ORIGIN_PHOTO_SUCCESS,
    GET_ORIGIN_PHOTO_FAIL,
    GET_ORIGIN_PHOTO_WITH_PAGINATION,
    GET_ORIGIN_PHOTO_WITH_PAGINATION_SUCCESS,
    GET_ORIGIN_PHOTO_WITH_PAGINATION_FAIL,
    GET_ORIGIN_PHOTO_METADATA,
    GET_ORIGIN_PHOTO_METADATA_SUCCESS,
    GET_ORIGIN_PHOTO_METADATA_FAIL,
    UPDATE_SUBPACKAGE_IDX,
    GET_SUBPACKAGE,
    GET_SUBPACKAGE_SUCCESS,
    GET_SUBPACKAGE_FAIL,
    RESET_ORIGIN_PHOTO,
    ORIGIN_SELECTED_PHOTO,
    ORIGIN_SELECTED_PHOTO_SUCCESS,
    ORIGIN_SELECTED_PHOTO_FAIL,
    ORIGIN_DELETE_PHOTO,
    ORIGIN_DELETE_PHOTO_SUCCESS,
    ORIGIN_DELETE_PHOTO_FAIL,
    UPDATE_PAGE_NUMBER,
    GET_COUNT_SELECTED_PHOTO,
    GET_COUNT_SELECTED_PHOTO_SUCCESS,
    GET_COUNT_SELECTED_PHOTO_FAIL,
    UPDATE_SELECTED_ORIGIN_PHOTO,
    UPDATE_CURRENT_PREVIEW_PHOTO,
    OPEN_ORIGIN_PHOTO_PREVIEW,
    OPEN_ALERT_ORIGIN_PHOTO,
    CHECKOUT_SELECTED_PHOTO,
    CHECKOUT_SELECTED_PHOTO_SUCCESS,
    CHECKOUT_SELECTED_PHOTO_FAIL,
    GET_DOWNLOAD_LINK,
    GET_DOWNLOAD_LINK_SUCESS,
    GET_DOWNLOAD_LINK_FAIL,
    SET_OPEN_DOWNLOAD_POPUP,
    SET_YESNO_DIALOG
} from '../../../actionTypes'

const initialState = {
    loading: false,
    totalPhoto: 0,
    subPackageNumEditPhoto: 0,
    subPackageNumSelectedEditPhoto: 0,
    packageDescription: '',
    packageTitle: '',
    isError: false,
    subPackage: {},
    selectedSubPackageIdx: -1,
    currentOriginPhoto: [],
    hasMore: false,
    loadingProcess: false,
    showPopup: true,
    processSuccess: false,
    popupMessage: '',
    pageNumber: 1,
    showPreview: false,
    currentPhotoPreview: '',
    restrictDelete: 0,
    //alert
    showAlert: false,
    alertMessage: '',
    alertType: 'SUCCESS',
    //loading checkout
    loadingCheckout: false,
    // download link
    parentFolderName: '',
    parentFolderLink: '',
    downloadChild: [],
    // download popup
    openDownloadPopup: false,
    // confirm dialog
    openConfirmDialog: false,
    confirmDialogMessage: '',
    confirmDialogType: null,
    deletePhotoSuccess: true

}

const originPhotoReducer = (state = initialState, action) => {
    // console.log('===============');
    // console.log(action.type);
    // console.log(action);
    switch (action.type) {
        case GET_ORIGIN_PHOTO:
            return {
                ...state,
                loading: true
            };
        case GET_ORIGIN_PHOTO_SUCCESS:
            // console.log('asd');
            // console.log(action.payload.data);
            return {
                ...state,
                loading: false,
                currentOriginPhoto: [...state.currentOriginPhoto, ...action.payload.data],
                hasMore: action.payload.data.length > 0
                // description: 'Hello dude',
            };
        case GET_ORIGIN_PHOTO_FAIL:
            return {
                ...state,
                loading: false,
                originPhoto: action.payload
            };
        case GET_ORIGIN_PHOTO_WITH_PAGINATION:
            return {
                ...state,
                loading: true
            };
        case GET_ORIGIN_PHOTO_WITH_PAGINATION_SUCCESS:
            // console.log('oiasdjlkdsfjlcznmcvn')
            // // console.log(action.payload);
            return {
                ...state,
                loading: false,
                currentOriginPhoto: [...state.currentOriginPhoto, ...action.payload.data.data],
                totalPhoto: action.payload.data.length,
                hasMore: action.payload.data.next_page_url != null
            };
        case GET_ORIGIN_PHOTO_WITH_PAGINATION_FAIL:
            return {
                ...state,
                loading: false,
                currentOriginPhoto: [],
                totalPhoto: action.payload.data.length
            };
        case GET_ORIGIN_PHOTO_METADATA:
            return {
                ...state,
                loading: true,

            };
        case GET_ORIGIN_PHOTO_METADATA_SUCCESS:
            // console.log(action.payload);
            return {
                ...state,
                loading: false,
                subPackage: action.payload.data.subpackage,
                packageTitle: action.payload.data.package_name,
                packageDescription: action.payload.data.package_description,
                selectedSubPackageIdx: action.payload.data.subpackage[0].id,
                subPackageNumEditPhoto: action.payload.data.subpackage[0].num_limit_edit_photo,
                restrictDelete: action.payload.data.restrict_delete
                // subPackageNumSelectedEditPhoto: action.payload.data.subpackage[0].num_selected_edit_photo

            };
        case GET_ORIGIN_PHOTO_METADATA_FAIL:
            return {
                ...state,
                loading: false,
            };
        case UPDATE_SUBPACKAGE_IDX:
            return {
                ...state,
                selectedSubPackageIdx: action.payload
            };
        case GET_SUBPACKAGE:
            return {
                ...state
            };
        case GET_SUBPACKAGE_SUCCESS:
            return {
                ...state,
                subPackageNumEditPhoto: action.payload.data.num_limit_edit_photo,
                // subPackageNumSelectedEditPhoto: action.payload.data.num_selected_edit_photo
            };
        case GET_SUBPACKAGE_FAIL:
            return {
                ...state,

            }
        case RESET_ORIGIN_PHOTO:
            return {
                ...state,
                currentOriginPhoto: [],
            }

        case ORIGIN_SELECTED_PHOTO:
            return {
                ...state,
                loadingProcess: true,
                popupMessage: ''
            }
        case ORIGIN_SELECTED_PHOTO_SUCCESS:
            
            let idxSelect = state.currentOriginPhoto.findIndex(element => { return element.basename == action.payload.data})
            let copyCurrentOriginPhotoSelect = [...state.currentOriginPhoto];
            copyCurrentOriginPhotoSelect[idxSelect].is_selected = 1;


            return {
                ...state,
                loadingProcess: false,
                showPopup: true,
                processSuccess: true,
                popupMessage: 'foto berhasil di pilih',
                subPackageNumSelectedEditPhoto: state.subPackageNumSelectedEditPhoto + 1, 
                currentOriginPhoto: copyCurrentOriginPhotoSelect

            }
        case ORIGIN_SELECTED_PHOTO_FAIL:
            return {
                ...state,
                loadingProcess: false,
                showPopup: true,
                processSuccess: false,
                popupMessage: 'proses pemilihan gagal'
            }
        case ORIGIN_DELETE_PHOTO:
            return {
                ...state,
                loadingCheckout: true,
            }
        case ORIGIN_DELETE_PHOTO_SUCCESS:

            let idxDelete = state.currentOriginPhoto.findIndex(element => { return element.basename == action.payload.data})
            let copyCurrentOriginPhotoDelete = [...state.currentOriginPhoto];
            copyCurrentOriginPhotoDelete[idxDelete].is_selected = 0;
            
            return {
                ...state,
                loadingCheckout: false,
                showAlert: true,
                alertMessage: action.payload.message,
                alertType: action.payload.success ? 'success' : 'error',
                subPackageNumSelectedEditPhoto: state.subPackageNumSelectedEditPhoto  - 1,
                currentOriginPhoto: copyCurrentOriginPhotoDelete

            }
        case ORIGIN_DELETE_PHOTO_FAIL:
            return {
                ...state,
                loadingCheckout: false,
                showAlert: false,
                alertMessage: 'Hapus foto gagal',
                alertType: 'error',
            }
        case UPDATE_PAGE_NUMBER:
            return {
                ...state,
                pageNumber: action.payload
            }
        case GET_COUNT_SELECTED_PHOTO:
            return {
                ...state,
            }
        case GET_COUNT_SELECTED_PHOTO_SUCCESS:
            // console.log('---->',action.payload.data)
            return {
                ...state,
                subPackageNumSelectedEditPhoto: action.payload.data

            }
        case GET_COUNT_SELECTED_PHOTO_FAIL:
            return {
                ...state,
            }
        case UPDATE_SELECTED_ORIGIN_PHOTO:
            return {
                ...state,
                subPackageNumSelectedEditPhoto: action.payload
            }

        case UPDATE_CURRENT_PREVIEW_PHOTO:
            return {
                ...state,
                currentPhotoPreview: action.payload
            }
        case OPEN_ORIGIN_PHOTO_PREVIEW:
            return {
                ...state,
                showPreview: action.payload
            }
        case OPEN_ALERT_ORIGIN_PHOTO:
            // console.log(action.payload);
            return {
                ...state,
                showAlert: action.payload.isOpen,
                alertMessage: action.payload.message,
                alertType: action.payload.type
            }
        case CHECKOUT_SELECTED_PHOTO:
            return {
                ...state,
                loadingCheckout: true
            }
        case CHECKOUT_SELECTED_PHOTO_SUCCESS:
            return {
                ...state,
                loadingCheckout: false
            }
        case CHECKOUT_SELECTED_PHOTO_FAIL:
            return {
                ...state,
                loadingCheckout: false
            }
        case GET_DOWNLOAD_LINK:
            return {
                ...state
            }
        case GET_DOWNLOAD_LINK_SUCESS:
            return {
                ...state,
                parentFolderName: action.payload.data.parent_folder_name,
                parentFolderLink: action.payload.data.parent_link,
                downloadChild: [...action.payload.data.child]
            }
        case GET_DOWNLOAD_LINK_FAIL:
            return {
                ...state,

            }
        case SET_OPEN_DOWNLOAD_POPUP:
            // console.log(action.payload);
            return {
                ...state,
                openDownloadPopup: action.payload
            }
        case SET_YESNO_DIALOG:
            return {
                ...state,
                openConfirmDialog: action.payload.open,
                confirmDialogMessage: action.payload.message,
                confirmDialogType: action.payload.type
            }
        default:
            return state;
    }
}
export default originPhotoReducer;