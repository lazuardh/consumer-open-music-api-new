const { Pool} = require('pg');

class PlaylistsService {
    constructor() {
        this._pool = new Pool();
    }

    async getExportPlaylists(playlistId) {
        const queryPlaylist = {
            text: `SELECT p.id, p.name, u.username FROM playlists p
                   JOIN users u ON p.owner = u.id WHERE p.id = $1`,
            values: [playlistId]
        };


        const playlistResult = await this._pool.query(queryPlaylist);

        if (!playlistResult.rows.length) {
            throw new NotFoundError('Playlist tidak ditemukan.');
        }

        const querySong = {
             text: `SELECT s.id, s.title, s.performer FROM playlists_songs ps
                   JOIN songs s ON s.id = ps.song_id WHERE ps.playlist_id = $1`,
            values: [playlistId]
        }

        const songsResult = await this._pool.query(querySong);
        return {
            playlist: {
                id: playlistResult.rows[0].id,
                name: playlistResult.rows[0].name,
                songs: songsResult.rows,
        },
    };
    }
}

module.exports = PlaylistsService;