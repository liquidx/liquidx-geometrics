import Capturer from "../parts/capturer.js";
import { Properties } from "../parts/props.js";

import { squareGrid, squareGridLines } from "../parts/grids.js";
import { onePolyConcentricCircle } from "../parts/polys.js";

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
      context.t = s.map(context.frameNumber, 0, context.numberOfFrames, 0, 1);
      context.strokeCount =
        (seq.y * context.countX + seq.x) * context.strokesMultiplier +
        1 +
        context.initialStrokes;
      context.circleRadius =
        ((Math.min(cell.w, cell.h) - context.spacing) / 2) *
        context.radiusMultiplier;
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

      onePolyConcentricCircle,
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
    let extraProps = {
      countX: 2,
      countY: 2,
      animate: false,
      stroke: true,

      spacing: 10,
      radiusMultiplier: 1.0,
      initialStrokes: 1,
      strokesMultiplier: 1,
    };

    for (let key in initialProps) {
      extraProps[key] = initialProps[key];
    }

    props = new Properties(s, extraProps);

    let gui = await props.registerDat((props, gui) => {
      gui.add(props, "spacing", 0, 64).step(1);
      gui.add(props, "radiusMultiplier", 0, 4);
      gui.add(props, "initialStrokes", 0, 10).step(1);
      gui.add(props, "strokesMultiplier", 0, 10).step(1);
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
