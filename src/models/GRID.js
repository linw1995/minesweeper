import { randInt, getAroudLocs } from '../utils/funcs';

function clickOnLocs(locs, width, height, gridStatus, gridFlag, gridType) {
  const seen = new Set();
  while (locs.length > 0) {
    const loc = locs.pop();
    if (seen.has(loc)) { continue; }
    seen.add(loc);
    if (gridType[loc] === 9 && !gridFlag[loc]) {
      // click the mine, flaged cell is unclickable
      // show all the cell
      for (let i = 0; i < gridStatus.length; i += 1) {
        gridStatus[i] = true;
      }
      break;
    } else if (gridType[loc] === 0 && !gridStatus[loc] && !gridFlag[loc]) {
      // click the blank cell, flaged cell and shown cell is not spreadable
      const aroudLocs = new Set();
      const x = Math.floor(loc / width);
      const y = loc % width;
      // top
      if (x - 1 >= 0) {
        const aroudLoc = (x - 1) * width + y;
        if (!gridStatus[aroudLoc]) {
          aroudLocs.add(aroudLoc);
          if (y - 1 >= 0) {
            aroudLocs.add(aroudLoc - 1);
          }
          if (y + 1 < width) {
            aroudLocs.add(aroudLoc + 1);
          }
        }
      }
      // left
      if (y + 1 < width) {
        const aroudLoc = x * width + y + 1;
        if (!gridStatus[aroudLoc]) {
          aroudLocs.add(aroudLoc);
          if (x - 1 >= 0) {
            aroudLocs.add(aroudLoc - width);
          }
          if (x + 1 < height) {
            aroudLocs.add(aroudLoc + width);
          }
        }
      }
      // bottom
      if (x + 1 < height) {
        const aroudLoc = (x + 1) * width + y;
        if (!gridStatus[aroudLoc]) {
          aroudLocs.add(aroudLoc);
          if (y - 1 >= 0) {
            aroudLocs.add(aroudLoc - 1);
          }
          if (y + 1 < width) {
            aroudLocs.add(aroudLoc + 1);
          }
        }
      }
      // left
      if (y - 1 >= 0) {
        const aroudLoc = x * width + y - 1;
        if (!gridStatus[aroudLoc]) {
          aroudLocs.add(aroudLoc);
          if (x - 1 >= 0) {
            aroudLocs.add(aroudLoc - width);
          }
          if (x + 1 < height) {
            aroudLocs.add(aroudLoc + width);
          }
        }
      }
      locs = locs.concat(...aroudLocs);
    }
    if (!gridFlag[loc]) {
      // flaged cell is unclickable
      gridStatus[loc] = true;
    }
  }
  return gridStatus;
}

export default {
  namespace: 'GRID',
  state: {
    gridType: [], // number 0~9 for cellType.
    // 9 means mine, 0~8 means how many mine aroud
    gridStatus: [], // bool for cell showing or not
    gridFlag: [], // bool for mark or not
    flagCount: 0,
    height: 0,
    width: 0,
    minesCount: 0,
    status: 0, // 0: in game, 1: win, 2: lose

    startedAt: 'null',
    updatedAt: 0,
  },
  reducers: {
    INIT_GRID(state, action) {
      const { height, width, updatedAt } = action.payload;
      let { minesCount } = action.payload;
      const len = height * width;
      const gridStatus = [];
      // all set not shown
      for (let i = 0; i < len; i += 1) {
        gridStatus[i] = false;
      }

      const gridType = [];
      // first, all set 0
      for (let i = 0; i < len; i += 1) {
        gridType[i] = 0;
      }
      // second, randomly produce mine
      let count = minesCount < height * width / 3 ? minesCount : height * width / 3;
      minesCount = count;
      // avoid endless loop, max minesCount should small than height * width / 3
      while (count > 0) {
        const loc = randInt(0, len);
        if (gridType[loc] !== 9) {
          gridType[loc] = 9;
          // incress the mineCount of cell aroud mine
          for (const aroudLoc of getAroudLocs(loc, height, width)) {
            if (gridType[aroudLoc] !== 9) gridType[aroudLoc] += 1;
          }
          count -= 1;
        }
      }

      const gridFlag = [];
      for (let i = 0; i < len; i += 1) {
        gridFlag[i] = false;
      }
      return { ...state, gridStatus, gridType, gridFlag, height, width, minesCount, status: 0, updatedAt, startedAt: 'null' };
    },
    LEFT_CLICK_ON_LOC(state, action) {
      const { loc, updatedAt } = action.payload;
      const { gridType, gridFlag, height, width, minesCount } = state;
      let gridStatus = [...state.gridStatus];
      let locs = [loc];
      let status = state.status;
      if (status === 1 || status === 2) {
        // when win or lose diasble the cell clickable
        return state;
      }

      gridStatus = clickOnLocs(locs, width, height, gridStatus, gridFlag, gridType);

      let counter = 0;
      gridStatus.forEach((status) => {
        if (!status) counter += 1;
      });
      if (counter === 0) {
        // lose
        status = 2;
      } else if (counter === minesCount) {
        // win
        status = 1;
      }

      if (typeof state.startedAt === 'string') {
        // game start
        return { ...state, gridStatus, updatedAt, status, startedAt: updatedAt };
      } else {
        return { ...state, gridStatus, updatedAt, status };
      }
    },
    RIGHT_CLICK_ON_LOC(state, action) {
      const { loc, updatedAt } = action.payload;
      const { gridStatus, minesCount, status } = state;
      if (status === 1 || status === 2) {
        // when win or lose diasble the cell clickable
        return state;
      }
      const gridFlag = [...state.gridFlag];
      if (gridStatus[loc]) {
        return state;
      }
      gridFlag[loc] = !gridFlag[loc];
      let flagCount = 0;
      gridFlag.forEach((v) => {
        if (v) flagCount += 1;
      });
      if (flagCount > minesCount) {
        return state;
      }
      if (typeof state.startedAt === 'string') {
        // game start
        return { ...state, gridFlag, flagCount, updatedAt, startedAt: updatedAt };
      } else {
        return { ...state, gridFlag, flagCount, updatedAt };
      }
    },
    BOTH_CLICK_ON_LOC(state, action) {
      const { loc, updatedAt } = action.payload;
      const { gridType, gridFlag, minesCount, height, width } = state;
      let gridStatus = [...state.gridStatus];
      let status = state.status;
      if (status === 1 || status === 2) {
        // when win or lose diasble the cell clickable
        return state;
      }
      if (!gridStatus[loc]) {
        // the target cell should be shown
        return state;
      }
      const aroudMinesCount = gridType[loc];
      const aroudLocs = getAroudLocs(loc, height, width);
      let flagAroudMinesCount = 0;
      for (const aroudLoc of aroudLocs) {
        if (gridFlag[aroudLoc]) {
          flagAroudMinesCount += 1;
        }
      }
      if (aroudMinesCount === flagAroudMinesCount) {
        // show all the cell around the loc
        gridStatus = clickOnLocs(aroudLocs, width, height, gridStatus, gridFlag, gridType);
      }

      let counter = 0;
      gridStatus.forEach((status) => {
        if (!status) counter += 1;
      });
      if (counter === 0) {
        // lose
        status = 2;
      } else if (counter === minesCount) {
        // win
        status = 1;
      }
      return { ...state, status, gridStatus, updatedAt };
    },
  },
  effects: {},
  subscriptions: {
    setup({ dispatch, history }) { // eslint-disable-line
      history.listen((location) => {
        if (location.pathname === '/') {
          dispatch({
            type: 'INIT_GRID',
            payload: {
              height: 10,
              width: 25,
              minesCount: 20,
              updatedAt: Date.now(),
            },
          });
        }
      });
    },
  },
};
