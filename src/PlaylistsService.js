const { Pool} = require('pg');

class PlaylistsService {
    constructor() {
        this._pool = new Pool();
    }

    async getExportPlaylists(userId) {
         const query = {
            text: `SELECT playlists.* FROM playlists
            LEFT JOIN playlists_songs ON playlists_songs.id = playlists.id
            WHERE playlists.owner = $1 OR playlists_songs.playlist_id = $1
            GROUP BY playlists.id`,
            values: [userId],
        };
        const result = await this._pool.query(query);
        return result.rows;
    }
}

module.exports = PlaylistsService;