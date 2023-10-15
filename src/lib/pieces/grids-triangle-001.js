import p5 from "p5";

import { Properties } from "../parts/props.js";
import Capturer from "../parts/capturer.js";

import { squareGrid, squareGridLines } from "../parts/grids.js";
import { onePolyTriangleSimple } from "../parts/polys.js";

const sketch = (parentEl, initialProps) => {
  let _canvas = null;
  let _capturer = null;
  let _p5canvas = null;
  let props = null;

  // eslint-disable-next-line no-unused-vars
  let sketch = new p5((s) => {
    s.draw = () => {
      s.startFrame();
      if (props.animate) {
        props.frameNumber += 1;
      }

      let patternWidth = props.width - 2 * props.marginX;
      let patternHeight = props.height - 2 * props.marginY;

      const transform = (context, cell, seq) => {
        context.t = s.map(context.frameNumber, 0, context.numberOfFrames, 0, 1);
        context.timeShiftX = 1 + s.sin(s.TWO_PI * context.t);
        context.timeShiftY = 1 + s.cos(s.TWO_PI * context.t);
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
        onePolyTriangleSimple,
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
    const setupProperties = (s) => {
      props = new Properties(s, {
        triangleType: "tl-tr-bl",
        cellVaryZ: 0,
      });

      let gui = props.registerDat((props, gui) => {
        gui.add(props, "triangleType", ["tl-tr-bl", "tm-br-bl"]);
        gui.add(props, "cellVaryZ", -10, 10).step(0.01);
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
  });
  return { sketch, props };
};

export default sketch;
