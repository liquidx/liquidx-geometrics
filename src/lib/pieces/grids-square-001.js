import { Properties } from "../parts/props.js";
import Capturer from "../parts/capturer.js";

import { squareGrid, squareGridLines } from "../parts/grids.js";
import { onePolySquare } from "../parts/polys.js";

const sketch = (s, parentEl, initialProps) => {
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
      let t = s.map(context.frameNumber, 0, context.numberOfFrames, 0, 1);
      let timeBasedWidthScale =
        context.animatedScaleWidth + s.sin(s.TWO_PI * t) * 0.5;
      context.cellWidth =
        (cell.w - (seq.x + seq.y) * timeBasedWidthScale) * context.scaleWidth;
      return context;
    };

    squareGrid(
      s,
      props,

      props.marginX,
      props.marginY,
      patternWidth,
      patternHeight,
      props.count,
      props.count,

      onePolySquare,
      transform
    );

    if (props.drawGrid) {
      squareGridLines(
        s,
        props,
        props.marginX,
        props.marginY,
        patternWidth,
        patternHeight,
        props.count,
        props.count,
        props.grid
      );
    }
    s.endFrame();
  };

  //////////////////////////////////////////////////////////////////////////////////////////////////
  const setupProperties = async (s) => {
    props = new Properties(s, {
      count: 10,
      animatedScaleWidth: 1,
      scaleWidth: 0.8,
      corner: 4,
    });

    let gui = await props.registerDat((props, gui) => {
      gui.add(props, "count", 1, 32).step(1);
      gui.add(props, "scaleWidth", 0.5, 1.5).step(0.05);
      gui.add(props, "animatedScaleWidth", -10, 10).step(0.5);
      gui.add(props, "corner", 0, 10).step(0.5);
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
