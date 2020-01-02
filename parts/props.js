import dat from 'dat.gui'

class _Properties {
  constructor(extraProperties) {

    // Common properties
    this.width = 640
    this.height = 360
    this.marginX = 148
    this.marginY = 8

    this.countX = 10
    this.countY = 10

    this.stroke = false
    this.foreground = '#a9a9a9'
    this.background = '#202020'

    this.drawGrid = false
    this.grid = '#990000'

    this.animate = true
    this.frameNumber = 0

    this.numberOfFrames = 120
    this.frameRate = 30

    // this.width = 360
    // this.height = 360
    // this.marginX = 8
    // this.marginY = 8    


    this.shiftX = 0.1
    this.shiftY = 0.2
    this.shiftZ = 0
    this.unitInset = -1

    for (let k in extraProperties) {
      this[k] = extraProperties[k]
    }

  }

  registerDat(addExtraControls)  {
    let gui = new dat.GUI({closed: true, autoPlace: false, width: 320})
    gui.closed = false;

    gui.add(this, 'marginX', 0, 200).step(1)
    gui.add(this, 'marginY', 0, 200).step(1)
  
    gui.add(this, 'countX', 1, 32).step(1)
    gui.add(this, 'countY', 1, 32).step(1)
  
    gui.add(this, 'drawGrid')
    gui.addColor(this, 'grid')
  
    gui.add(this, 'stroke')
    gui.addColor(this, 'foreground')
    gui.addColor(this, 'background')
  
    gui.add(this, 'animate')
    gui.add(this, 'frameNumber', 0, this.numberOfFrames).step(1)
  

    let xc = gui.add(this, 'shiftX', -3, 3).step(0.01)
    let yc = gui.add(this, 'shiftY', -3, 3).step(0.01)
    let zc = gui.add(this, 'shiftZ', -3, 3).step(0.01)
  
    this.animatedControllers = [xc, yc, zc]
  
    gui.add(this, 'unitInset', -10, 10).step(1)

    if (addExtraControls) {
      addExtraControls(this, gui)
    }
  
    let sampling = gui.addFolder('Recording')
    sampling.add(this, 'numberOfFrames', 1, 180).step(1);
    sampling.add(this, 'frameRate', 1, 60).step(1);
    
    return gui
  }
}
export { _Properties as Properties }
