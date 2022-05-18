import {object} from 'prop-types';
import * as React from 'react';

const withReducer = (reducer, key: string) => WrappedComponent => {
  const Extended = (props, context) => {
    context.store.injectReducer(key, reducer);
    return <WrappedComponent {...props} />;
  };

  (Extended as any).contextTypes = {
    store: object
  };

  return Extended;
};

export { withReducer };
