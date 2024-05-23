var musicPlayer;
var playBtn;
var audio;
var start_time;
var end_time;
var progressContainer;
var progress;
var audioTitle;
var totalduration;
var initialTime = 0;



function upddateTotalDuration(val){
    totalduration = val;
}

function updateAudioCurrentTime(val){
    audio.currentTime = val;
}

function updateInitialTime(val){
    initialTime = val;
}


function calculateTotalValue(length) {
    var minutes = Math.floor(length / 60),
        seconds_int = length - minutes * 60,
        seconds_str = seconds_int.toString(),
        seconds = seconds_str.substring(0, 2),
        time = minutes + ':' + seconds

    return time;
}

function calculateCurrentValue(currentTime) {
    var current_hour = parseInt(currentTime / 3600) % 24,
        current_minute = parseInt(currentTime / 60) % 60,
        current_seconds_long = currentTime % 60,
        current_seconds = current_seconds_long.toFixed(),
        current_time = (current_minute < 10 ? "0" + current_minute : current_minute) + ":" + (current_seconds < 10 ? "0" + current_seconds : current_seconds);

    return current_time;
}

// check if song is playing
function isAudioPlaying() {
    return musicPlayer.classList.contains('playing');
}

// play audio of current song
function playAudio() {
    if(audio.currentTime >= totalduration){
        audio.currentTime = initialTime;
    }
    musicPlayer.classList.add('playing');
    playBtn.querySelector('i').classList.remove('fa-solid', 'fa-circle-play');
    playBtn.querySelector('i').classList.add('fa-regular', 'fa-circle-pause');
    audio.play();
}

// pause audio of current song
function pauseAudio() {
    musicPlayer.classList.remove('playing');
    playBtn.querySelector('i').classList.add('fa-solid', 'fa-circle-play');
    playBtn.querySelector('i').classList.remove('fa-regular', 'fa-circle-pause');
    audio.pause();
}


// update progress bar width
function updateProgressBar(e) {
    const { currentTime } = e.srcElement;
    start_time.innerHTML = calculateCurrentValue(currentTime);
    end_time.innerHTML = calculateTotalValue(totalduration);
    const progressPercentage = ((currentTime - initialTime) / (totalduration - initialTime)) * 100;
    progress.style.width = `${progressPercentage}%`;

    if(currentTime >= totalduration){
        pauseAudio();
    }
}

// move audio to where you click on playing audio track
function updateProgressBarPlayPosition(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    audio.currentTime = ((clickX / width) * (totalduration - initialTime)) + initialTime;
}

const LoadAudioPlayer = (src) => {
        // Music Player
        musicPlayer = document.querySelector('.music__player');
        playBtn = document.querySelector('#play');
        playFullAudioBtn = document.querySelector('#play-full-audio');
        audio = document.querySelector('#audio');
        audio.src = src;
        start_time = document.querySelector('.start-time');
        end_time = document.querySelector('.end-time');
        // Progress Bar
        progressContainer = document.querySelector('.music__player--progress');
        progress = document.querySelector('.progress');

        // Title
        audioTitle = document.querySelector('.music__title');
        totalduration = audio.duration;
        audio.onloadedmetadata = () => {totalduration = audio.duration};

        /// / EVENT LISTENERS ////
        playBtn.addEventListener('click', () => {
            isAudioPlaying() ? pauseAudio() : playAudio();
        });

        playFullAudioBtn.addEventListener('click', () => {
            if(isAudioPlaying()){
                pauseAudio();
            }{
                updateAudioCurrentTime(0.00);
                updateInitialTime(0.00);
                upddateTotalDuration(audio.duration);
                playAudio();
            }
        });



        // progress bar updates
        audio.addEventListener('timeupdate', updateProgressBar);
        progressContainer.addEventListener('click', updateProgressBarPlayPosition);

}
