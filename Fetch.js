import React from 'react';
import PropTypes from 'prop-types';

import Async from './Async';

class Fetch extends React.Component {
  static propTypes = {
    url: PropTypes.string.isRequired,
    options: PropTypes.shape({
      method: PropTypes.oneOf(['OPTIONS', 'GET', 'POST', 'PUT', 'DELETE']),
    }),
    render: PropTypes.func.isRequired,
  };

  componentWillReceiveProps(nextProps) {
    invariant(
      this.props.url === nextProps.url,
      "Fetch doesn't support changing props. Please use React's `key` feature if you want to do another request",
    );
  }

  render() {
    const {
      url, options, render, ...rest
    } = this.props;

    return (
      <Async
        {...rest}
        loadData={() => fetch(url, options)}
        render={render}
      />
    );
  }
}

export default Fetch;
