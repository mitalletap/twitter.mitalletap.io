import React, { Component } from 'react';
import { shallow, mount } from 'enzyme';
import fetchMock from 'fetch-mock';
import { Input, Button } from 'antd';
import { Home } from '../../components/Home';

const { TextArea } = Input;

describe('should test home page', () => {

    let app, instance;

    beforeEach(() => {
        app = shallow(<Home />);
        instance = app.instance();
    });

    describe('tests saving a user to the database', () => {

        it('should test reolve when saving to the database', async () => {
            instance.setState({ username: 'mitalletap', name: "Mital Patel" });
            const fetchPromise = Promise.resolve({
                json: () => Promise.resolve(true)
            })
            global.fetch = () => fetchPromise;
            await instance.saveUserToDB();
        });

        it('should test reject when saving to the database', async () => {
            instance.setState({ username: 'mitalletap', name: "Mital Patel" });
            const fetchPromise = Promise.reject({
                json: () => Promise.reject(true)
            })
            global.fetch = () => fetchPromise;
            await instance.saveUserToDB();
        });

    });

});