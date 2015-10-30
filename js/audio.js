(function() {
  var audio, request, url;

  try {
    audio = new AudioContext();
  } catch (_error) {}

  url = 'data/music.mp3';

  request = new XMLHttpRequest();

  request.open('GET', url, true);

  request.responseType = "arraybuffer";

  request.onload = function() {
    return audio.decodeAudioData(request.response).then(function(buffer) {
      var analyser, source, sourceJs;
      source = audio.createBufferSource();
      source.buffer = buffer;
      source.connect(audio.destination);
      sourceJs = audio.createScriptProcessor(2048, 1, 1);
      sourceJs.buffer = buffer;
      analyser = audio.createAnalyser();
      analyser.smoothingTimeConstant = 1;
      analyser.fftSize = 512;
      source.connect(analyser);
      analyser.connect(sourceJs);
      analyser.connect(myVisualizer);
      sourceJs.onaudioprocess = function(e) {
        var array;
        array = new Uint8Array(analyser.frequencyBinCount);
        return analyser.getByteFrequencyData(array);
      };
      source.loop = true;
    });
  };

  request.send();

  return audio;

}).call(this);
