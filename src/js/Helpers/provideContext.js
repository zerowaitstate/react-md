import React from 'react';

export default function provideContext(childContextTypes, getChildContext) {
  return (Component) => class ContextProvider extends Component {
    static childContextTypes = childContextTypes;
    getChildContext = () => getChildContext(this.props);

    render() {
      return <Component {...this.props} />;
    }
  };
}
