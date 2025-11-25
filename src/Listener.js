class Listener {
    constructor(playlistsService, mailSender) {
        this._playlistsService = playlistsService;
        this._mailSender = mailSender;

        this.listen = this.listen.bind(this);
    }

    async listen(message) {
        try {
            const { playlistId, targetEmail } = JSON.parse(message.content.toString());

            const exported = await this._playlistsService.getExportPlaylists(playlistId);
            await this._mailSender.sendEmail(targetEmail, JSON.stringify(exported));
            console.log('Email terkirim ke:', targetEmail);
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = Listener;