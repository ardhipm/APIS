export const userLogIn = (user) => {
    return {
        type: 'LOGIN',
        user: user
    }
}

export const userLogOut = () => {
    return {
        type: 'LOGOUT',
        user: {}
    }
}