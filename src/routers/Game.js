import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';

import styles from './Game.less';
import MainLayout from '../components/layouts/MainLayout';
import GameTable from '../components/GameTable';

class GamePage extends Component {
  state = { time: 0 }
  componentWillMount = () => {
    this.timer = setInterval(() => {
      const { status, startedAt, updatedAt } = this.props;
      let time = 0;
      if (typeof startedAt === 'number' && status === 0) {
        // when the game doesn't start yet, startedAt = 'null'
        time = (Date.now() - startedAt) / 1000;
      } else if (status !== 0) {
        time = (updatedAt - startedAt) / 1000;
      }
      this.setState({
        // format number to always show 3 decimal places
        time: parseFloat(Math.round(time * 1000) / 1000)
          .toFixed(3),
      });
    }, 100);
  }
  componentWillUnmount = () => {
    clearInterval(this.timer);
  }
  render = () => {
    const minesCount = this.props.minesCount;
    const { time } = this.state;
    return (
      <MainLayout>
        <div className={styles.body}>
          <div className={styles.gameContainer}>
            <GameTable />
          </div>
          <div className={styles.gameController}>
            <ul>
             <li><span>{ minesCount }</span><span>mines</span></li>
             <li><span>{ time }</span><span>s</span></li>
             <li><button onClick={this.props.restart}>restart</button></li>
            </ul>
          </div>
        </div>
      </MainLayout>
    );
  }
}

GamePage.propTypes = {
  // state
  minesCount: PropTypes.number.isRequired,
  startedAt: PropTypes.any.isRequired,
  updatedAt: PropTypes.number.isRequired,
  status: PropTypes.number.isRequired,
  // dispatch
  restart: PropTypes.func.isRequired,
};

function MapStateToProps(state) {
  return {
    minesCount: state.GRID.minesCount,
    startedAt: state.GRID.startedAt,
    updatedAt: state.GRID.updatedAt,
    status: state.GRID.status,
  };
}

function MapDispatchToProps(dispatch) {
  return {
    restart: () => {
      dispatch({
        type: 'GRID/INIT_GRID',
        payload: {
          height: 10,
          width: 25,
          minesCount: 10,
          updatedAt: Date.now(),
        },
      });
    },
  };
}

export default connect(MapStateToProps, MapDispatchToProps)(GamePage);
