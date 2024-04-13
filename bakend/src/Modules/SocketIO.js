module.exports = function (io) {
    let arrCell = []; // Define arrCell here

    io.on('connection', (socket) => {
        console.log('A client connected');
        // Send 'initialData' to the new client
        socket.emit('initialData', arrCell);

        socket.on('disconnect', () => {
            console.log('A client disconnected');
        });

        socket.on('Client_SendCell', (x, y, color) => {
            let cell = arrCell.find(cell => cell.x === x && cell.y === y);

            if (cell) {
                // If the cell already exists, update its color
                cell.color = color;
            } else {
                // If the cell does not exist, add a new cell to the array
                arrCell.push({ x, y, color });
            }
            socket.broadcast.emit('Server_SendCell', x, y, color);
        });

        socket.on('Client_Send_ClearBoard', () => {
            arrCell = [];
            io.emit('Server_Send_ClearBoard');
            console.log('Clear board');
        });
    });
}