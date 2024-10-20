let currentSong = new Audio(); //* Make new instace of audio
let currentSongIndex = 0; //* Songs current index for next / previous
const SongsArray = []; // songs array
let AlbumPlaylist; // get folder names





function secondsToMinutesSeconds(seconds) { // make duration time function
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}






const PlayButton = (song) => { // play song function

    currentSong.src = `/Songs/${AlbumPlaylist == undefined ? "NCS" : AlbumPlaylist}/` + song; // if song folder name is undfiend load static folder
    play.classList.replace("fa-play", "fa-pause") // replace icons
    currentSong.play() // song play function


    document.querySelector(".songName").innerHTML = song // song name
    document.querySelector(".Duration").innerHTML = "00:00" // song duration
}


const API_CALL = async (folder) => { // function to call songs from folder

    const response = await fetch(`http://127.0.0.1:5500/Songs/${folder == undefined ? "NCS" : folder}/`);
    const data = await response.text();
    const div = document.createElement("li");
    div.innerHTML = data;

    const links = div.getElementsByTagName('a');
    SongsArray.splice(0)
    for (let index = 0; index < links.length; index++) {
        const element = links[index];
        if (element.href.endsWith('.mp3')) {
            SongsArray.push(element.getElementsByClassName('name')[0].innerHTML);
        }

    }



    return SongsArray
}







const PlaySongs = async (folder) => { //* function to render all playist songs
    let html = '';
    await API_CALL(folder);
    SongsArray.forEach(elem => {
        html += `<div class="d-flex flex-row mb-3 soundlist rounded pt-3 px-3 ">
                 <i class="fa-solid fa-music fa-2x text-light"></i>
                 <div class="flex-grow-1 artisit-info ms-3">
                 <h5 class="text-light MusicName">${String(elem).replace(".mp3", "")}</h5>
                 <p class="text-light">${elem}</p>
                 </div>
             
                 </div>`;
    });

    document.querySelector(".sound-list").innerHTML = html;
    document.querySelectorAll('.artisit-info').forEach(elem => {
     
        elem.addEventListener("click", (e) => {
            const songUrl = elem.children[1].innerHTML;
            PlayButton(songUrl)



        })
    })


    // Funtion of seekbar
    currentSong.addEventListener("timeupdate", (e) => {
        document.querySelector('.progress-bar').style.width = `${currentSong.currentTime / currentSong.duration * 100}%`;
        document.querySelector('.Duration').innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;


    })

    // Add an event listener to seekbar
    document.querySelector(".progress").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".progress-bar").style.width = currentSong.duration ? percent : 0 + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })


    // Next Song
    document.querySelector(".fa-forward").addEventListener("click", (e) => {
        if (currentSongIndex < SongsArray.length - 1) {
            currentSongIndex++
            PlayButton(SongsArray[currentSongIndex]);
        }

    })


    // Previous Song
    document.querySelector(".fa-backward").addEventListener("click", (e) => {
        currentSong.paused
        if (currentSongIndex > 0) {
            // Only decrement if the index is greater than 0
            currentSongIndex--;
            PlayButton(SongsArray[currentSongIndex]);
        } else if (currentSongIndex <= 0) {
            // If the index is 0 or less, just ensure it's 0 and play the first song
            currentSongIndex = 0;
            PlayButton(SongsArray[currentSongIndex]);
        }



    })


    //* Display New Albums
    document.querySelectorAll('.AlbumCard').forEach(elem => {
        elem.addEventListener("click", async (e) => {

            SongsArray.splice(0); // Clear the current SongsArray
            AlbumPlaylist = elem.querySelector('.albumTitle').innerHTML; // Update album name
            await PlaySongs(AlbumPlaylist); // Reload songs from the new album

        })
    })


    //Funtion of volume bar
    document.querySelector(".VolumeBar").addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100

    })

    // If song end new song will addd
    currentSong.addEventListener("ended", (e) => {
        if (currentSongIndex < SongsArray.length) {
            // Move to the next song in the array
            currentSongIndex++;
        } else {
            // Reset to the first song if it's the end of the playlist
            currentSongIndex = 0;
        }

        // Play the next song (or the first one if it looped back)
        PlayButton(SongsArray[currentSongIndex]);


    })



};

play.addEventListener('click', (e) => {

    if (currentSong.paused) {
        currentSong.play()
        e.target.classList.replace("fa-play", "fa-pause")


    } else {
        e.target.classList.replace("fa-pause", "fa-play")
        currentSong.pause()
    }
})

PlaySongs()

