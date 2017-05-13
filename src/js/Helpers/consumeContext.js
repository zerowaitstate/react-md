import React from 'react';

export default function consumeContext(contextTypes) {
  return (Component) => {
    const ContextConsumer = (props, context) => <Component {...context} {...props} />;
    ContextConsumer.contextTypes = contextTypes;

    return ContextConsumer;
  };
}
