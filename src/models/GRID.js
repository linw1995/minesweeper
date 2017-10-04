function randInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function getAroudLoc(loc, height, width) {
  const getloc = (x, y) => (x * width + y);
  const rv = [];
  const x = Math.floor(loc / width);
  const y = loc % width;
  for (const i of [-1, 0, 1]) {
    for (const j of [-1, 0, 1]) {
      const _x = x + i;
      const _y = y + j;
      if (0 <= _x && _x < height && 0 <= _y && _y < width) {
        rv.push(getloc(_x, _y));
      }
    }
  }
  return rv;
}

export default {
  namespace: 'GRID',
  state: {
    gridType: [], // number 0~9 for cellType.
    // 9 means mine, 0~8 means how many mine aroud
    gridStatus: [], // bool for cell showing or not
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
          for (const aroudLoc of getAroudLoc(loc, height, width)) {
            if (gridType[aroudLoc] !== 9) gridType[aroudLoc] += 1;
          }
          count -= 1;
        }
      }
      return { ...state, gridStatus, gridType, height, width, minesCount, status: 0, updatedAt, startedAt: 'null' };
    },
    CLICK_ON_LOC(state, action) {
      const { loc, updatedAt } = action.payload;
      const { gridStatus, gridType, height, width, minesCount } = state;
      let locs = [];
      let status = state.status;
      if (status === 1 || status === 2) {
        // when win or lose diasble the cell clickable
        return state;
      }
      const seen = new Set();
      locs.push(loc);
      while (locs.length > 0) {
        const loc = locs.pop();
        if (seen.has(loc)) { continue; }
        seen.add(loc);
        if (gridType[loc] === 9) { // click the mine
          // show all the cell
          for (let i = 0; i < gridStatus.length; i += 1) {
            gridStatus[i] = true;
          }
          break;
        } else if (gridType[loc] === 0) { // click the blank cell
          const aroudLocs = getAroudLoc(loc, height, width);
          locs = locs.concat(...aroudLocs);
        }
        gridStatus[loc] = true;
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

      if (typeof state.startedAt === 'string') {
        return { ...state, gridStatus, updatedAt, status, startedAt: updatedAt };
      } else {
        return { ...state, gridStatus, updatedAt, status };
      }
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
