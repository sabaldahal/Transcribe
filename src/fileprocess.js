
const fileopener = document.querySelector("#fileopener");
const importedListUL = document.querySelector("#importedlist");
const selectAll = document.querySelector("#selectall");
const selectedCount = document.querySelector("#selectedCount");
const startTranscribe = document.querySelector("#startTranscribing");
const queuelist = document.querySelector("#queuelist");
var ImportedFiles = [];
var QueueList = [];
var TotalSelected = 0;

fileopener.onclick = getFiles;


const updateImportListEvents = () => {
    importedListUL.querySelectorAll("[type=checkbox]").forEach(checkbox =>{
    checkbox.addEventListener("click", function(e){
        let idx = ImportedFiles.findIndex((ele) => ele.filename == checkbox.id);
        if(this.checked){          
            ImportedFiles[idx].checked = true;
            TotalSelected += 1;
            selectedCount.innerHTML = TotalSelected;
        }else{
            ImportedFiles[idx].checked = false;
            TotalSelected -= 1;
            selectedCount.innerHTML = TotalSelected;
            selectAll.checked = false;
        }
    })
})
}

selectAll.onclick = () => {
    if(selectAll.checked){
        ImportedFiles.forEach(ele =>{
            ele.checked = true;
        })
        importedListUL.querySelectorAll("[type=checkbox]").forEach(checkbox => checkbox.checked = true);
        TotalSelected = ImportedFiles.length;
        selectedCount.innerHTML = TotalSelected;
    }else{

            ImportedFiles.forEach(ele =>{
                ele.checked = false;
            })
            importedListUL.querySelectorAll("[type=checkbox]").forEach(checkbox => checkbox.checked = false);
            TotalSelected = 0;
            selectedCount.innerHTML = TotalSelected;
        
        
    }
}

async function getFiles() {
    let files = await eel.getFiles()(); 
    Array.from(files).forEach(element => {
        if(!ImportedFiles.some(ele => ele.filepath == element)){
            ImportedFiles.push({
                filename : element.split('\\').pop().split('/').pop(),
                filepath : element,
                checked : false
            })
        }
    });
    updateImportedList();
}



const updateImportedList = () =>{
    if(ImportedFiles.length == 0) importedListUL.innerHTML = `<li>No Items...</li>`;
    else{
        importedListUL.innerHTML = "";
        for(let i=0; i<ImportedFiles.length-1; i++){
            let element = ImportedFiles[i];
            importedListUL.innerHTML += 
            `
            <li>
            <input type="checkbox" id="${element.filename}" />
            <label class="checkbox" for="${element.filename}">${element.filename}</label>
            </li>
            <hr>
            `
        }
        let element = ImportedFiles[ImportedFiles.length - 1];
        importedListUL.innerHTML += 
        `
        <li>
        <input type="checkbox" id="${element.filename}" />
        <label class="checkbox" for="${element.filename}">${element.filename}</label>
        </li>
        `

    }
    updateImportListEvents();
}

const UpdateQueueList = () => {
    queuelist.innerHTML = "";
    if(QueueList.length == 0) {
        queuelist.innerHTML = `<li><label>No Items...</label></li>`;       
    }
    else { 
        QueueList.forEach(element =>{
        queuelist.innerHTML += `
        <li><label>${element}</label></li>
        <hr>
        `
        })
        let lastChild = queuelist.lastElementChild;
        if (lastChild && lastChild.tagName.toLowerCase() === 'hr') {
            queuelist.removeChild(lastChild);
        }
    }
}


startTranscribe.onclick = sendFilesToTranscribe;

function sendFilesToTranscribe(){
    let transcribelist = ImportedFiles.filter(ele => ele.checked == true).map(ele =>  ele.filepath);
    ImportedFiles = ImportedFiles.filter(ele => ele.checked != true);
    updateImportedList();
    AddToQueue(transcribelist);
    eel.getFilesToTranscribe(transcribelist);
    TotalSelected = 0;
    selectedCount.innerHTML = TotalSelected;
}

const AddToQueue = (arr) =>{
    arr.forEach(item => QueueList.push(item));
    UpdateQueueList();
}

const RemoveFromQueue = (item)=> {
    let index = QueueList.indexOf(item);
    if(index > -1) QueueList.splice(index, 1);
    UpdateQueueList();
}



updateImportedList();
UpdateQueueList();