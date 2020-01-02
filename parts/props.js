import dat from 'dat.gui'
import _ from 'lodash'

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

    this._defaults = {}
    for (let k of _.keys(this)) {
      if (k.startsWith('_')) { continue }
      this._defaults[k] = this[k]
    }
    console.log(this._defaults)

    this.loadFromHash()
  }

  loadFromHash() {
    if (window.location.hash) {
      let params = new URLSearchParams(window.location.hash.substr(1))
      if (params) {
        for (const [key, value] of params.entries()) {
          let numericValue = parseFloat(value)
          let booleanValue = (value == 'true' || value == 'false')
          if (!isNaN(numericValue)) {
            this[key] = numericValue
          } else if (booleanValue) {
            if (value == 'true') {
              this[key] = true
            } else {
              this[key] = false
            }
          } else {
            this[key] = value
          }
        }
      }
    }
  }

  saveToHash() {
    let changes = {}
    for (let k of _.keys(this)) {
      if (k.startsWith('_')) { continue }
      let currentValue = this[k]
      if (this._defaults[k] != currentValue) {
        changes[k] = currentValue
      }
    }

    if (_.keys(changes).length > 0) {
      let params = new URLSearchParams(changes)
      window.location.hash = '#' + params.toString()
    }
  }

  activateLink(elem, callback) {
    let self = this  // binding hack
    elem.addEventListener('click', e => {
      if (callback) {
        callback()
      }
      let h = self.saveToHash()
      const el = document.createElement('textarea');
      el.value = window.location;
      el.setAttribute('readonly', '');
      el.style.position = 'absolute';
      el.style.left = '-9999px';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      e.preventDefault()
      return false;
    })
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
