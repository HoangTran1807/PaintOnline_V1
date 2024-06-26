import React, { useEffect, useRef, useState } from 'react';
import io from "socket.io-client";
import './childComponent/cvBoard.css';

const CanvasBoard = () => {
    const size = 200;
    const cellSize = 30;
    const canvasRef = useRef(null);
    const [ColorPicker, setColorPicker] = useState([]);
    const [currentColor, setCurrentColor] = useState("black");
    const [socket, setSocket] = useState(null);
    const [scale, setScale] = useState(1);



    useEffect(() => {
        // Kết nối tới server Socket.IO
        const newSocket = io('https://backendpaint-1.onrender.com');
    
        // Lắng nghe sự kiện 'connect'
        newSocket.on('connect', () => {
            console.log('Connected to Socket.IO server');
        });
    
        // Lắng nghe sự kiện 'Server_SendCell' từ server
        newSocket.on('Server_SendCell', (x, y, color) => {
            setColorAtCell(x, y, color);
    
        });
    
        // Lưu socket
        newSocket.on('initialData', (data) => {
            loadBoard(data)
        });
    
    
        setSocket(newSocket);
    
        // Xử lý việc đóng kết nối
        return () => {
            newSocket.disconnect();
        };
    }, []);


    const sendCell = (x, y, color) => {
        if (socket) {
            socket.emit('Client_SendCell', x, y, color);
        }
    };

    const handleCellClick = (e) => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const x = Math.floor(e.nativeEvent.offsetX / cellSize);
        const y = Math.floor(e.nativeEvent.offsetY / cellSize);
        sendCell(x, y, currentColor);
        context.fillStyle = currentColor;
        context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
    }

    const setColorAtCell = (x, y, color) => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.fillStyle = color;
        context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
    }

    const loadBoard = (data) => {
        data.forEach((cell) => {
            setColorAtCell(cell.x, cell.y, cell.color);
        });
    }

    const handleChangeColor = (e) => {
        setCurrentColor(e.target.value);
    }



 
  return (
    <>
    
    {/* <div className='color-picker' style={{display:'flex', position: 'fixed', top: '0', minWidth:'60vh'}}>
        {ColorPicker.map((color) => (
            <div
            key={color}
            style={{
                backgroundColor: color,
                width: '10vw',
                height: '10vw',
                maxWidth: '260px',
                maxHeight: '260px',
                border: `${currentColor === color ? '1px solid black' : 'white'}`,
            }}
            onClick={() => setCurrentColor(color)}
            />
        ))}
        
    </div> */}

        <div className='color-picker' style={{display:'flex', position: 'fixed', top: '0', minWidth:'60vh'}}>
            <input className='resbox' type="color" id="colorPicker" name="colorPicker" onChange={(e) => handleChangeColor(e)}/>
            <button className='resbox' onClick={() => setScale(2)}>Scale {scale}</button>
        </div>

    
      <canvas
        ref={canvasRef}
        width={size * cellSize}
        height={size * cellSize}
        style={{ border: '1px solid black', backgroundColor: 'lightgray', marginTop: '10vw'}}
        onClick={(e) => handleCellClick(e)}
      />
    </>
  );
};

export default CanvasBoard;