import React, { Component } from 'react';
import { shallow, mount } from 'enzyme';
import fetchMock from 'fetch-mock';
import { Input, Button } from 'antd';
import Post from '../../components/Post';

const { TextArea } = Input;

describe('should test home page', () => {

    let app, instance;

    beforeEach(() => {
        app = shallow(<Post />);
        instance = app.instance();
    });

    describe('should test api calls', () => {

        describe('tests the `handleSubmit` function', () => {

            it('should test reolve when saving to the database', async () => {
                instance.setState({ username: 'mitalletap', message: "test message" });
                const fetchPromise = Promise.resolve({
                    json: () => Promise.resolve(true)
                })
                global.fetch = () => fetchPromise;
                await instance.handleSubmit();
            });
    
            it('should test reject when saving to the database', async () => {
                instance.setState({ username: 'mitalletap', message: "test message" });
                const fetchPromise = Promise.reject({
                    json: () => Promise.reject(true)
                })
                global.fetch = () => fetchPromise;
                await instance.handleSubmit();
            });

        });

    });

    describe('should test state changes', () => {
        
        it('should handle `handleChange` text field changes', () => {
            app.find(TextArea).find('#text-area').simulate('change', { target: { value: "program name" } })
            expect(app.state('message')).toEqual("program name");
        });
        
        it('should handle `handleSubmit` button click', () => {
            app.find(Button).find('#submit-button').simulate('click');
        });

    });

});