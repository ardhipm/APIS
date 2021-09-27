const user = {
    id:"",
    username: "",
    email: "",
    is_active: "",
    role_id: ""
};

const userReducer = (state = user, action) => {
    switch (action.type) {
        case 'LOGIN':
            return action.user;
        case 'LOGOUT':
            return user;
        default:
            return state;
    }
}

export default userReducer;