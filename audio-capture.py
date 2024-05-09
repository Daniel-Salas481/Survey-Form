import pyaudio
import wave

#defining object
audio = pyaudio.PyAudio()

#opening new stream
stream = audio.open(format=pyaudio.paInt16, channels=1, rate=44100, 
                    input=True, frames_per_buffer=1024)


frames = []



try:
    while True:
        #reading datas chunk size
        data = stream.read(1024)
        #appending data to frames list
        frames.append(data)
#end our stream with a keyboard interrupt
except KeyboardInterrupt:
    pass


#ending our stream
stream.stop_stream()
stream.close()
audio.terminate()



sound_file = wave.open("audio.wav", "wb")
sound_file.setnchannels(1)
sound_file.setsampwidth(audio.get_sample_size(pyaudio.paInt16))
sound_file.setframerate(44100)
#combining each frames into o
sound_file.writeframes(b''.join(frames))
