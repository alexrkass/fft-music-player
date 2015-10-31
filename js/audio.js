(function() {
  var audio, request, url, analyser, source, sourceJs, visualisercontainer, playbuttoncontainer;

  //FIRST, CREATE AUDIO PIPELINE AND GRAB MUSIC
  audio = new AudioContext();
  url = 'data/music.mp3';
  request = new XMLHttpRequest();

  request.open('GET', url, true);
  request.responseType = "arraybuffer";

  request.onload = function() {
     audio.decodeAudioData(request.response, function(decodedData) {
      source = audio.createBufferSource();
      source.buffer = decodedData;
      source.connect(audio.destination);

      sourceJs = audio.createScriptProcessor(0, 1, 1); //buffersize (0 is default), input channels, output channels
      sourceJs.buffer = decodedData;

      analyser = audio.createAnalyser();
      analyser.smoothingTimeConstant = 1;
      analyser.fftSize = 512;

      source.connect(analyser);

      sourceJs.onaudioprocess = function(e) {
        var array = new Uint8Array(analyser.fftSize);
        analyser.getByteFrequencyData(array);
      };
    });
  };
  request.send();

  //THEN, CREATE THE UI
  visualisercontainer = document.querySelector(".visualiser");
  playbuttoncontainer = document.createElement('button');
  visualisercontainer.appendChild(playbuttoncontainer);
}).call(this);
