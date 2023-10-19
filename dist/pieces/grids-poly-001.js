import p5 from "p5";
import _ from "lodash";
import Capturer from "../parts/capturer.js";
import { Properties } from "../parts/props.js";

import { squareGrid, squareGridLines } from "../parts/grids.js";
import { onePolyCircle, onePolyConcentricCircle } from "../parts/polys.js";

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

      const contextTransform = (context) => {
        context.t = s.map(context.frameNumber, 0, context.numberOfFrames, 0, 1);
        return context;
      };

      squareGrid(
        // basic drawing
        s,
        props,

        // cell information
        props.marginX,
        props.marginY,
        patternWidth,
        patternHeight,
        props.countX,
        props.countY,

        // drawing methods
        onePolyCircle,
        contextTransform
      );

      if (props.drawGrid) {
        squareGridLines(
          s,
          context,
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

    // eslint-disable-next-line no-unused-vars
    const drawOne = (
      s,
      context,
      originX,
      originY,
      cellWidth,
      cellHeight,
      seqX,
      seqY,
      percentX,
      percentY
    ) => {
      s.push();
      s.translate(originX + cellWidth / 2, originY + cellHeight / 2);
      s.rotate(s.TWO_PI * context.t);
      s.rotate(s.TWO_PI * context.cellVaryX * percentX);
      s.rotate(s.TWO_PI * context.cellVaryY * percentY);

      if (props.stroke) {
        s.strokeWeight(2);
        s.stroke(props.foreground);
        s.noFill();
      } else {
        s.fill(props.foreground);
        s.noStroke();
      }

      s.beginShape();
      let radius = Math.min(cellWidth / 2, cellHeight / 2) - context.cellInset;
      let ax = 0;
      let ay = -radius;
      let bx = ax * s.cos(s.TWO_PI / 3) - ay * s.sin(s.TWO_PI / 3);
      let by = ax * s.sin(s.TWO_PI / 3) + ay * s.cos(s.TWO_PI / 3);
      let cx = ax * s.cos((s.TWO_PI * 2) / 3) - ay * s.sin((s.TWO_PI * 2) / 3);
      let cy = ax * s.sin((s.TWO_PI * 2) / 3) + ay * s.cos((s.TWO_PI * 2) / 3);
      s.vertex(ax, ay);
      s.vertex(bx, by);
      s.vertex(cx, cy);
      s.endShape(s.CLOSE);

      s.pop();
    };

    //////////////////////////////////////////////////////////////////////////////////////////////////
    const setupProperties = (s) => {
      props = new Properties(s);
      let gui = props.registerDat();
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
  return {
    sketch,
  };
};

export default sketch;
