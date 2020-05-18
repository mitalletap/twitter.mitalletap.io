import React from 'react';
import { shallow, mount } from 'enzyme';
import { App } from '../../App';

describe('should test app page', () => {

  it('should match snapshot', () => {
    let app = shallow(<App />);
    expect(app).toMatchSnapshot();
  });

});