require('dotenv').config();
const amqp = require('amqplib');
const PlaylistsService = require('./PlaylistsService');
const MailSender = require('./MailSender');
const Listener = require('./Listener');

const init = async () => {
  try {
    const playlistsService = new PlaylistsService();
    const mailSender = new MailSender();
    const listener = new Listener(playlistsService, mailSender);
  
    const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
    const channel = await connection.createChannel();
  
    await channel.assertQueue('export:playlists', {
      durable: true,
    });
  
    channel.consume('export:playlists', listener.listen, { noAck: true });
    console.log('Consumer siap mendengarkan queue export:playlists');
  } catch (error) {
    console.error('Gagal inisialisasi consumer RabbitMQ:', error);
  }
};

init();