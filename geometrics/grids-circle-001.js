import p5 from '../node_modules/p5/lib/p5.min.js' //import p5 from 'p5'
import dat from 'dat.gui'
import { squareGrid, squareGridLines } from '../parts/grids.js'
import Capturer from '../parts/capturer.js'

// The canvas.
let p5canvas = null
let canvas = null
let _capturer = null

// Animation
let props = {}

let sketch = new p5(s => {

  s.draw = () => {
    s.startFrame()
    props.frameNumber += 1
    t = s.map(props.frameNumber, 0, props.numberOfFrames, 0, 1)
  
    let patternWidth = (props.width - 2 * props.marginX)
    let patternHeight = (props.height - 2 * props.marginY)

    squareGrid(s, {},
      props.marginX, 
      props.marginY,
      patternWidth,
      patternHeight,
      props.countX,
      props.countY,
      drawOne
    )
  
    if (props.drawGrid) {
      squareGridLines(
        s,
        {},
        props.marginX, 
        props.marginY,
        patternWidth,
        patternHeight,
        props.countX,
        props.countY,
        props.grid
      )
    }
    s.endFrame();
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  const drawOne = (s, options, originX, originY, cellWidth, cellHeight, seqX, seqY, percentX, percentY) => {
    s.push();
    s.translate(originX + cellWidth / 2, originY + cellHeight / 2);
    s.fill(props.foreground);
    s.ellipse(0, 0, cellWidth * props.widthScale - (seqX * props.mutateX), cellHeight * props.heightScale - (seqY * props.mutateY));
    s.pop();
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  const setupProperties = () => {
    var Properties = function() {
      this.width = 480
      this.height = 360
      this.marginX = 68
      this.marginY = 8
  
      this.countX = 8;
      this.countY = 8;
      this.widthScale = 0.95;
      this.heightScale = 0.95;
      this.mutateX = 4
      this.mutateY = 5
      this.foreground = '#ffffff'
      this.background = '#202020'
  
      this.animate = true
      this.frameNumber = 0

      this.numberOfFrames = 120;
    };
    
    props = new Properties();
  
    let gui = new dat.GUI({closed: true, autoPlace: false, width: 320})
    gui.closed = false;
  
    gui.add(props, 'marginX',  0, 200).step(1);
    gui.add(props, 'marginY',  0, 200).step(1);
  
    gui.add(props, 'countX', 1, 16).step(1);
    gui.add(props, 'countY', 1, 16).step(1);
  
    gui.add(props, 'widthScale', 0.5, 1.5).step(0.1);
    gui.add(props, 'heightScale', 0.5, 1.5).step(0.1);
    gui.add(props, 'mutateX', -10, 10).step(0.5);
    gui.add(props, 'mutateY', -10, 10).step(0.5);

    gui.add(props, 'animate')
    gui.add(props, 'frameNumber', 0, props.numberOfFrames).step(1)

    let sampling = gui.addFolder('Recording')
    sampling.add(props, 'samplesPerFrame', 1, 4).step(1);
    sampling.add(props, 'numberOfFrames', 1, 180).step(1);
  
    document.querySelector('#controls').appendChild(gui.domElement);
  }
  


  //////////////////////////////////////////////////////////////////////////////////////////////////

  s.setup = () => {
    setupProperties()

    p5canvas = s.createCanvas(props.width, props.height);
    p5canvas.parent("container");
    canvas = document.querySelector('#' + p5canvas.id())
    s.frameRate(props.frameRate);
    
    s.pixelDensity(2);
    s.smooth(8);
    s.fill(32);
    s.rectMode(s.CENTER);
    s.blendMode(s.ADD);
    s.noStroke();

    _capturer = new Capturer(canvas, canvas.width, canvas.height, props.frameRate, props.numberOfFrames, 'animation')

    document.querySelector('#capture').addEventListener('click', e => {
      props.frameNumber = 0
      _capturer.enableCapture()
      _capturer.start()
      e.preventDefault()
      return false;
    })
  }

  s.startFrame = () => {
    s.clear();
    s.background(props.background);
  }

  s.endFrame = () => {
    _capturer.captureFrame()
  }
})



