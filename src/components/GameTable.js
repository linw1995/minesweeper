import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';

import styles from './GameTable.less';
import Cell from './Cell';

class GameTable extends Component {
  state = {
    visible: false,
    cellStyle: { height: 0, width: 0 },
    bodyStyle: { height: 0, width: 0 },
  }
  componentWillMount() {
    setTimeout(() => { this.setState({ visible: true }); }, 100);
    this.timer = setInterval(this.updateStyle, 100);
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
  updateStyle = () => {
    function compare(a, b) {
      return a.height === b.height && a.width === b.width;
    }
    const { height, width } = this.props;
    // should limit height and width
    const containerInfo = this.context.body;
    const styleHeight = containerInfo.height / height;
    const styleWidth = containerInfo.width / width;
    let squareSize = styleHeight > styleWidth ? styleWidth : styleHeight;
    if (isNaN(squareSize)) {
      squareSize = 30;
    }
    const cellStyle = {
      height: squareSize - 3,
      width: squareSize - 3,
    };
    const bodyStyle = {
      height: squareSize * height,
      width: squareSize * width,
      padding: squareSize / 3,
    };
    if (!compare(this.state.cellStyle, cellStyle)) {
      this.setState({ cellStyle, bodyStyle });
    }
  }
  render() {
    const { gridType, gridStatus, gridFlag } = this.props;
    const { cellStyle, bodyStyle } = this.state;
    const Grid = this.getGird(gridType, gridStatus, gridFlag, cellStyle);
    return (
      <div style={{ userSelect: 'none' }}>
        { this.state.visible ?
        <div className={styles.body} style={bodyStyle} onContextMenu={(e)=>(e.preventDefault())}>
         { Grid }
        </div> : null }
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
