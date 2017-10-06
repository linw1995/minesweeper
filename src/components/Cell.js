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
  render = () => {
    const { className, style, cellType, shown } = this.props;
    const cellIcon = cellIcons[cellType];
    const cellClassName = [];
    cellClassName.push(styles.cell);
    className ? cellClassName.push(className) : null;
    shown ? cellClassName.push(styles.active) : null;

    const flag = this.props.flag;

    const onLeftClick = this.props.onLeftClick ? this.props.onLeftClick : (e) => { e.preventDefault(); };
    const onRightClick = this.props.onRightClick ? this.props.onRightClick : (e) => { e.preventDefault(); };
    return (
      <div
        className={cellClassName.join(' ')}
        style={style}
        onClick={onLeftClick}
        onContextMenu={onRightClick}
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
};

export default Cell;
