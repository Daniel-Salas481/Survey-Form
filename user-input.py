from audio_capture import *
from text_to_speech import *
from dictToJson import *

userName = input("Enter your First Name")
lastName = input("Enter your Last Name")
dateOfBirth = int(input("Enter your age"))

voiceResponse = audio_capture()

#we want to obtain the text-to-speech
#print(voiceResponse)

feedback = text_to_speech()

user['first_name'] = userName
user['last_name'] = lastName
user['age'] = dateOfBirth
user['feedback'] = feedback

print(user)