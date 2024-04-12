import eel
import time
import transcribehandler
from threading import Thread
import pandas as pd

@eel.expose
def getFilesToTranscribe(files):
    thread = Thread(target = TranscribeAllFiles, args = (files, ))
    thread.start()



def TranscribeAllFiles(files):
    for file in files:
        print("processing file: ", file)
        #send message to UI: file processing
        eel.CurrentlyProcessingFile(file)
        startTranscribe(file)
        #send message to UI: file processing finished
        eel.AddToProcessedList(file)

def startTranscribe(file):
    transcribehandler.transcribe(file)


#get data from client and make changes to the csv file
@eel.expose
def getCSVDataToExport(data, filename):
    df = pd.read_csv(filename, sep='\t')
    for item in data:
        id = int(item["id"])
        segment_id = int(item["segment_id"])
        word = item["word"]

        #get the segment from the dataframe
        #and modify it
        sentence = df.iloc[segment_id, 2]
        words = sentence.split()
        changeWordAt = (id-segment_id) - 1
        words[changeWordAt] = word
        modified_sentence = ' '.join(words)
        #update the modified sentence into the segment
        #and word into the word type
        df.iloc[segment_id,2] = modified_sentence
        df.iloc[id, 2] = word
    df.to_csv(f"{filename}",sep="\t", index=False)
