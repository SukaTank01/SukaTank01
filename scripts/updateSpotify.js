const fs = require("fs");
const SpotifyWebApi = require("spotify-web-api-node");

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

spotifyApi.setRefreshToken(process.env.SPOTIFY_REFRESH_TOKEN);

async function updateSpotifyStatus() {
  try {
    // refresh access token
    const data = await spotifyApi.refreshAccessToken();
    spotifyApi.setAccessToken(data.body["access_token"]);

    // cek lagu yang lagi diputar
    const playing = await spotifyApi.getMyCurrentPlaybackState();

    let content = "🎶 Tidak ada lagu yang diputar sekarang.";
    if (playing.body && playing.body.is_playing) {
      const track = playing.body.item;
      content = `🎧 Sedang mendengarkan: **${track.name}** - ${track.artists.map(a => a.name).join(", ")}`;
    }

    // tulis ke README.md
    fs.writeFileSync("README.md", `# My Spotify Status\n\n${content}\n`);

    console.log("Spotify status berhasil diperbarui!");
  } catch (err) {
    console.error("Error updating Spotify status:", err.message);
  }
}

updateSpotifyStatus();
