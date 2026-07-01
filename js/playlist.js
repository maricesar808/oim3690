const songs = [
  "Espresso",
  "Is This Love",
  "Saturn",
  "Sundress",
  "Cruel Summer",
];

const playlist = document.getElementById("playlist");
const songInput = document.getElementById("song-input");
const addSongButton = document.getElementById("add-song");

function renderPlaylist() {
  playlist.innerHTML = "";

  for (const song of songs) {
    const songItem = document.createElement("li");
    songItem.textContent = song;

    if (song.includes("Remix")) {
      songItem.classList.add("remix");
    }

    playlist.appendChild(songItem);
  }
}

function addSong() {
  const newSong = songInput.value.trim();

  if (newSong === "") {
    return;
  }

  songs.push(newSong);
  songInput.value = "";
  renderPlaylist();
}

addSongButton.addEventListener("click", addSong);

songInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addSong();
  }
});

renderPlaylist();
