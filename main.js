window.AudioContext = window.AudioContext || window.webkitAudioContext;
navigator.mediaDevices.getUserMedia(
    {
        audio: {
            mandatory: {
                googEchoCancellation: 'false',
                googAutoGainControl: 'false',
                googNoiseSuppression: 'false',
                googHighpassFilter: 'false',
            },
        },
    }).then(startRecording)
    .catch(e => {
        /* If there are some errors with parameter configurations or 
        user didn’t give you the access to the microphone inside the browser, you end here. */
        console.log(e);
    }
    );

function startRecording(stream, callback) {
    audioContext = audioContext || new AudioContext();
    if (!audioContext) {
        return;
    }
    myStream = stream;

    // AudioNode used to control the overall gain (or volume) of the audio graph

    const inputPoint = audioContext.createGain();
    const microphone = audioContext.createMediaStreamSource(myStream);
    const analyser = audioContext.createAnalyser();
    scriptProcessor = inputPoint.context.createScriptProcessor(2048, 2, 2);

    microphone.connect(inputPoint);
    inputPoint.connect(analyser);
    inputPoint.connect(scriptProcessor);
    scriptProcessor.connect(inputPoint.context.destination);
    // This is for registering to the “data” event of audio stream, without overwriting the default scriptProcessor.onAudioProcess function if there is one.
    scriptProcessor.addEventListener('audioprocess', streamAudioData);
}


const streamAudioData = e => {
    const floatSamples = e.inputBuffer.getChannelData(0);

    // HERE GOES THE CODE TO SEND THE CHUNKED DATA FROM STREAM
};

if (myStream) {
    // stop the browser microphone
    myStream.getTracks()[0].stop();
    myStream = null;
}

if (scriptProcessor) {
    // Stop listening the stream from the michrophone
    scriptProcessor.removeEventListener('audioprocess', streamAudioData);
}


const ConversionFactor = 2 ** (16 - 1) - 1; // 32767
const streamAudioData = e => {
    const floatSamples = e.inputBuffer.getChannelData(0);
    


if (socket && socket.readyState === socket.OPEN) {
    socket.send(Int16Array.from(floatSamples.map(n => n * MAX_INT)));
}
};

//////////////// GOOGLE CLOUD/SPEECH
async function main() {
    // Imports the Google Cloud client library
    const speech = require('@google-cloud/speech');
    const fs = require('fs');
  
    // Creates a client
    const client = new speech.SpeechClient();
  
    // The name of the audio file to transcribe
    const fileName = './resources/audio.raw';
  
    // Reads a local audio file and converts it to base64
    const file = fs.readFileSync(fileName);
    const audioBytes = file.toString('base64');
  
    // The audio file's encoding, sample rate in hertz, and BCP-47 language code
    const audio = {
      content: audioBytes,
    };
    const config = {
      encoding: 'LINEAR16',
      sampleRateHertz: 16000,
      languageCode: 'en-US',
    };
    const request = {
      audio: audio,
      config: config,
    };
  
    // Detects speech in the audio file
    const [response] = await client.recognize(request);
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');
    console.log(`Transcription: ${transcription}`);
  }
  main().catch(console.error);