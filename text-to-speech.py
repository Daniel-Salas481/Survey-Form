from google.cloud import speech


client = speech.SpeechClient.from_service_account_file('key.json')

#file name changing soon
file_name = "AudioTest.mp3"

with open(file_name, 'rb') as f:
    mp3_data = f.read()

#Obtaining data from mp3 file
audio_file = speech.RecognitionAudio(content=mp3_data)


#Configuration of the audio text-to-speech
config = speech.RecognitionConfig(

    sample_rate_hertz=44100,
    enable_automatic_punctuation = True,
    language_code = 'en-US'

)


response = client.recognize(
    config=config,
    audio=audio_file
)

'''
for result in response.results:
    print("Transcript : {} ".format(result.alternatives[0]transcript))
'''
print(response)