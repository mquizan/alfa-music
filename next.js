const brandData = document.getElementById('brand-data').innerHTML + '/';

const audioPlayer = document.getElementById('au-player');
const nextButton = document.getElementById('nextButton');
const musicFolderPath = '/music/' + brandData;
let musicFiles = [];
let currentIndex = 0;
 fetchMusicFiles();

function fetchMusicFiles() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', musicFolderPath, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const parser = new DOMParser();
      const htmlDocument = parser.parseFromString(xhr.responseText, 'text/html');
      const links = htmlDocument.getElementsByTagName('a');
      musicFiles = Array.from(links)
        .map((link) => link.getAttribute('href'))
        .filter((href) => href.endsWith('.mp3'));
      const storedIndex = localStorage.getItem('currentIndex');
      if (storedIndex) {
        currentIndex = parseInt(storedIndex);
      }
      playMusicAtIndex(currentIndex);
    }
  };
  xhr.send();
}


function playMusicAtIndex(index) {
  const musicFile = musicFiles[index];
  audioPlayer.src = musicFolderPath + musicFile;
  audioPlayer.load(); // Preload the audio file
            //  document.addEventListener('click', function() {
            //    audioPlayer.pause();
            //  });
  currentIndex = index;
  localStorage.setItem('currentIndex', currentIndex.toString());
  const musicTitleElement = document.getElementById('musicTitle');
                      musicTitleElement.textContent = musicFile.replace(/%20/g, " ").replace(/\//g, "").replace(/FireGrill/g, "").replace(/Piatto/g, "").replace(/SteakHouse/g, "").replace(/music/g, "").replace(/X2Download.app/g, "");
  // Preload the next 10 music files
  for (let i = 1; i <= 10; i++) {
    const nextIndex = (currentIndex + i) % musicFiles.length;
    const nextMusicFile = musicFiles[nextIndex];
    const nextAudio = new Audio();
    nextAudio.src =  musicFolderPath + nextMusicFile;
    nextAudio.load();

    // Check if the nextMusicFile is already in the disk cache
    if ('caches' in window) {
      caches.match(nextMusicFile).then(response => {
        if (!response) {
          localStorage.setItem(`nextSong${i}`, nextMusicFile);
        }
      });
    } else {
      localStorage.setItem(`nextSong${i}`, nextMusicFile);
    }
  }
}
// audioPlayer.addEventListener('error', ()=>{
//     nextButton.click();
// }
// );

// function playMusicAtIndex(index) {
//  const musicFile = musicFiles[index];
//  audioPlayer.src = musicFolderPath + musicFile;
//  document.addEventListener('click', function() {
//  audioPlayer.play();
//});
//  currentIndex = index;
   // Store the current index in localStorage
//  localStorage.setItem('currentIndex', currentIndex.toString());
   // Update the music title element
//  const musicTitleElement = document.getElementById('musicTitle');
//  musicTitleElement.textContent = musicFile.replace(/%20/g, " ");
//}
 audioPlayer.addEventListener('ended', () => {
  const nextIndex = (currentIndex + 1) % musicFiles.length;
  playMusicAtIndex(nextIndex);
});
 nextButton.addEventListener('click', () => {
  const nextIndex = (currentIndex + 1) % musicFiles.length;
  playMusicAtIndex(nextIndex);
});
// window.addEventListener('beforeunload', () => {
//  // Remove the stored index from localStorage
//  localStorage.removeItem('currentIndex');
//});

const randomButton = document.getElementById('randomButton');
 randomButton.addEventListener('click', () => {
  const randomIndex = Math.floor(Math.random() * musicFiles.length);
  playMusicAtIndex(randomIndex);
});

audioPlayer.controls = true;
audioPlayer.controlsList.add('nodownload');
