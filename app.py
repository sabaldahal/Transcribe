import os, sys
import eel
import filehandler
import processLists
import transcribehandler

APP_NAME = "eel proto"
#sys.path.insert(0, '../${APP_NAME}')
#sys.path.insert(1, '../../')


eel.init('src', allowed_extensions=['.js', '.html'])

#eel.start('index.html')
eel.start('index.html')   # Start (this blocks and enters loop)

