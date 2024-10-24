import whisper_timestamped as whisper
import json
import pandas as pd
import platform
import mlx_whisper

#paths = glob.glob("*.mp3")

def transcribe(path): 
    #Mac's kernel is identified as Darwin   
    if platform.system() == "Darwin":
        transcribe_Platform_Mac(path)
    else:
         transcribe_Platform_All(path)

def transcribe_Platform_Mac(path):
    print("Apple System Detected. Now using MLX_Whisper Model")
    result = mlx_whisper.transcribe(path,  word_timestamps=True)

    dotindex = path.rfind('.')   
    new_path = path[:dotindex] 

    with open(f"{new_path}.json", "w") as f:
        print(json.dumps(result, indent=2, ensure_ascii=False), file=f)

    columns = ["type","word","start","end","confidence"]

    with open(f"{new_path}.json", "r") as file:
        df = pd.DataFrame(columns=columns)
        transcript = json.load(file)
        df.loc[len(df.index)] = [
                "text",
                transcript["text"],
                "",
                "",
                "",
        ]
        for segment in transcript["segments"]:
                df.loc[len(df.index)] = [
                    "segment",
                    segment["text"],
                    segment["start"],
                    segment["end"],
                    0.0,
                ]
                for word in segment["words"]:
                    df.loc[len(df.index)] = [
                            "word",
                            word["word"],
                            word["start"],
                            word["end"],
                            word["probability"],
                    ]        
        df.to_csv(f"{new_path}.csv",sep="\t")
def transcribe_Platform_All(path):
    audio = whisper.load_audio(path)
    #model: https://huggingface.co/openai/whisper-large-v2
    model = whisper.load_model("openai/whisper-large-v2", device="cpu")
    result = whisper.transcribe(model, audio, language="en")

    dotindex = path.rfind('.')   
    new_path = path[:dotindex] 


    with open(f"{new_path}.json", "w") as f:
        print(json.dumps(result, indent=2, ensure_ascii=False), file=f)
    ## format transcripts for review
    columns = ["type","word","start","end","confidence"]


    with open(f"{new_path}.json", "r") as file:
        df = pd.DataFrame(columns=columns)
        transcript = json.load(file)
        df.loc[len(df.index)] = [
                "text",
                transcript["text"],
                "",
                "",
                "",
        ]
        for segment in transcript["segments"]:
                df.loc[len(df.index)] = [
                    "segment",
                    segment["text"],
                    segment["start"],
                    segment["end"],
                    segment["confidence"],
                ]
                for word in segment["words"]:
                    df.loc[len(df.index)] = [
                            "word",
                            word["text"],
                            word["start"],
                            word["end"],
                            word["confidence"],
                    ]        
        df.to_csv(f"{new_path}.csv",sep="\t")