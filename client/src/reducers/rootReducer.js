const initState = {
    username: '',
    name: '',
    email: '',
    phone_number: '',
    birthdate: ''
}

const rootReducer = (state = initState, action) => {
    if(action.type === "SET_USER") {
        return {
            ...state,
            username: action.username,
            name: action.name,
            email: action.email,
            phone_number: action.phone_number,
            birthdate: action.birthdate,
        }
    } else {
        return {
            ...state 
        }
    }
}

export default rootReducer;