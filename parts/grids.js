/* eslint-disable no-unused-vars */

const squareGridDraw = (context, originX, originY, cellWidth, cellHeight, seqX, seqY, percentX, percentY) => {
}

const squareGrid = (s, context, originX, originY, width, height, countX, countY, drawAtGrid) => {
  let cellWidth = width / countX
  let cellHeight = height / countY

  for (let x = 0; x < countX; x++) {
    for (let y = 0; y < countY; y++) {
      drawAtGrid(
        s,
        context,
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

const squareGridLines = (s, context, originX, originY, width, height, countX, countY, gridColor) => {
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

const _squareGrid = squareGrid
export { _squareGrid as squareGrid }
const _squareGridLines = squareGridLines
export { _squareGridLines as squareGridLines }
