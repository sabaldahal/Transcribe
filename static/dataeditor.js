var confidenceThreshold = 0.65;
var TableData = [];
var SegmentList = [];
var unsavedChanges = false;
var csvString;
var CSVFilePath;

const addCSVManuallyButton = document.querySelector('#add-csv-manually-button');
var exportDataButton;
var changeThresholdForm;

const CloseResultsEditor = () =>{
    unsavedChanges = false;
    csvString = '';
    CSVFilePath = '';
    TableData = [];
    SegmentList = [];
    confidenceThreshold = 0.65;
    pauseAudio();
}

const AddEventToData = () => {
    var playbuttons = document.querySelectorAll("table #play");
    playbuttons.forEach(playbutton => {
        playbutton.addEventListener('click', (e) => {
            if(isAudioPlaying()){
                pauseAudio();
            }else{
                let cell = e.target.closest('td');
                let row = e.target.closest('tr');
                let segmentplay = row.dataset.segmentplay;
                let id_attr = row.getAttribute('data-id');
                let starttime;
                let endtime;
                if(segmentplay == 'true'){
                    let id = getSegmentIdFromWordId(id_attr);
                    let target_segment = SegmentList.find(ele => ele.id == id);
                    starttime = parseFloat(target_segment.starttime);
                    endtime = parseFloat(target_segment.endtime);
                }else{
                     starttime = parseFloat(playbutton.dataset.start);
                     endtime = parseFloat(playbutton.dataset.end);
                }
                updateAudioCurrentTime(starttime);
                updateInitialTime(starttime);
                upddateTotalDuration(endtime);
                playAudio();
            }
            
        });
    })
}

//get segment from the ID of the WORD given
//not to be confused with the segment id
const getSegmentFromId = (id_attribute) => {
    let id = parseFloat(id_attribute);
    for(let i=0; i<SegmentList.length - 1; i++){
        let curr = parseFloat(SegmentList[i].id);
        let forw = parseFloat(SegmentList[i+1].id);

        if((id > curr) && (id < forw)){

            return SegmentList[i].segment;
        }else if((id > curr) && (i == SegmentList.length - 2)){
            return SegmentList[i+1].segment;
        }
    }
}

const getSegmentIdFromWordId = (id_attribute)=>{
    let id = parseFloat(id_attribute);

    for(let i=0; i<SegmentList.length - 1; i++){
        let curr = parseFloat(SegmentList[i].id);
        let forw = parseFloat(SegmentList[i+1].id);

        if((id > curr) && (id < forw)){
            return curr;
        }else if((id > curr) && (i == SegmentList.length - 2)){
            return forw;
        }
    }
}

const PopulateSegmentList = () =>{
    var rows = csvString.split('\n');
    for(let i=0; i<rows.length; i++){
        let columns = rows[i].split('\t');
        let rowdatatype = columns[1];
        if(!(rowdatatype == "segment")) continue;
        let id = columns[0];
        let segment = columns[2]; 
        var starttime = columns[3];
        var endtime = columns[4];
        SegmentList.push({
            id: id,
            segment: segment,
            starttime: starttime,
            endtime: endtime
        })
    }
}

const AddSegmentRowToTable = (tablebody, segId)=>{
    let segrow = tablebody.insertRow();
    let segment = SegmentList.find(seg => seg.id == segId);
    segrow.style.backgroundColor = "#a6a6a6";

    segrow.setAttribute('data-id', segment.id);
    segrow.setAttribute('data-starttime', segment.starttime);
    segrow.setAttribute('data-endtime', segment.endtime);
    segrow.setAttribute('data-segmentplay', false);

    let cell_confidence = segrow.insertCell();
    let cell_controls = segrow.insertCell();
    let cell_playbutton = segrow.insertCell();
    let cell_data = segrow.insertCell();

    cell_confidence.textContent = "--";
    cell_controls.textContent = "--";
    cell_playbutton.innerHTML = `
    <button id="play" class="action" data-start=${segment.starttime} data-end=${segment.endtime}>
    <i class="fa-solid fa-circle-play"></i>
    </button>
                `;

    cell_data.textContent = segment.segment;
}

function AddCSVToTable() {
    var tableBody = document.querySelector("#data-editor-table tbody");
    tableBody.innerHTML = '';
    var rows = csvString.split('\n');
    TableData = [];
    var previousAddedSegmentID = -1;

    for(let i=0; i<rows.length; i++){
        var columns = rows[i].split('\t');
        var rowdatatype = columns[1];
        if(!(rowdatatype == "word")) continue;
        var id = columns[0];
        var word = columns[2]; 
        var starttime = columns[3];
        var endtime = columns[4];


        var cf_val = parseFloat(columns[5]);
        if(cf_val <= confidenceThreshold){
                let currentSegmentID = getSegmentIdFromWordId(id);
                if(!(currentSegmentID == previousAddedSegmentID)){ //add segment if it has not been added before
                    previousAddedSegmentID = currentSegmentID;
                    AddSegmentRowToTable(tableBody, currentSegmentID);
                }

                var newRow = tableBody.insertRow();
                newRow.setAttribute('data-id', id);
                newRow.setAttribute('data-starttime', starttime);
                newRow.setAttribute('data-endtime', endtime);
                newRow.setAttribute('data-segmentplay', false);

                var cell_confidence = newRow.insertCell();
                var cell_controls = newRow.insertCell();
                var cell_playbutton = newRow.insertCell();
                var cell_data = newRow.insertCell();

        
                // Set the content of the cells to the extracted columns
                cell_confidence.textContent = cf_val;
                cell_data.textContent = word;
                cell_data.contentEditable = true;
                var divElement = document.createElement('div');
                    divElement.className = 'data-more-context';
                    divElement.innerHTML = `
                            <i class="fa-solid fa-toggle-off" id="data-show-segment-audio" title="Switch Audio to segment"></i>
                            <i class="fa-solid fa-circle-info" id="data-show-segment" title="Display Current Segment">
                                <span class="popuptext" id="data-show-segment--popup">Segment Popup</span>
                            </i>
                            
                   `
                cell_controls.appendChild(divElement);

                cell_data.addEventListener('input', (e)=>{
                    unsavedChanges = true;
                    let cell = e.target.closest('td');
                    let row = e.target.closest('tr');
                    let id_attr = row.getAttribute('data-id');
                    let id = parseFloat(id_attr);
                    let datainTable = TableData.find(ele => ele.id == id);
                    datainTable.word = e.target.textContent;
                    datainTable.edited = true;
                })
                
                let showContextData = cell_controls.querySelector('#data-show-segment');
                let showContextDataPopup = showContextData.querySelector("#data-show-segment--popup");
                showContextDataPopup.addEventListener('click', (e)=>{
                    e.stopPropagation();
                })

                showContextData.addEventListener('click', (e)=>{
                    let cell = e.target.closest('td');
                    let row = e.target.closest('tr');
                    let id_attr = row.getAttribute('data-id');
                    let start_time_attr = row.getAttribute('data-starttime');
                    let end_time_attr = row.getAttribute('data-endtime');
                    
                    let popup = showContextDataPopup;
                    popup.innerHTML = getSegmentFromId(id_attr);
                    popup.classList.toggle("show");
                });

                let toggleSegmentAudio = cell_controls.querySelector('#data-show-segment-audio');
                toggleSegmentAudio.addEventListener('click', (e)=>{
                    let ele = e.target;
                    let cell = e.target.closest('td');
                    let row = e.target.closest('tr');
                    let t_on = 'fa-toggle-on';
                    let t_off = 'fa-toggle-off';
                    if(ele.classList.contains(t_on)){
                        ele.classList.remove(t_on);
                        ele.classList.add(t_off);
                        row.setAttribute('data-segmentplay', false);
                    }else{
                        ele.classList.remove(t_off);
                        ele.classList.add(t_on);
                        row.setAttribute('data-segmentplay', true);
                    }

                    
                })


    
                cell_playbutton.innerHTML = `
                        <button id="play" class="action" data-start=${starttime} data-end=${endtime}>
                        <i class="fa-solid fa-circle-play"></i>
                        </button>
                                    `;
                TableData.push({
                    id: id,
                    word: word,
                    starttime: starttime,
                    endtime: endtime,
                    edited: false
                })
    

        }
    }
    AddEventToData();

}



const LoadDataIntoTable = async (filename) =>{
    var title = document.querySelector('.music__title');
    changeThresholdForm = document.querySelector("#threshold-value-change--form");
    exportDataButton = document.querySelector('#export-btn');
    exportDataButton.onclick = ExportData;
    changeThresholdForm.addEventListener('submit', (ev) =>{
        ev.preventDefault();
        let formData = new FormData(changeThresholdForm);
        let inputValue = formData.get('threshold-conf-val');
        confidenceThreshold = parseFloat(inputValue);
        AddCSVToTable();        
    });
    title.innerHTML = filename.split('\\').pop().split('/').pop();
    let csvFile = changeFileExtension(filename, ".csv");
    CSVFilePath = csvFile;
    var csvdata = await eel.getCSVFileContents(csvFile)();
    csvString = csvdata;
    SegmentList = [];
    PopulateSegmentList();
    AddCSVToTable();
}

const ExportData = ()=>{
    let editedItems = TableData.filter(ele=>ele.edited == true).map(item => {
        return {
            id: item.id,
            segment_id: getSegmentIdFromWordId(item.id),
            word: item.word
        }
    });
    eel.getCSVDataToExport(editedItems, CSVFilePath);
    unsavedChanges = false;
}

addCSVManuallyButton.onclick = getCSVFiles;

async function getCSVFiles() {
    let fileurls = await eel.getCSVFiles()();
    Array.from(fileurls).forEach(url => {
        filepath = changeFileExtension(url, ".mp3");
        ProcessedItems.push(filepath);
        UpdateProcessedList();
    })
}

const changeFileExtension = (filename, extension)=>{
    let idx = filename.lastIndexOf('.');
    if(idx != -1){
        filename = filename.substring(0, idx) + extension;
    }
    return filename;
}







