import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './Cell.less';
import oneIcon from '../assets/one.svg';
import twoIcon from '../assets/two.svg';
import threeIcon from '../assets/three.svg';
import fourIcon from '../assets/four.svg';
import fiveIcon from '../assets/five.svg';
import sixIcon from '../assets/six.svg';
import sevenIcon from '../assets/seven.svg';
import eightIcon from '../assets/eight.svg';
import mineIcon from '../assets/mine.svg';
import flagIcon from '../assets/red-flag.svg';

const cellIcons = [null, oneIcon, twoIcon, threeIcon, fourIcon, fiveIcon, sixIcon, sevenIcon, eightIcon, mineIcon];
class Cell extends Component {
  state = { rightClick: false, leftClick: false };
  onMouseDown = (e) => {
    if (e.button === 2) {
      this.setState({ rightClick: true });
    }
  }
  onMouseUp = (e) => {
    const { rightClick } = this.state;
    switch (e.button) {
      case 2: // right click button
        this.props.onRightClick(e);
        this.setState({ rightClick: false });
        break;
      case 0: // left click button
        if (!rightClick) {
          this.props.onLeftClick(e);
        } else {
          this.props.onBothClick(e);
        }
    }
  }
  render = () => {
    const { className, style, cellType, shown, flag } = this.props;
    const cellIcon = cellIcons[cellType];
    const cellClassName = [];
    cellClassName.push(styles.cell);
    className ? cellClassName.push(className) : null;
    shown ? cellClassName.push(styles.shown) : null;
    return (
      <div
        className={cellClassName.join(' ')}
        style={style}
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
      >
        { cellIcon ? <img key="cellIcon" src={cellIcon} className={styles.icon} style={{ pointerEvents: 'none' }} /> : null }
        { flag ? <img key="flagIcon" src={flagIcon} className={styles.flag} style={{ pointerEvents: 'none' }} /> : null }
      </div>
    );
  }
}

Cell.propTypes = {
  style: PropTypes.object,
  className: PropTypes.string,
  cellType: PropTypes.number,
  shown: PropTypes.bool,
  flag: PropTypes.bool,

  onLeftClick: PropTypes.func,
  onRightClick: PropTypes.func,
  onBothClick: PropTypes.func,
};

export default Cell;
