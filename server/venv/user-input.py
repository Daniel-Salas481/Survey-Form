from server.venv.audio_capture import *
from server.venv.text_to_speech import *
from server.venv.dictToJson import *

userName = input("Enter your First Name: ")
lastName = input("Enter your Last Name: ")
dateOfBirth = int(input("Enter your age: "))

voiceResponse = audio_capture()

#we want to obtain the text-to-speech
#print(voiceResponse)

feedback = text_to_speech()

toJson = dictToJson(userName, lastName, dateOfBirth, feedback)

print("Information was sucussfully saved!")