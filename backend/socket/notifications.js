let ioInstance;

const initNotifications = (io) => {
    ioInstance = io;
};

const notificarMatchAtualizado = (usuario1_id, usuario2_id, matchData) => {
    if (!ioInstance) {
        console.error("Socket.IO não inicializado.");
        return;
    }
    ioInstance.to(`usuario-${usuario1_id}`).emit("matchAtualizado", matchData);
    ioInstance.to(`usuario-${usuario2_id}`).emit("matchAtualizado", matchData);
};

module.exports = { initNotifications, notificarMatchAtualizado };