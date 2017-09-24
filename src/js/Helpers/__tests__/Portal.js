/* eslint-env jest */
/* eslint-disable max-len */
import React from 'react';
import { shallow, mount } from 'enzyme';

import Portal from '../Portal';

jest.useFakeTimers();

describe('Portal', () => {
  it('should always render null', () => {
    const child = <div id="test">hello</div>;
    const portal = shallow(<Portal visible={false}>{child}</Portal>);
    expect(portal.equals(null)).toBe(true);

    portal.setProps({ visible: true });
    expect(portal.equals(null)).toBe(true);
  });

  it('should call the onOpen prop when the visibility changes from false to true', () => {
    const onOpen = jest.fn();
    const portal = shallow(<Portal visible={false} onOpen={onOpen}><div /></Portal>);

    expect(onOpen.mock.calls.length).toBe(0);

    portal.setProps({ visible: true });
    expect(onOpen.mock.calls.length).toBe(1);
  });

  it('should call the onClose prop when the visibility changes from true to false', () => {
    const onClose = jest.fn();
    const portal = shallow(<Portal visible onClose={onClose}><div /></Portal>);

    expect(onClose.mock.calls.length).toBe(0);

    portal.setProps({ visible: false });
    expect(onClose.mock.calls.length).toBe(1);
  });

  it('should create a span element as the first child in the body when using the default props', () => {
    const portal = shallow(<Portal visible={false}><div /></Portal>);
    expect(portal.instance()._container).toBe(null);

    portal.setProps({ visible: true });
    expect(portal.instance()._container).not.toBe(null);
    expect(portal.instance()._container.tagName).toBe('SPAN');
    expect(document.body.firstChild).toEqual(portal.instance()._container);
  });

  it('should create a span element as the last child in the body when using default props but specifying lastChild', () => {
    const portal = shallow(<Portal visible={false} lastChild><div /></Portal>);
    expect(portal.instance()._container).toBe(null);

    portal.setProps({ visible: true });
    expect(portal.instance()._container).not.toBe(null);
    expect(portal.instance()._container.tagName).toBe('SPAN');
    expect(document.body.lastChild).toEqual(portal.instance()._container);
  });

  it('should render the span element if the portal starts as visible', () => {
    const portal = mount(<Portal visible><div /></Portal>);
    expect(portal.instance()._container).not.toBe(null);
    expect(document.body.firstChild).toEqual(portal.instance()._container);
  });

  it('should apply the className prop to the created element', () => {
    const className = 'my-super-amazing-class-name';
    const portal = shallow(<Portal visible={false} className={className}><div /></Portal>);
    expect(portal.instance()._container).toBe(null);
    portal.setProps({ visible: true });
    expect(portal.instance()._container).not.toBe(null);
    expect(portal.instance()._container.className).toBe(className);
  });

  it('should remove the portal from the body when the visibility is changed from true to false', () => {
    const portal = mount(<Portal visible><div /></Portal>);
    expect(portal.instance()._container).not.toBe(null);
    expect(document.body.firstChild).toEqual(portal.instance()._container);

    portal.setProps({ visible: false });
    expect(portal.instance()._container).toBe(null);
    expect(document.body.firstChild).not.toEqual(portal.instance()._container);
  });

  describe('animation', () => {
    beforeEach(() => {
      clearTimeout.mockClear();
    });

    it('should not update the className state if there is no transitionName', () => {
      const portal = shallow(<Portal visible={false}><div /></Portal>);
      expect(portal.state('className')).toBe('');

      portal.setProps({ visible: true });
      expect(portal.state('className')).toBe('');
    });

    it('should not update the className state if there is no timeout for the current transition type', () => {
      const portal = shallow(<Portal visible={false} transitionName="test" transitionLeaveTimeout={300}><div /></Portal>);
      expect(portal.state('className')).toBe('');

      portal.setProps({ visible: true });
      expect(portal.state('className')).toBe('');

      portal.setProps({ visible: false, transitionEnterTimeout: 500, transitionLeaveTimeout: null });
      expect(portal.state('className')).toBe('');
    });

    it('should correctly apply the enter class names', () => {
      const portal = shallow(<Portal visible={false} transitionName="test" transitionEnterTimeout={300}><div /></Portal>);
      expect(portal.state('className')).toBe('');

      portal.setProps({ visible: true });
      expect(portal.state('className')).toBe('test-enter');

      jest.runOnlyPendingTimers();
      expect(portal.state('className')).toBe('test-enter test-enter-active');

      jest.runOnlyPendingTimers();
      expect(portal.state('className')).toBe('');
    });

    it('should correctly apply the leave class names', () => {
      const portal = shallow(<Portal visible transitionName="test" transitionLeaveTimeout={300}><div /></Portal>);
      expect(portal.state('className')).toBe('');

      portal.setProps({ visible: false });
      expect(portal.state('className')).toBe('test-leave');

      jest.runOnlyPendingTimers();
      expect(portal.state('className')).toBe('test-leave test-leave-active');

      jest.runOnlyPendingTimers();
      expect(portal.state('className')).toBe('');
    });

    it('should remove any pending timeouts if the visibility changes while animating', () => {
      const portal = shallow(<Portal visible={false} transitionName="test" transitionEnterTimeout={300}><div /></Portal>);
      // test enter timeout clearing
      portal.setProps({ visible: true });

      expect(portal.state('className')).toBe('test-enter');
      portal.setProps({ visible: false });
      expect(clearTimeout.mock.calls.length).toBe(1);
      expect(portal.state('className')).toBe('');

      // swap to leave timeout tests
      portal.setProps({ transitionEnterTimeout: 0, transitionLeaveTimeout: 200 });
      expect(portal.state('className')).toBe('');
      clearTimeout.mockClear();

      // test leave timeout clearing
      portal.setProps({ visible: true });
      jest.runAllTimers();
      expect(portal.state('className')).toBe('');

      portal.setProps({ visible: false });
      expect(portal.state('className')).toBe('test-leave');

      portal.setProps({ visible: true });
      expect(clearTimeout.mock.calls.length).toBe(1);
      expect(portal.state('className')).toBe('');
    });

    it('should remove any pending timeouts if it unmouts', () => {
      const props = { transitionName: 'test', transitionEnterTimeout: 300, transitionLeaveTimeout: 300 };
      let portal = shallow(<Portal visible={false} {...props}><div /></Portal>);
      portal.setProps({ visible: true });

      expect(portal.state('className')).toBe('test-enter');
      portal.unmount();
      expect(clearTimeout.mock.calls.length).toBe(1);
      jest.runAllTimers();
      clearTimeout.mockClear();

      portal = shallow(<Portal visible {...props}><div /></Portal>);
      expect(portal.state('className')).toBe('');

      portal.setProps({ visible: false });
      expect(portal.state('className')).toBe('test-leave');

      portal.unmount();
      expect(clearTimeout.mock.calls.length).toBe(1);
      jest.runAllTimers();
    });
  });
});
