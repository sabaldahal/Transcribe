

const leftPane = document.querySelector(".left");
const rightPane = document.querySelector(".right");
const gutter = document.querySelector(".gutter");

const popupContainer = document.querySelector(".popup-container");
var popupHeader = popupContainer.querySelector(".popup-header span");
var popupContent = popupContainer.querySelector(".popup-content p");
var popupCloseButton = popupContainer.querySelector('.close-button');
var popupCancelButton = popupContainer.querySelector('.cancel-button');
var popupOkButton = popupContainer.querySelector('.ok-button');


var ConsentAllowedDirs = [];

//resizer
function resizer(e) {
  
  window.addEventListener('mousemove', mousemove);
  window.addEventListener('mouseup', mouseup);
  
  let prevX = e.x;
  const leftPanel = leftPane.getBoundingClientRect();
  const rightPanel = rightPane.getBoundingClientRect();
  
  
  function mousemove(e) {
    let newX = prevX - e.x;
    leftPane.style.width = leftPanel.width - newX + "px";
    rightPane.style.width = rightPanel.width + newX + "px";
  }
  
  function mouseup() {
    window.removeEventListener('mousemove', mousemove);
    window.removeEventListener('mouseup', mouseup);    
  }
  
  
}

gutter.addEventListener('mousedown', resizer);


//results panel
async function openNav(filename) {
  var lastIndex = filename.lastIndexOf("/");
  var folderPath = filename.substring(0, lastIndex);
  var previousIndex = folderPath.lastIndexOf("/");
  var folderName = folderPath.substring(previousIndex + 1, lastIndex);
  if(!ConsentAllowedDirs.some(e => e.url == folderName)){
    showPermissionRequiredPopUp(folderPath);
    return;
  }
  //await AllowDirectory(filename);
  document.getElementById("myNav").style.width = "100%";

  $("#results-overlay-content").load("resultspanel.html", function() {
    let file = filename.split('\\').pop().split('/').pop();
    let dirHandle = ConsentAllowedDirs.find(ele => ele.url == folderName);
    if(dirHandle){
      dirHandle.handle.getFileHandle(file).then(async (fileHandle)=>{
        let fileURL = URL.createObjectURL(await fileHandle.getFile());
        LoadAudioPlayer(fileURL);
        LoadDataIntoTable(filename);
      });
    }

   });
  
}

function closeNav() {
  if(unsavedChanges){
    showFileNotSavedPopUp();
    return;
  }
  document.getElementById("myNav").style.width = "0%";
}


const AllowDirectory = async () =>{
    try{
      var directoryHandle = await window.showDirectoryPicker();
      ConsentAllowedDirs.push({
        url: directoryHandle.name,
        handle: directoryHandle
      });

    }catch(e){
      console.error('caught error in Directory Access', e);
    }
      
    closePopUp();
}

const showPermissionRequiredPopUp = (folder) => {
    popupHeader.innerHTML = "Permission Required";
    popupContent.innerHTML = `To load audio files, please grant permission to access the folder:
    <br>
    Permission Required for: ${folder}`;
    popupContainer.style.display = 'block';
    popupOkButton.onclick = AllowDirectory;   
}

const showFileNotSavedPopUp = () =>{
  popupHeader.innerHTML = "Unsaved Changes";
  popupContent.innerHTML = "You have unsaved changes. Continue?";
  popupContainer.style.display = 'block';
  popupOkButton.onclick = ()=>{
    CloseResultsEditor();
    closePopUp();
    document.getElementById("myNav").style.width = "0%";
  }
}


const closePopUp = () => {
  popupContainer.style.display = 'none';
}



popupCloseButton.onclick = closePopUp;
popupCancelButton.onclick = closePopUp;



