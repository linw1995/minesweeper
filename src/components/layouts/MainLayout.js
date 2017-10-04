import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './MainLayout.less';

class Layout extends Component {
  constructor(props, context) {
    const obj = super(props, context);
    obj.__context = {};
    return obj;
  }
  getChildContext() {
    return { body: this.__context };
  }
  componentWillMount = () => {
    this.timer = setInterval(() => {
      const element = this.__body;
      if (element == undefined) {
        return;
      }
      const height = element.clientHeight;
      const width = element.clientWidth;
      this.__context.height = height;
      this.__context.width = width;
    }, 100);
  }
  componentWillUnmount = () => {
    clearInterval(this.timer);
  }
  storeInToContext = (element) => {
    this.__body = element;
    const height = element.clientHeight;
    const width = element.clientWidth;
    this.__context.height = height;
    this.__context.width = width;
  }
  render() {
    return (
      <div ref={this.storeInToContext} className={styles.body}>
        <div className={styles.child}>
          { this.props.children }
        </div>
        <div className={styles.footer}>
        <div>Made with <a href="https://github.com/facebook/react">React</a> , <a href="https://github.com/dvajs/dva">dva</a>  by <a href="http://linw1995.com">linw1995</a> is licensed by MIT.</div>
        <div>Mine Icon made by <a href="https://www.flaticon.com/authors/creaticca-creative-agency" title="Creaticca Creative Agency">Creaticca Creative Agency</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0">CC 3.0 BY</a></div>
        <div>Number Icons made by <a href="https://www.flaticon.com/authors/twitter" title="Twitter">Twitter</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0">CC 3.0 BY</a></div>
        </div>
      </div>
    );
  }
}

Layout.propTypes = {
  children: PropTypes.element.isRequired,
};

Layout.childContextTypes = {
  body: PropTypes.object.isRequired,
};

export default Layout;
