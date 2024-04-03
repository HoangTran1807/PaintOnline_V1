module.exports = function (io) {
    let arrCell = []; // Define arrCell here

    io.on('connection', (socket) => {
        console.log('A client connected');
        // Send 'initialData' to the new client
        socket.emit('initialData', arrCell);
    
        socket.on('message', (message) => {
            console.log('Received message:', message);
            io.emit('message', message); // Send message to all clients
        });
    
        socket.on('disconnect', () => {
            console.log('A client disconnected');
        });

        socket.on('Client_SendCell', (key, color) => {
            const cellIndex = arrCell.findIndex(cell => cell.key === key);
        
            if (cellIndex !== -1) {
                // If the cell exists, update its color
                arrCell[cellIndex].color = color;
            } else {
                // If the cell doesn't exist, add it to arrCell
                arrCell.push({key, color});
            }
        
            // Send 'Server_SendCell' to all clients except the sender
            socket.broadcast.emit('Server_SendCell', key, color);
        });
    });
}