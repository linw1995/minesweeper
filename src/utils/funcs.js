function randInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function getAroudLocs(loc, height, width) {
  /*
   *  [ ][ ][ ]
   *  [ ][X][ ]
   *  [ ][ ][ ]
   */
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

export default { randInt, getAroudLocs };
