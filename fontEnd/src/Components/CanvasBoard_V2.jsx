import React, {useState, useEffect} from "react";
import io from "socket.io-client";

export default function CanvasBoard_V2() {
    const size = 500;
    const cellSize = 20;
    const canvasRef = React.useRef(null);
    const [data, setData] = React.useState([]);
    const [currentColor, setCurrentColor] = React.useState("black");
    const [currentCell, setCurrentCell] = React.useState({x: 0, y: 0});
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Kết nối tới server Socket.IO
        const newSocket = io('https://backendpaint-1.onrender.com');
    
        // Lắng nghe sự kiện 'connect'
        newSocket.on('connect', (data) => {
            loadBoard(data)
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

    const setColorAtCell = (x, y, color) => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.fillStyle = color;
        context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
    }

    const loadBoard = (data) => {
        console.log(data);
        data.forEach((cell) => {
            setColorAtCell(cell.x, cell.y, cell.color);
        });
    }

    const sendCell = (x, y, color) => {
        if (socket) {
            socket.emit('Client_SendCell', x, y, color);
        }
    };

    const handleCellClick = (e) => {
        const canvas = canvasRef.current;
        const x = Math.floor(e.nativeEvent.offsetX / cellSize);
        const y = Math.floor(e.nativeEvent.offsetY / cellSize);
        setCurrentCell({x: x, y: y});
    }

    const handleChangeColor = (e) => {
        setCurrentColor(e.target.value);
    }

    const userSetColor = (cell) =>{
        sendCell(cell.x, cell.y, currentColor);

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
                <button className='resbox' onClick={() => setColorAtCell(currentCell.x, currentCell.y, currentColor)}>Set color</button>
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
    