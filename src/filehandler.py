import eel
import tkinter as tk
from tkinter import filedialog



@eel.expose
def getFiles():
    #get files to transcribe

    root = tk.Tk()      
    root.wm_attributes('-topmost', True)  
    root.lift()
    root.withdraw()
    file_path = filedialog.askopenfilenames(title="Select Audio File", filetypes=[("Audio files", "*.mp3")])
    return file_path

@eel.expose
def getCSVFiles():
    #get CSV files manually
    root = tk.Tk()      
    root.wm_attributes('-topmost', True)  
    root.lift()
    root.withdraw()
    file_path = filedialog.askopenfilenames(title="Select CSV File", filetypes=[("CSV files", "*.csv")])
    return file_path

@eel.expose
def getCSVFileContents(filename):
    with open(filename, 'r') as file:
        file_contents = file.read()
    return file_contents