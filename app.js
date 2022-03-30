// Selectors
const musicContainer = document.querySelector(".music-container");
const playBtn = document.querySelector("#play");
const prevBtn = document.querySelector("#prev");
const nextBtn = document.querySelector("#next");
const loopBtn = document.querySelector("#loop");
const volumeBtn = document.querySelector(".volume-btn");
const volumeBar = document.querySelector(".volume-bar");
const volume = document.querySelector(".volume");
const audioSong = document.querySelector("audio");
const cover = document.querySelector(".music-cover img");
const songTitle = document.querySelector(".music-title");
const progressBar = document.querySelector(".progress-bar");
const progress = document.querySelector(".progress");
const currentSongTime = document.querySelector(".current-time");
const songDuration = document.querySelector(".song-duration");
const playList = document.querySelector(".play-list");
const songs = [
  "bashkard - abdurahman",
  "bayad - shadmehr",
  "bibi - shereen",
  "jab pyar kiya - lata",
  "ki behtar az to - arif",
  "wires - athlete",
  "zendegi - ahmad zahir",
];
showPlayList();
const playListSongs = document.querySelectorAll(".play-list .music");

//set default settings
let songIndex = 0;
let songLoop = true;
let isPlaying = false;
loadSong(songs[songIndex]);
audioSong.onloadedmetadata = function () {
  songDuration.innerText = convertSongTime(audioSong.duration);
};
audioSong.volume = 0.5;
volume.style.width = "50%";


//Event Listeners
playBtn.addEventListener("click", playPause);
nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);
loopBtn.addEventListener("click", loopSet);
volumeBtn.addEventListener("click", volumeBtnAction);
volumeBar.addEventListener("click", setVolume);
audioSong.addEventListener("timeupdate", updateProgress);
progressBar.addEventListener("click", setProgress);
audioSong.addEventListener("ended", loopSong);
playList.addEventListener("click", playPlayListMusic);

//functions
function showPlayList() {
  songs.forEach((song, index) => {
    //create a div element for each song in playlist
    const div = document.createElement('div')
    div.classList.add('music')
    if(index == 0) div.classList.add('playing')
    div.id = index
    const img = document.createElement('img')
    img.src = `./covers/${song}.jpg`
    img.alt = song
    const h3 = document.createElement('h3')
    h3.classList.add('play-list-music-title')
    h3.innerText = song
    div.appendChild(img)
    div.appendChild(h3)
    playList.appendChild(div)
  });
}

function loadSong(song) {
  songTitle.innerText = song;
  audioSong.src = `songs/${song}.mp3`;
  cover.src = `covers/${song}.jpg`;
}

function playPause() {
  if (isPlaying) {
    puseSong();
  } else {
    playSong();
  }
}

function playSong() {
  isPlaying = true;
  playBtn.querySelector("i").classList.remove("bi-play");
  playBtn.querySelector("i").classList.add("bi-pause");
  audioSong.play();
  playListSongs.forEach((e) => {
    if (e.id == songIndex) {
      e.classList.add("spin");
    }
  });
}

function puseSong() {
  isPlaying = false;
  playBtn.querySelector("i").classList.add("bi-play");
  playBtn.querySelector("i").classList.remove("bi-pause");
  audioSong.pause();
  playListSongs.forEach((e) => {
    if (e.id == songIndex) {
      e.classList.remove("spin");
    }
  });
}

function nextSong() {
  songIndex++;
  if (songIndex > songs.length - 1) {
    songIndex = 0;
  }
  playListSongs.forEach((song) => {
    song.classList.remove("playing");
    song.classList.remove("spin");
    if (song.id == songIndex) song.classList.add("playing");
  });
  loadSong(songs[songIndex]);
  if(isPlaying) playSong()
}

function prevSong() {
  songIndex--;
  if (songIndex < 0) {
    songIndex = songs.length - 1;
  }
  playListSongs.forEach((song) => {
    song.classList.remove("playing");
    song.classList.remove("spin");
    if (song.id == songIndex) song.classList.add("playing");
  });
  loadSong(songs[songIndex]);
  if(isPlaying) playSong()
}

function loopSet() {
  loopBtn.classList.toggle("active");
  if (songLoop) songLoop = false;
  else songLoop = true;
}

function updateProgress(e) {
  const { duration, currentTime } = e.srcElement;
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = `${progressPercent}%`;
  currentSongTime.innerText = convertSongTime(currentTime);
}

function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audioSong.duration;

  audioSong.currentTime = (clickX / width) * duration;
}
function convertSongTime(time) {
  let mins = Math.floor(time / 60);
  if (mins < 10) mins = "0" + String(mins);
  let secs = Math.floor(time % 60);
  if (secs < 10) secs = "0" + String(secs);

  return mins + ":" + secs;
}
function playPlayListMusic(event) {
  if (!event.target.classList.contains("music")) return;
  const song = event.target;
  playListSongs.forEach((element) => {
    element.classList.remove("playing");
    element.classList.remove("spin");
  });
  songIndex = song.id;
  song.classList.add("playing");
  song.classList.add("spin");
  loadSong(songs[songIndex]);
  playSong();
}
function setVolume(e) {
  const volumeWidth = e.target.clientWidth;
  const clickX = e.offsetX;
  volume.style.width = `${clickX}px`;
  audioSong.volume = clickX / volumeWidth;
  //change btn icon look
  if(audioSong.volume == 0){
    volumeBtn.classList.remove('bi-volume-up')
    volumeBtn.classList.remove('bi-volume-down')
    volumeBtn.classList.add('bi-volume-mute')
  }else if(audioSong.volume <= 0.4){
    volumeBtn.classList.remove('bi-volume-up')
    volumeBtn.classList.add('bi-volume-down')
    volumeBtn.classList.remove('bi-volume-mute')
  }else{
    volumeBtn.classList.add('bi-volume-up')
    volumeBtn.classList.remove('bi-volume-down')
    volumeBtn.classList.remove('bi-volume-mute')
  }
}
function volumeBtnAction() {
  if (audioSong.volume > 0) {
    audioSong.volume = 0;
    volumeBtn.classList.remove("bi-volume-up");
    volumeBtn.classList.remove("bi-volume-down");
    volumeBtn.classList.add("bi-volume-mute");
    volume.style.width = "0px";
  } else {
    audioSong.volume = 1;
    volumeBtn.classList.replace("bi-volume-mute", "bi-volume-up");
    volume.style.width = "100%";
  }
}
function loopSong() {
  if (songLoop) {
    nextSong();
  } else puseSong();
}
