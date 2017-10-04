import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';

import styles from './GameTable.less';
import Cell from './Cell';

class GameTable extends Component {
  state = { visible: false }
  componentWillMount() {
    this.timer = setTimeout(() => { this.setState({ visible: true }); }, 100);
  }
  componentWillUnmount() {
    clearTimeout(this.timer);
  }
  getGird(gridType, gridStatus, gridFlag, cellStyle) {
    const grid = [];
    const { height, width } = this.props;
    const onLeftClick = (i, j) => (() => {
      this.props.clickOnLoc(i * width + j);
    });
    const onRightClick = (i, j) => ((e) => {
      e.preventDefault();
      this.props.rightClickOnLoc(i * width + j);
    });
    for (let i = 0; i < height; i += 1) {
      const cells = [];
      for (let j = 0; j < width; j += 1) {
        const type = gridType[i * width + j];
        const shown = gridStatus[i * width + j];
        const flag = gridFlag[i * width + j];
        cells.push(
          <Cell
            key={j}
            className={styles.cell}
            style={cellStyle}
            cellType={type}
            shown={shown}
            flag={flag}
            onLeftClick={onLeftClick(i, j)}
            onRightClick={onRightClick(i, j)}
          />
        );
      }
      grid.push(<div key={i} className={styles.row}>{cells}</div>);
    }
    return grid;
  }
  render() {
    const containerInfo = this.context.body;
    const padding = 100;
    const { height, width, gridType, gridStatus, gridFlag } = this.props;
    // should limit height and width
    const styleHeight = (containerInfo.height - 2 * padding) / height;
    const styleWidth = (containerInfo.width - 2 * padding) / width;
    let squareSize = styleHeight > styleWidth ? styleWidth : styleHeight;
    if (isNaN(squareSize)) {
      squareSize = 30;
    }
    const squareStyle = {
      height: squareSize - 3,
      width: squareSize - 3,
    };
    const Grid = this.getGird(gridType, gridStatus, gridFlag, squareStyle);
    const bodyStyle = {
      height: height * squareSize + 30,
      width: width * squareSize + 60,
    };
    return (
      <div className={styles.body} style={bodyStyle} onContextMenu={(e)=>(e.preventDefault())}>
        { this.state.visible ? Grid : null }
      </div>
    );
  }
}

GameTable.propTypes = {
  // dispatch
  clickOnLoc: PropTypes.func.isRequired,
  rightClickOnLoc: PropTypes.func.isRequired,
  // state
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  minesCount: PropTypes.number.isRequired,
  gridType: PropTypes.array.isRequired,
  gridStatus: PropTypes.array.isRequired,
  gridFlag: PropTypes.array.isRequired,
  updatedAt: PropTypes.number.isRequired,
};

GameTable.contextTypes = {
  body: PropTypes.object.isRequired,
};

function MapStateToProps(state) {
  return {
    height: state.GRID.height,
    width: state.GRID.width,
    minesCount: state.GRID.minesCount,
    gridType: state.GRID.gridType,
    gridStatus: state.GRID.gridStatus,
    gridFlag: state.GRID.gridFlag,
    updatedAt: state.GRID.updatedAt,
  };
}

function MapDispatchToProps(dispatch) {
  return {
    clickOnLoc: (loc) => {
      dispatch({ type: 'GRID/CLICK_ON_LOC', payload: { loc, updatedAt: Date.now() } });
    },
    rightClickOnLoc: (loc) => {
      dispatch({ type: 'GRID/RIGHT_CLICK_ON_LOC', payload: { loc, updatedAt: Date.now() } });
    },
  };
}

export default connect(MapStateToProps, MapDispatchToProps)(GameTable);
