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

const cellIcons = [null, oneIcon, twoIcon, threeIcon, fourIcon, fiveIcon, sixIcon, sevenIcon, eightIcon, mineIcon];
class Cell extends Component {
  render = () => {
    const { className, style, cellType, shown } = this.props;
    const cellIcon = cellIcons[cellType];
    const cellClassName = [];
    cellClassName.push(styles.cell);
    className ? cellClassName.push(className) : null;
    shown ? cellClassName.push(styles.active) : null;
    return (
      <div
        className={cellClassName.join(' ')}
        style={style}
        onClick={!shown ? this.props.onClick : null}
      >
        { cellIcon ?
          <img
            src={cellIcon}
            className={styles.icon}
          /> : null }
      </div>
    );
  }
}

Cell.propTypes = {
  style: PropTypes.object,
  className: PropTypes.string,
  cellType: PropTypes.number,
  shown: PropTypes.bool,

  onClick: PropTypes.func,
};

export default Cell;
