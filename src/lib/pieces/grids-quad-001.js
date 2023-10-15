import { Properties } from "../parts/props.js";
import Capturer from "../parts/capturer.js";

import { onePolyParallelogram } from "../parts/polys.js";
import { squareGrid, squareGridLines } from "../parts/grids.js";

const sketch = async (s, parentEl, initialProps) => {
  let _canvas = null;
  let _capturer = null;
  let _p5canvas = null;
  let props = null;

  s.draw = () => {
    s.startFrame();
    if (props.animate) {
      props.frameNumber += 1;
    }

    let patternWidth = props.width - 2 * props.marginX;
    let patternHeight = props.height - 2 * props.marginY;

    const transform = (context, cell, seq) => {
      context.t = s.map(props.frameNumber, 0, props.numberOfFrames, 0, 1);
      let timeShiftX = s.sin(s.TWO_PI * context.t);
      let timeShiftY = s.sin(s.TWO_PI * context.t);
      context.shiftX =
        context.cellVaryMag * seq.percentX * context.cellVaryX * timeShiftX;
      context.shiftY =
        context.cellVaryMag * seq.percentY * context.cellVaryY * timeShiftY;
      if (context.alternateRows) {
        if (seq.y % 2 == 1) {
          context.shiftX = context.shiftX * -1;
          context.shiftY = context.shiftY * -1;
        }
      }
      context.widthMultiplier = 2 + s.cos(s.TWO_PI * context.t);
      return context;
    };

    squareGrid(
      s,
      props,

      props.marginX,
      props.marginY,
      patternWidth,
      patternHeight,
      props.countX,
      props.countY,

      onePolyParallelogram,
      transform
    );

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
      );
    }
    s.endFrame();
  };

  //////////////////////////////////////////////////////////////////////////////////////////////////
  const setupProperties = async (s) => {
    props = new Properties(s, {
      countX: 12,
      countY: 12,

      cellInset: 2,
      cellVaryX: 1,
      cellVaryY: 3,

      cellVaryMag: 2,
      alternateRows: false,
    });

    let gui = await props.registerDat((props, gui) => {
      gui.add(props, "cellVaryMag", 0, 10).step(1);
      gui.add(props, "alternateRows");
    });

    document.querySelector("#controls").appendChild(gui.domElement);
  };

  //////////////////////////////////////////////////////////////////////////////////////////////////

  s.setup = () => {
    setupProperties(s, initialProps);

    _p5canvas = s.createCanvas(props.width, props.height);
    _p5canvas.parent(parentEl);
    _canvas = document.querySelector("#" + _p5canvas.id());
    s.frameRate(props.frameRate);

    s.pixelDensity(props.pixelDensity);
    s.smooth(8);
    s.fill(props.background);
    s.rectMode(s.CENTER);
    s.blendMode(s.ADD);
    s.noStroke();

    _capturer = new Capturer(
      _canvas,
      _canvas.width,
      _canvas.height,
      props.frameRate,
      props.numberOfFrames,
      "animation"
    );

    _capturer.activateLink(document.querySelector("#capture"), () => {
      props.frameNumber = 0;
    });

    props.activateLink(document.querySelector("#share"), () => {});
  };

  s.startFrame = () => {
    s.clear();
    s.background(props.background);
  };

  s.endFrame = () => {
    _capturer.captureFrame();
  };
};

export default sketch;
