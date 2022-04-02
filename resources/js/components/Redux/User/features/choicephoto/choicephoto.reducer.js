import {
    UPDATE_SUBPACKAGE_IDX,
    GET_CHOICE_PHOTO_METADATA,
    GET_CHOICE_PHOTO_METADATA_SUCCESS,
    GET_CHOICE_PHOTO_METADATA_FAIL,
    GET_CHOICE_PHOTO_WITH_PAGINATION,
    GET_CHOICE_PHOTO_WITH_PAGINATION_SUCCESS,
    GET_CHOICE_PHOTO_WITH_PAGINATION_FAIL,
    RESET_CHOICE_PHOTO,
    UPDATE_PAGE_NUMBER,
    UPDATE_CURRENT_PREVIEW_PHOTO,
    OPEN_CHOICE_PHOTO_PREVIEW,
    SELECT_ALBUM_PHOTO,
    SELECT_ALBUM_PHOTO_SUCCESS,
    SELECT_ALBUM_PHOTO_FAIL,
    SELECT_PRINT_PHOTO,
    SELECT_PRINT_PHOTO_SUCCESS,
    SELECT_PRINT_PHOTO_FAIL,
    DELETE_ALBUM_PHOTO,
    DELETE_ALBUM_PHOTO_SUCCESS,
    DELETE_ALBUM_PHOTO_FAIL,
    DELETE_PRINT_PHOTO,
    DELETE_PRINT_PHOTO_SUCCESS,
    DELETE_PRINT_PHOTO_FAIL,
    UPDATE_TOTAL_SELECTED_ALBUM,
    UPDATE_TOTAL_SELECTED_ALBUM_SUCCESS,
    UPDATE_TOTAL_SELECTED_ALBUM_FAIL,
    UPDATE_TOTAL_SELECTED_PRINT,
    UPDATE_TOTAL_SELECTED_PRINT_SUCCESS,
    UPDATE_TOTAL_SELECTED_PRINT_FAIL,
    CHECKOUT_ALBUM_PRINT_PHOTO, 
    CHECKOUT_ALBUM_PRINT_PHOTO_SUCCESS,
    CHECKOUT_ALBUM_PRINT_PHOTO_FAIL
} from '../../../actionTypes';

const initialState = {
    loadingMetadata: false,

    packageTitle: '',
    packageDescription: '',
    pageNumber: 1,
    hasMore: false,
    restrictedAlbumPhoto: false,

    totalPhoto: 0,
    totalLimitAlbumPhoto: 0,
    totalLimitPrintPhoto: 0,
    totalSelectedAlbumPhoto: 0,
    totalSelectedPrintPhoto: 0,

    selectedSubPackageIdx: -1,
    subPackage: {},

    currentChoicePhoto: [],

    currentPhotoPreview: '',
    showPreview: false,

    alertMessage: '',
    alertType: 'success',



}


const choicePhotoReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_SUBPACKAGE_IDX:
            return {
                ...state,
                selectedSubPackageIdx: action.payload
            }
        case GET_CHOICE_PHOTO_METADATA:
            return {
                ...state,
                loadingMetadata: true
            };
        case GET_CHOICE_PHOTO_METADATA_SUCCESS:
            return {
                ...state,
                loadingMetadata: false,
                subPackage: action.payload.data.subpackage,
                selectedSubPackageIdx: action.payload.data.subpackage[0].id,
                packageTitle: action.payload.data.package_name,
                packageDescription: action.payload.data.package_description,
                totalLimitAlbumPhoto: action.payload.data.num_album_photo,
                totalLimitPrintPhoto: action.payload.data.num_print_photo,
                restrictedAlbumPhoto: action.payload.data.restrict_album_print

            };
        case GET_CHOICE_PHOTO_METADATA_FAIL:
            return {
                ...state,
                loadingMetadata: false
            }

        case GET_CHOICE_PHOTO_WITH_PAGINATION:
            return {
                ...state,
                loading: true
            };
        case GET_CHOICE_PHOTO_WITH_PAGINATION_SUCCESS:

            return {
                ...state,
                loading: false,
                currentChoicePhoto: [...state.currentChoicePhoto, ...action.payload.data.data],
                totalPhoto: action.payload.data.length,
                hasMore: action.payload.data.next_page_url != null
            };
        case GET_CHOICE_PHOTO_WITH_PAGINATION_FAIL:
            return {
                ...state,
                loading: false,
                currentChoicePhoto: [],
                totalPhoto: action.payload.data.length
            };
        case RESET_CHOICE_PHOTO:
            return {
                ...state,
                currentChoicePhoto: []
            };
        case UPDATE_PAGE_NUMBER:
            return {
                ...state,
                pageNumber: action.payload
            };
        case UPDATE_CURRENT_PREVIEW_PHOTO:
            return {
                ...state,
                currentPhotoPreview: action.payload
            }
        case OPEN_CHOICE_PHOTO_PREVIEW:
            return {
                ...state,
                showPreview: action.payload
            }
        case SELECT_ALBUM_PHOTO:
            return {
                ...state
            }
        case SELECT_ALBUM_PHOTO_SUCCESS:

            let idxAlbum = state.currentChoicePhoto.findIndex(element => { return element.basename == action.payload.data})
            let copyCurrentChoicePhotoAlbum = [...state.currentChoicePhoto];
            copyCurrentChoicePhotoAlbum[idxAlbum].is_album_selected = 1;

            return {
                ...state,
                totalSelectedAlbumPhoto: state.totalSelectedAlbumPhoto + 1,
                currentChoicePhoto: copyCurrentChoicePhotoAlbum
                
            }
        case SELECT_ALBUM_PHOTO_FAIL:
            return {
                ...state
            }
        case SELECT_PRINT_PHOTO:
            return {
                ...state
            }
        case SELECT_PRINT_PHOTO_SUCCESS:

            let idxPrint = state.currentChoicePhoto.findIndex(element => { return element.basename == action.payload.data})
            let copyCurrentChoicePhotoPrint = [...state.currentChoicePhoto];
            copyCurrentChoicePhotoPrint[idxPrint].is_print_selected = 1;

            return {
                ...state,
                totalSelectedPrintPhoto: state.totalSelectedPrintPhoto + 1,
                currentChoicePhoto: copyCurrentChoicePhotoPrint
            }
        case SELECT_PRINT_PHOTO_FAIL:
            return {
                ...state
            }
        case DELETE_ALBUM_PHOTO:
            return {
                ...state,
            };
        case DELETE_ALBUM_PHOTO_SUCCESS:

            let idxAlbumDelete = state.currentChoicePhoto.findIndex(element => { return element.basename == action.payload.data})
            let copyCurrentChoicePhotoAlbumDelete = [...state.currentChoicePhoto];
            copyCurrentChoicePhotoAlbumDelete[idxAlbumDelete].is_album_selected = 0;

            return {
                ...state,
                totalSelectedAlbumPhoto: state.totalSelectedAlbumPhoto - 1,
                currentChoicePhoto: copyCurrentChoicePhotoAlbumDelete
            };
        case DELETE_ALBUM_PHOTO_FAIL:
            return {
                ...state,
            };
        case DELETE_PRINT_PHOTO:
            return {
                ...state,
            };
        case DELETE_PRINT_PHOTO_SUCCESS:

            let idxPrintDelete = state.currentChoicePhoto.findIndex(element => { return element.basename == action.payload.data})
            let copyCurrentChoicePhotoPrintDelete = [...state.currentChoicePhoto];
            copyCurrentChoicePhotoPrintDelete[idxPrintDelete].is_print_selected = 0;

            return {
                ...state,
                totalSelectedPrintPhoto: state.totalSelectedPrintPhoto - 1,
                currentChoicePhoto: copyCurrentChoicePhotoPrintDelete
            };
        case DELETE_PRINT_PHOTO_FAIL:
            return {
                ...state,
            };
        case UPDATE_TOTAL_SELECTED_ALBUM:
            return {
                ...state,
            };
        case UPDATE_TOTAL_SELECTED_ALBUM_SUCCESS:
            return {
                ...state,
                totalSelectedAlbumPhoto: action.payload.data
            };
        case UPDATE_TOTAL_SELECTED_ALBUM_FAIL:
            return {
                ...state,
            };
        case UPDATE_TOTAL_SELECTED_PRINT:
            return {
                ...state
            };
        case UPDATE_TOTAL_SELECTED_PRINT_SUCCESS:
            return {
                ...state,
                totalSelectedPrintPhoto: action.payload.data
            };
        case UPDATE_TOTAL_SELECTED_PRINT_FAIL:
            return {
                ...state,
            };
        case CHECKOUT_ALBUM_PRINT_PHOTO:
            return {
                ...state
            };
        case CHECKOUT_ALBUM_PRINT_PHOTO_SUCCESS:
            return {
                ...state
            };
        case CHECKOUT_ALBUM_PRINT_PHOTO_FAIL:
            return {
                ...state
            };
        default:
            return state;
    }
}

export default choicePhotoReducer;