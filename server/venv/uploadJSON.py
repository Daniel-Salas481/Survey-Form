import time
import json
import os
from google.cloud import bigquery


os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'key.json'

#Flattening JSON record
json_data = json.load(open('user.json'))
data_file_path = 'user.json'


#Constructing BigQuery client object
client = bigquery.Client()

#construct table reference
table_id = 'python-text-to-speech-87750.user_survey.userSet'

#defining table schema

job_config = bigquery.LoadJobConfig(

    schema = [
        bigquery.SchemaField("first_name", "STRING"),
        bigquery.SchemaField("last_name", "STRING"),
        bigquery.SchemaField("age", "INT64"),
        bigquery.SchemaField("feedback", "STRING")
    ],
    source_format=bigquery.SourceFormat.NEWLINE_DELIMITED_JSON,
    write_disposition='WRITE_APPEND'
)

# Upload Json Data file to big query
with open(data_file_path, "rb") as source_file:
    job = client.load_table_from_file(source_file, table_id, job_config=job_config)

while job.state != 'DONE':
    job.reload()
    time.sleep(2)
print(job.result())
