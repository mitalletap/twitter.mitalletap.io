import { Auth } from "aws-amplify"

export function loadUserCredentials(){
    return(dispatch) => {
        return Auth.currentAuthenticatedUser()
        .then((response) => {
            dispatch(setUserData(response.attributes));
        })
    }
}

export function setUserData(data) {
    return {
        type: "SET_USER",
        username: data.preferred_username,
        name: data.name,
        email: data.email,
        phone_number: data.phone_number,
        birthdate: data.birthdate
    }
}