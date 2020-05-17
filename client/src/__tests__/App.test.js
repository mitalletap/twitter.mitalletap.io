import React, { Component } from 'react';
import { shallow, mount } from 'enzyme';
import fetchMock from 'fetch-mock';
import App from '../App';
import { Input, Button } from 'antd';
import { Auth } from '../__mocks__/auth';

const { TextArea } = Input;

describe('should test app page', () => {
  
  let app, instance;

  beforeEach(() => {
    app = shallow(<App />);
    instance = app.instance();
  });

  afterEach(() => {
    fetchMock.restore();
  });

  describe('should test api calls', () => {
    
    it('should handle `componentDidMount` api call', async () => {
      await Auth.currentAuthenticatedUser();
      expect(Auth.currentAuthenticatedUser());
      console.log(instance.state);
    });
    
  });

  describe('should test state changes', () => {

    // it('should handle a state change', () => {
    //   app.find(TextArea).find('.post-button').simulate('change', { target: { value: "changed" } } );
    //   expect(app.state('message')).toEqual('changed');
    // });

  });

});