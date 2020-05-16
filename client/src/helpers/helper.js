import React, { Component } from 'react';

const HelperFunctions = {

    getEnvironmentStatus: function() {
        const eVar = process.env.NODE_ENV === 'production' ? `${process.env.REACT_APP_IP}:8080` : 'localhost:8080';
        return eVar;
    }

}

export default HelperFunctions;