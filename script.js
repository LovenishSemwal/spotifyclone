
let currentSong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    // Ensure seconds is a number
    seconds = parseInt(seconds);

    // Check if seconds is a valid number
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    // Calculate minutes and seconds
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = seconds % 60;

    // Format minutes and seconds to always have two digits
    let formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    let formattedSeconds = remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;

    // Return formatted time
    return formattedMinutes + ":" + formattedSeconds;
}


async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
    // show all the songs in the playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML +=
            `<li>
         <img class="invert" src="music.svg" alt="">
         <div class="info">
             <div>
              ${song.replaceAll("%20", " ").trim()}
             </div>
             <div>Lovenish</div>
         </div>
         <div class="playNow">
             <span>Play Now</span>
             <img class="invert" src="play-button.svg" alt="">
         </div>       
          </li>`;
    }

    // attach an event listner to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {

            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })
}
const playMusic = (track, pause = false) => {
    currentSong.src = `/${currFolder}/` + track
    if (!pause) {
        currentSong.play()
        play.src = "pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"


}

async function main() {

    // get the list of all songs
    await getSongs("songs/cs")
    playMusic(songs[0], true)



    // Attach an event listener to play, next and prvious
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "play-circle.svg"
        }
    })

    // listen for time update event
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/
        ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"
    })

    // add an event listner to seek bar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration)
            * percent) / 100
    })

    // add an event listner for menu
    document.querySelector(".menu").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    // add an event listner for close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    // add an event listener to previous 
    previous.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })

    // add an event listener to next
    next.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })

    // add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100
    })

    // load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        console.log(e);
        e.addEventListener("click", async item => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)

        })
    })
}
main()