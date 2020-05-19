import { Auth } from 'aws-amplify';

const HelperFunctions = {

    getEnvironmentStatus: function() {
        const eVar = process.env.NODE_ENV === 'production' ? `${process.env.REACT_APP_IP}:8080` : 'localhost:8080';
        return eVar;
    },

    getCurrentUser: async function() {
        return Auth.currentAuthenticatedUser()
    }

}

export default HelperFunctions;