const processedListUL = document.querySelector("#processedlist");
var ProcessedItems = [];
const currentlyProcessing = document.querySelector('.currently-processing');

eel.expose(AddToProcessedList);
function AddToProcessedList(item){
    ProcessedItems.push(item);
    UpdateProcessedList();
    RemoveFromQueue(item);
    //remove processing status bar
    currentlyProcessing.innerHTML = "";
}

eel.expose(CurrentlyProcessingFile);
function CurrentlyProcessingFile(file){
    currentlyProcessing.innerHTML = `
    <div class="spinner">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
</div>
Processing file: ${file}
    `
}


const UpdateProcessedList = () => {
    processedListUL.innerHTML = "";
    ProcessedItems.forEach(item => {
        processedListUL.innerHTML += `
        <li data-filename="${item}" ">
        ${item.split('\\').pop().split('/').pop()}
        <i class="fa-solid fa-pen"></i>
        </li>
        `
    })
    var listitems = document.querySelectorAll("#processedlist li");
    listitems.forEach(item =>{
        item.addEventListener('click', () =>{
            openNav(item.dataset.filename);
        })
    })
}

