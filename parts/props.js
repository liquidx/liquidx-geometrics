import dat from 'dat.gui'

const PIXEL_DENSITY = 2

class _Properties {
  constructor(extraProperties) {

    // Common properties
    this.width = 360
    this.height = 360
    this.pixelDensity = PIXEL_DENSITY

    this.marginX = 8
    this.marginY = 8

    this.countX = 10
    this.countY = 10

    // grid cell properties
    this.cellInset = 0
    this.cellVaryX = 0
    this.cellVaryY = 0

    this.stroke = false
    this.foreground = '#a9a9a9'
    this.background = '#202020'

    this.drawGrid = false
    this.grid = '#990000'

    this.animate = true
    this.frameNumber = 0

    this.numberOfFrames = 120
    this.frameRate = 30

    // this.width = 640
    // this.height = 360
    // this.marginX = 148
    // this.marginY = 8    

    if (extraProperties) {
      for (let k in extraProperties) {
        this[k] = extraProperties[k]
      }
    }

    this.loadFromHash()
  }

  loadFromHash() {
    if (window.location.hash) {
      let params = new URLSearchParams(window.location.hash.substr(1))
      if (params) {
        for (const [key, value] of params.entries()) {
          let numericValue = parseFloat(value)
          if (!isNaN(numericValue)) {
            this[key] = numericValue
          } else {
            this[key] = value
          }
        }
      }
    }
  }

  registerDat(addExtraControls)  {
    let gui = new dat.GUI({closed: true, autoPlace: false, width: 320})
    gui.closed = false;

    if (addExtraControls) {
      addExtraControls(this, gui)
    }
  
    gui.add(this, 'countX', 1, 32).step(1)
    gui.add(this, 'countY', 1, 32).step(1)

    gui.add(this, 'marginX', 0, 200).step(1)
    gui.add(this, 'marginY', 0, 200).step(1)

    gui.add(this, 'cellInset', -10, 10).step(1)
    gui.add(this, 'cellVaryX', -10, 10).step(0.01)
    gui.add(this, 'cellVaryY', -10, 10).step(0.01)

  
    gui.add(this, 'stroke')
  
    gui.add(this, 'animate')
    gui.add(this, 'frameNumber', 0, this.numberOfFrames).step(1)

    gui.addColor(this, 'foreground')
    gui.addColor(this, 'background')
    gui.addColor(this, 'grid')
    gui.add(this, 'drawGrid')

    let canvasSize = gui.addFolder('Size')
    let widthController = canvasSize.add(this, 'width', 240, 1200).step(10)
    let heightController = canvasSize.add(this, 'height', 240, 1200).step(10)
    widthController.onFinishChange(this.onWidthHeightChange)
    heightController.onFinishChange(this.onWidthHeightChange)

    let sampling = gui.addFolder('Animation')
    sampling.add(this, 'numberOfFrames', 1, 180).step(1)
    sampling.add(this, 'frameRate', 1, 60).step(1)

    return gui
  }

  onWidthHeightChange() {
    let canvas = document.querySelector('canvas')
    if (this.property == 'width') {
      let width = this.getValue()
      canvas.width = width * PIXEL_DENSITY
      canvas.style.width = width + 'px'
    } else if (this.property == 'height') {
      let height = this.getValue()
      canvas.height = height * PIXEL_DENSITY
      canvas.style.height = height + 'px'
    }
  }
}
export { _Properties as Properties }
