import os
from google.cloud import storage
from pathlib import Path

#setting up enviorm 
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'key.json'

#creating storage client instance
storage_client = storage.Client()



#Create Bucket
'''
bucket_name = 'data_bucket87481'
bucket = storage_client.bucket(bucket_name)
bucket.location = 'US'
bucket = storage_client.create_bucket(bucket)
'''

#Access Bucket

my_bucket = storage_client.get_bucket('data_bucket87481') 
print(Path.cwd())

#Upload Audio file to bucket
def upload_to_bucket(blob_name, file_path, bucket_name):
    try:
        bucket = storage_client.get_bucket(bucket_name)
        blob = bucket.blob(blob_name)
        blob.upload_from_filename(file_path)
        return True
    #return False
    except Exception as e:
        print(e)
        return False
    

file_path = '/Users/danielsalas/Documents/Survey-Form/'
upload_to_bucket('audio.wav', os.path.join(file_path, 'audio.wav'), 'data_bucket87481')