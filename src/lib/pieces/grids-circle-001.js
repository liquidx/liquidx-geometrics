import p5 from "p5";
import Capturer from "../parts/capturer.js";
import { Properties } from "../parts/props.js";

import { squareGrid, squareGridLines } from "../parts/grids.js";
import { onePolyCircle } from "../parts/polys.js";

// The canvas.

// eslint-disable-next-line no-unused-vars
const sketch = (parentEl, initialProps) => {
  let canvas = null;
  let _capturer = null;
  let _p5canvas = null;
  let props = null;

  const sketch = new p5((s) => {
    s.draw = () => {
      s.startFrame();

      if (props.animate) {
        props.frameNumber += 1;
      }

      let patternWidth = props.width - 2 * props.marginX;
      let patternHeight = props.height - 2 * props.marginY;

      const transform = (context, cell, seq) => {
        context.cellWidthTransform = seq.x * context.cellVaryX;
        context.cellHeightTransform = seq.y * context.cellVaryY;
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

        onePolyCircle,
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
        cellVaryX: -3,
        cellVaryY: -3,

        scaleWidth: 0.8,
        scaleHeight: 0.8,
      });
      let gui = props.registerDat((props, gui) => {
        gui.add(props, "scaleWidth", 0.5, 1.5).step(0.1);
        gui.add(props, "scaleHeight", 0.5, 1.5).step(0.1);
      });
      document.querySelector("#controls").appendChild(gui.domElement);
    };

    //////////////////////////////////////////////////////////////////////////////////////////////////

    s.setup = () => {
      setupProperties(s, initialProps);
      _p5canvas = s.createCanvas(props.width, props.height);
      _p5canvas.parent(parentEl);
      canvas = document.querySelector("#" + _p5canvas.id());
      s.frameRate(props.frameRate);

      s.pixelDensity(props.pixelDensity);
      s.smooth(8);
      s.fill(props.background);
      s.rectMode(s.CENTER);
      s.blendMode(s.ADD);
      s.noStroke();

      _capturer = new Capturer(
        canvas,
        canvas.width,
        canvas.height,
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

  return {
    sketch,
  };
};

export default sketch;
