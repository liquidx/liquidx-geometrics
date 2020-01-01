const squareGridDraw = (context, originX, originY, cellWidth, cellHeight, seqX, seqY, percentX, percentY) => {
}

const squareGrid = (s, options, originX, originY, width, height, countX, countY, drawAtGrid) => {
  let cellWidth = width / countX
  let cellHeight = height / countY

  if (s.frameCount < 10) {
    console.log(cellWidth, cellHeight)
  }

  for (let x = 0; x < countX; x++) {
    for (let y = 0; y < countY; y++) {
      drawAtGrid(
        s,
        options,
        originX + x * cellWidth,
        originY + y * cellHeight,
        cellWidth, 
        cellHeight,
        x,
        y,
        x / countX,
        y / countY
      )
    }
  }
}

const squareGridLines = (s, options, originX, originY, width, height, countX, countY, gridColor) => {
  let cellWidth = width / countX
  let cellHeight = height / countY
  s.stroke(gridColor)
  s.strokeWeight(1)
  for (let x = 1; x < countX; x++) {
    s.line(
      x * cellWidth + originX, 
      originY, 
      x * cellWidth + originX, 
      originY + height)
  }
  for (let y = 1; y < countY; y++) {
    s.line(
      originX, 
      y * cellHeight + originY, 
      originX + width, 
      y * cellHeight + originY)
  }    
}

module.exports.squareGrid = squareGrid
module.exports.squareGridLines = squareGridLines
