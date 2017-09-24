import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import {
  unmountComponentAtNode as unmount,
  unstable_renderSubtreeIntoContainer as render,
} from 'react-dom';
import TICK from '../constants/CSSTransitionGroupTick';

/**
 * Creates a "Portal" for the children to be rendered in. Basically it will render the
 * children only when the `visible` prop is `true`. When it is visible, a new `component`
 * will be rendered as the first child in the body with the children inside.
 *
 * Unlike all the other components, `style` will not be applied for the `Portal`.
 */
export default class Portal extends PureComponent {
  static propTypes = {
    /**
     * An optional className to apply to the newly created `component` when visible.
     */
    className: PropTypes.string,

    /**
     * Boolean if the children are visible.
     */
    visible: PropTypes.bool.isRequired,

    /**
     * The children to render when visible.
     */
    children: PropTypes.element,

    /**
     * The component to render as. This should be a valid DOM element.
     */
    component: PropTypes.string.isRequired,

    /**
     * An optional function to call when the portal is opened.
     */
    onOpen: PropTypes.func,

    /**
     * An optional function to call when the portal is closed
     */
    onClose: PropTypes.func,

    /**
     * An optional DOM Node to render the portal into. The default is to render as
     * the first child in the `body`.
     */
    renderNode: PropTypes.object,

    /**
     * Boolean if the portal should render the children as the last child of the `renderNode`
     * or `body` instead of the first.
     */
    lastChild: PropTypes.bool,

    /**
     * An optional transition name to use. This was based off of the original `CSSTransitionGroup`'s `transitionName`
     * so it has the same ideologies. The transition name will be suffixed with:
     * - `-enter` - once the `visible` prop has been switched to `true`
     * - `-enter-active` - a render cycle after the `-enter` suffix was applied and for the duration of the
     *   `transitionEnterTimeout`
     * - `-leave` - once the `visible` prop has been switched to `false`
     * - `-leave-active` - a render cycle after the `-leave` suffix was applied and for the duration of the
     *   `transitionLeaveTimeout`
     */
    transitionName: PropTypes.string,

    /**
     * The duration that the enter transition takes to fully animate. To disable the enter transition,
     * set this value to `0` or `null`.
     */
    transitionEnterTimeout: PropTypes.number,

    /**
     * The duration that the leave transition takes to fully animate. To disable the enter transition,
     * set this value to `0` or `null`.
     */
    transitionLeaveTimeout: PropTypes.number,
  };

  static defaultProps = {
    component: 'span',
    lastChild: false,
  };

  state = { className: '' };

  componentDidMount() {
    if (this.props.visible) {
      this._renderPortal(this.props, this.state);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { visible, onOpen } = nextProps;
    if (this.props.visible === visible) {
      if (this._container) {
        // Need to just re-render the subtree
        this._renderPortal(nextProps, this.state);
      }

      return;
    }

    if (visible) {
      if (onOpen) {
        onOpen();
      }
      this._renderPortal(nextProps, this.state);
      this._animate(nextProps, true);
    } else {
      this._animate(nextProps, false, this._removePortal);
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.className !== nextState.className) {
      this._renderPortal(nextProps, nextState);
    }
  }

  componentWillUnmount() {
    // sort of hacky, just clear timeout and remove portal
    this._animate({ transitionName: null }, false, this._removePortal);
  }

  _container = null;
  _portal = null;

  /**
   * This function is basically how the CSSTransitionGroup used to work at a TransitionItem level. It will attempt to
   * clear any existing animation timeouts and then attempt to do the animation logic. If there is no transitionName,
   * or timeout duration for the current animation type, it will not do any additional work and just shortcut out while
   * calling the optional callback function. When there is a transitionName and a timeout duration, it will apply class
   * names just like the CSSTransitionGroup of `-enter`, `-enter-active`, `-leave`, `-leave-active`.
   *
   * @param {Object} props - the props object to use to extract the transition parts.
   * @param {boolean=true} enter - boolean if the animation should be entering versus leaving.
   * @param {function=} callback - an optional callback to call when the animation has finished or immediately
   *    if there is no animation active.
   */
  _animate = ({ transitionName, transitionEnterTimeout, transitionLeaveTimeout }, enter = true, callback) => {
    if (this._timeout) {
      clearTimeout(this._timeout);
      this._timeout = null;
    }

    if (!transitionName || (enter && !transitionEnterTimeout) || (!enter && !transitionLeaveTimeout)) {
      if (callback) {
        callback();
      }

      if (this.state.className) {
        this.setState({ className: '' });
      }
      return;
    }

    const suffix = enter ? 'enter' : 'leave';
    const timeout = enter ? transitionEnterTimeout : transitionLeaveTimeout;
    const className = `${transitionName}-${suffix}`;
    this.setState({ className });
    this._timeout = setTimeout(() => {
      this.setState({ className: `${className} ${className}-active` });

      this._timeout = setTimeout(() => {
        this._timeout = null;
        this.setState({ className: '' });

        if (callback) {
          callback();
        }
      }, timeout);
    }, TICK);
  };

  _applyStyles = (props) => {
    if (props.className) {
      this._container.className = props.className;
    }
  };

  _renderPortal = (props, state) => {
    if (!this._container) {
      this._container = document.createElement(props.component);

      this._applyStyles(props);
      const node = (props.renderNode || document.body);
      if (props.lastChild) {
        node.appendChild(this._container);
      } else {
        node.insertBefore(this._container, node.firstChild);
      }
    } else {
      this._applyStyles(props);
    }

    const child = React.Children.only(props.children);
    this._portal = render(this, React.cloneElement(child, {
      className: cn(child.props.className, state.className),
    }), this._container);
  };

  _removePortal = () => {
    if (this.props.onClose) {
      this.props.onClose();
    }

    if (this._container) {
      unmount(this._container);
      (this.props.renderNode || document.body).removeChild(this._container);
    }

    this._portal = null;
    this._container = null;
  };

  render() {
    // When doing server side rendering, actually render the component as a direct child of its parent.
    // Once it has been rendered and working client side, it will be removed correctly.
    if (typeof window === 'undefined' && this.props.visible) {
      const { component: Component, className, children } = this.props;
      return <Component className={className}>{children}</Component>;
    }

    return null;
  }
}
