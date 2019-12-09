import p5 from 'p5'
import dat from 'dat.gui'

window.dat = dat

// By doing this, it will put all p5 vars in to global.
new p5()

window.COLORS = {
  black: '#000000',
  darkgrey: '#333333',
  white: '#d0d0d0',
  red: '#B71C1C',
  orange: '#E64A19',
  orange_light: '#FF5722',
  orange_verylight: '#FF8A65',
};

window.PASTELS = {
  red: '#FF6865',
  orange: '#FFA985',
  yellow: '#FFF491',
  green: '#85CC9F',
  blue: '#92D1C7'
};

window.ORANGE = {
  primary: '#FF6600',
  secondary: '#C13B00',
  black: '#1B1D1E',
  grey: '#424E4F'
};

window.CANVAS = {
  width: 360,
  height: 360
};


window.recordedBlobs = []

window.CAPTURER = {
  canvas: null,
  frameRate: 30,
  duration: 1,
  captureFrameCount: 0,
  capturedFrameIndex: 0,
  started: false,
  
  init: function(canvas, width, height, frameRate, duration) {
    this.canvas = canvas;
    this.frameRate = frameRate;
    this.duration = duration;
    this.width = width
    this.height = height

    this.stream = null
    this.mediaRecorder = null

    // use hash to start or abort capture.
    var hasCapture = window.location.hash.match(/capture/);
    if (hasCapture) {
      this.captureFrameCount = frameRate * duration
      this.stream = this.canvas.captureStream()
    }
  },

  start: function() {
    if (this.stream && !this.started) {
      this.mediaRecorder = new MediaRecorder(
        this.stream, 
        {mimeType: 'video/webm', videoBitsPerSecond: 4000000})
      this.mediaRecorder.onstop = this.onStop
      this.mediaRecorder.ondataavailable = this.onDataAvailable
      this.mediaRecorder.start()
      this.started = true
    }
  },

  onStop: function() {
    const blob = new Blob(window.recordedBlobs, {type: 'video/webm'});
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'test.webm';
    document.body.appendChild(a)
    a.click();
    window.URL.revokeObjectURL(url);
  },

  onDataAvailable: function(event) {
    if (event.data && event.data.size > 0) {
      window.recordedBlobs.push(event.data);
    }
  },
  
  captureFrame: function(canvas) {    
    if (this.mediaRecorder && this.captureFrameCount) {
      this.capturedFrameIndex++
      this.captureFrameCount--
      if (this.captureFrameCount == 0) {
        this.mediaRecorder.stop()
      }
    }
  },

  ffmpegCommand: function() {
    let width = this.width * pixelDensity()
    let height = this.height * pixelDensity()
    return `ffmpeg -r ${this.frameRate} -f image2 -pattern_type glob -i canvas\\*.png -s ${width}x${height} -vcodec libx264 -crf 5 -framerate ${this.frameRate} -vb 20M -pix_fmt yuv420p -tune stillimage animation.mp4`
  }
};
