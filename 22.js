// const { $CombinedState } = require("redux");

const player = document.querySelector(".player"),
musicImg = player.querySelector(".img-area img"),
musicName = player.querySelector(".song-details .name"),
musicArtist = player.querySelector(".song-details .artist"),
playPauseBtn = player.querySelector(".play-pause"),
prevBtn = player.querySelector("#prev"),
nextBtn = player.querySelector("#next"),
wave = player.querySelector('.wave'),
volumeIcon = player.querySelector("#volume_icon"),
mainAudio = player.querySelector("#main-audio"),
progressArea = player.querySelector(".progress-area"),
progressBar = progressArea.querySelector(".progress-bar"),
volume_show = player.querySelector('.volume_show'),
volumeSlider = player.querySelector('.volume_slider'),
musicList = player.querySelector(".music-list"),

moreMusicBtn = player.querySelector("#more-music"),
closemoreMusic = musicList.querySelector("#close");



let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);
isMusicPaused = true;
let currentTrack = player.querySelector('audio');
window.addEventListener("load", ()=>{
  loadMusic(musicIndex);
  playingSong(); 
});

function loadMusic(indexNumb){
  musicName.innerText = allMusic[indexNumb - 1].name;
  musicArtist.innerText = allMusic[indexNumb - 1].artist;
  musicImg.src = `images/${allMusic[indexNumb - 1].src}.jpg`;
  mainAudio.src = `songs/${allMusic[indexNumb - 1].src}.mp3`;
  randomBackgroundColor();
}

//play music function
function playMusic(){
  player.classList.add("paused");
  playPauseBtn.querySelector("i").innerText = "pause";
  wave.classList.add('loader');
  mainAudio.play(); 
}

//pause music function
function pauseMusic(){
  player.classList.remove("paused");
  playPauseBtn.querySelector("i").innerText = "play_arrow";
  wave.classList.remove('loader');
  mainAudio.pause();
}

//prev music function
function prevMusic(){
  musicIndex--; 

  musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
  loadMusic(musicIndex);
  playMusic();
  playingSong(); 
}

//next music function
function nextMusic(){
  musicIndex++; //increment of musicIndex by 1
  //if musicIndex is greater than array length then musicIndex will be 1 so the first music play
  musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
  loadMusic(musicIndex);
  playMusic();
  playingSong(); 
}

// play or pause button event
playPauseBtn.addEventListener("click", ()=>{
  const isMusicPlay = player.classList.contains("paused");
  //if isPlayMusic is true then call pauseMusic else call playMusic
  isMusicPlay ? pauseMusic() : playMusic();
  playingSong();
});

//prev music button event
prevBtn.addEventListener("click", ()=>{
  prevMusic();
});

//next music button event
nextBtn.addEventListener("click", ()=>{
  nextMusic();
});

// update progress bar width according to music current time
mainAudio.addEventListener("timeupdate", (e)=>{
  const currentTime = e.target.currentTime; //getting playing song currentTime
  const duration = e.target.duration; //getting playing song total duration
  let progressWidth = (currentTime / duration) * 100;
  progressBar.style.width = `${progressWidth}%`;

  let musicCurrentTime = player.querySelector(".current-time"),
  musicDuartion = player.querySelector(".max-duration");
  mainAudio.addEventListener("loadeddata", ()=>{
    // update song total duration
    let mainAdDuration = mainAudio.duration;
    let totalMin = Math.floor(mainAdDuration / 60);
    let totalSec = Math.floor(mainAdDuration % 60);
    if(totalSec < 10){ //if sec is less than 10 then add 0 before it
      totalSec = `0${totalSec}`;
    }
    musicDuartion.innerText = `${totalMin}:${totalSec}`;
  });

  let currentMin = Math.floor(currentTime / 60);
  let currentSec = Math.floor(currentTime % 60);
  if(currentSec < 10){
    currentSec = `0${currentSec}`;
  }
  musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

// update playing song currentTime on according to the progress bar width
progressArea.addEventListener("click", (e)=>{
  let progressWidth = progressArea.clientWidth; 
  let clickedOffsetX = e.offsetX;
  let songDuration = mainAudio.duration; 
  
  mainAudio.currentTime = (clickedOffsetX / progressWidth) * songDuration;
  playMusic(); //calling playMusic function
  playingSong();
});


//change loop, shuffle, repeat icon onclick
const repeatBtn = player.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", ()=>{
  let getText = repeatBtn.innerText; //getting this tag innerText
  switch(getText){
    case "repeat":
      repeatBtn.innerText = "repeat_one";
      // repeatBtn.setAttribute("title", "Song looped");
      break;
    case "repeat_one":
      repeatBtn.innerText = "shuffle";
      // repeatBtn.setAttribute("title", "Playback shuffled");
      break;
    case "shuffle":
      repeatBtn.innerText = "repeat";
      repeatBtn.setAttribute("title", "Playlist looped");
      break;
  }
});


// u khi bài hát kết thúc
mainAudio.addEventListener("ended", ()=>{
 
  let getText = repeatBtn.innerText; //getting this tag innerText
  switch(getText){
    case "repeat":
      nextMusic(); //calling nextMusic function
      break;
    case "repeat_one":
      mainAudio.currentTime = 0; 
      loadMusic(musicIndex); //calling loadMusic function 
      playMusic(); //calling playMusic function
      break;
    case "shuffle":
      let randIndex = Math.floor((Math.random() * allMusic.length) + 1); //genereting random index/numb with max range of array length
      do{
        randIndex = Math.floor((Math.random() * allMusic.length) + 1);
      }while(musicIndex == randIndex); 
      musicIndex = randIndex;
      loadMusic(musicIndex);
      playMusic();
      playingSong();
      break;
  }
});

//show music list onclick of music icon
moreMusicBtn.addEventListener("click", ()=>{
  musicList.classList.toggle("show");
});  
closemoreMusic.addEventListener("click", ()=>{
  moreMusicBtn.click();
});

const ulTag = player.querySelector("ul");
// let create li tags according to array length for list
for (let i = 0; i < allMusic.length; i++) {
  //let's pass the song name, artist from the array
  let liTag = `<li li-index="${i + 1}">
                <div class="row">
                  <span>${allMusic[i].name}</span>
                  <p>${allMusic[i].artist}</p>
                </div>
                <span id="${allMusic[i].src}" class="audio-duration">3:40</span>
                <audio class="${allMusic[i].src}" src="songs/${allMusic[i].src}.mp3"></audio>
              </li>`;
  ulTag.insertAdjacentHTML("beforeend", liTag); //inserting the li inside ul tag

  let liAudioDuartionTag = ulTag.querySelector(`#${allMusic[i].src}`);
  let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);
  liAudioTag.addEventListener("loadeddata", ()=>{
    let duration = liAudioTag.duration;
    let totalMin = Math.floor(duration / 60);
    let totalSec = Math.floor(duration % 60);
    if(totalSec < 10){ 
      totalSec = `0${totalSec}`;
    };
    liAudioDuartionTag.innerText = `${totalMin}:${totalSec}`; 
    liAudioDuartionTag.setAttribute("t-duration", `${totalMin}:${totalSec}`); //adding t-duration attribute with total duration value
  });
}
function setVolume(){
  volume_show.innerHTML=volumeSlider.value;
  console.log('first',volumeSlider.value)
  currentTrack.volume = volumeSlider.value / 100;
  volumeIcon.classList.remove('fa-volume-mute');
}
function mute_volume (){
  // <i class="fas fa-volume-mute"></i>
  volumeIcon.classList.add('fa-volume-mute'),
  console.log('first')
  currentTrack.volume =0;

}


function playingSong(){
  const allLiTag = ulTag.querySelectorAll("li");
  
  for (let j = 0; j < allLiTag.length; j++) {
    let audioTag = allLiTag[j].querySelector(".audio-duration");
    
    if(allLiTag[j].classList.contains("playing")){
      allLiTag[j].classList.remove("playing");
      let adDuration = audioTag.getAttribute("t-duration");
      audioTag.innerText = adDuration;
    }

   
    if(allLiTag[j].getAttribute("li-index") == musicIndex){
      allLiTag[j].classList.add("playing");
      audioTag.innerText = "Playing";
    }

    allLiTag[j].setAttribute("onclick", "clicked(this)");
  }
}

//particular li clicked function
function clicked(element){
  let getLiIndex = element.getAttribute("li-index");
  musicIndex = getLiIndex; 
  loadMusic(musicIndex);
  playMusic();
  playingSong();
}

