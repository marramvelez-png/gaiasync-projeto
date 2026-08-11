const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

let onlineUsers = {};

io.on('connection', (socket) => {
    // Quando um usuário real entra e envia sua localização
    socket.on('join-meditation', (data) => {
        onlineUsers[socket.id] = { coords: data.coords };
        // Transmite para todos os navegadores abertos no mundo
        io.emit('user-joined', { id: socket.id, coords: data.coords });
    });

    // Quando o usuário desconecta ou fecha a aba
    socket.on('disconnect', () => {
        if (onlineUsers[socket.id]) {
            io.emit('user-left', { id: socket.id });
            delete onlineUsers[socket.id];
        }
    });
});

// Usa a porta padrão que o Render vai oferecer automaticamente
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log(`Servidor GaiaSync ativo na porta ${PORT}`));
