import React from 'react';
import PropTypes from 'prop-types';

class Async extends React.Component {
  static propTypes = {
    loadData: PropTypes.func.isRequired,
    loadOptimisticData: PropTypes.func,
    render: PropTypes.func.isRequired,
  };

  state = {
    isLoading: false,
    error: void 0,
    data: void 0,
  };

  componentDidMount() {
    this.makeRequest();
  }

  componentWillUnmount() {
    this.cancel();
  }

  cancel = () => {}
  async makeRequest() {
    this.cancel();
    let cancelled = false;
    let onCancel = [];
    this.cancel = () => {
      cancelled = true;
      this.cancel = () => {};
      onCancel.forEach(fn => fn());
    };
    try {
      let data =
        this.props.loadOptimisticData ?
          this.props.loadOptimisticData() :
          this.state.data;
      this.setState({
        isLoading: true,
        error: void 0,
        data,
      });
      data = await this.props.loadData({
        set: this.set,
        invalidate: this.invalidate,
        onCancel: fn => {
          onCancel.push(fn);
        },
      });
      if (cancelled) return;
      this.setState({ isLoading: false, data });
    } catch (error) {
      if (cancelled) return;
      this.setState({ isLoading: false, error });
    }
  }

  set = data => {
    this.cancel();
    this.setState({ isLoading: false, data });
  }
  invalidate = () => {
    this.makeRequest();
  }

  render() {
    return this.props.render({
      ...this.state,
      set: this.set,
      invalidate: this.invalidate,
    });
  }
}

export default Async;
