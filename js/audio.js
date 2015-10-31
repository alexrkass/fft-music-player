(function() {
  var context, request, url, analyser, source, sourceJs, playerdiv, playpausediv, visualiserdiv, started, startOffset, startTime, buffer;

  //FIRST, CREATE AUDIO PIPELINE AND GRAB MUSIC
  //////////////////////////////////////////////////////////////////////////////
  context = new AudioContext();
  url = 'data/music.mp3';
  request = new XMLHttpRequest();

  request.open('GET', url, true);
  request.responseType = "arraybuffer";

  request.onload = function() {
     context.decodeAudioData(request.response, function(decodedData) {
      buffer = decodedData;
      startOffset = 0;
      startTime = 0;

      sourceJs = context.createScriptProcessor(0, 1, 1); //buffersize (0 is default), input channels, output channels
      sourceJs.buffer = buffer;

      analyser = context.createAnalyser();
      analyser.smoothingTimeConstant = 1;
      analyser.fftSize = 512;

      sourceJs.connect(analyser);

      sourceJs.onaudioprocess = function(e) {
        var array = new Uint8Array(analyser.fftSize);
        analyser.getByteFrequencyData(array);

      };
    });
  };
  request.send();

  //THEN, CREATE THE UI, STARTING WITH THE PLAY/PAUSE BUTTON
  //////////////////////////////////////////////////////////////////////////////
  playerdiv = document.querySelector(".player");
  playpausediv = document.createElement('button');
  playpausediv.classList.add("playpause");
  playerdiv.appendChild(playpausediv);
  started = false;
  var PlayButtonToggle = function(){
    if (started === false){
      startTime = context.currentTime;
      source = context.createBufferSource();
      source.buffer = buffer;
      source.connect(context.destination);
      source.start(0,startOffset % buffer.duration);
      started = true;
    } else {
      source.stop();
      startOffset += context.currentTime - startTime;
      started = false;
    }
  }
 playpausediv.addEventListener("click", PlayButtonToggle);

  //THEN, CREATE THE VISUALISER LAYER
  //////////////////////////////////////////////////////////////////////////////
  visualiserdiv = document.createElement('div');
  playerdiv.appendChild(visualiserdiv);
  visualiserdiv.classList.add("visualiser");
}).call(this);
