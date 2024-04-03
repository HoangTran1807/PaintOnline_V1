import React ,{useState, useEffect}from "react";
import "./childComponent/slider.css";
import io from "socket.io-client";

export default function MainBoard() {
  const [gridSize, setGridSize] = React.useState(50);
  const [currentColor, setCurrentColor] = React.useState("black");
  const boardSize = 40;
  const grid = Array(boardSize).fill(Array(boardSize).fill(null));
  const ColorPicker = ["red", "blue", "green", "yellow", "black", "white"];
  

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Kết nối tới server Socket.IO
    const newSocket = io('http://localhost:8080');

    // Lắng nghe sự kiện 'connect'
    newSocket.on('connect', () => {
        console.log('Connected to Socket.IO server');
    });

    // Lắng nghe sự kiện 'message' từ server
    newSocket.on('Server_SendCell', (key, color) => {
        changColorCell(key, color);

    });

    // Lưu socket
    newSocket.on('initialData', (data) => {
        data.forEach((cell) => {
            changColorCell(cell.key, cell.color);
        });
    });


    setSocket(newSocket);

    // Xử lý việc đóng kết nối
    return () => {
        newSocket.disconnect();
    };
}, []);

const sendCell = (key, color) => {
    if (socket) {
        socket.emit('Client_SendCell', key, color);
    }
};



  const ChangeBGColor = (e, key) => {
    e.target.style.backgroundColor = currentColor;
    sendCell(key, currentColor);
  };

  const changColorCell = (key, color) =>{
    const cell = document.querySelector(`[data-key="${key}"]`);
    if(cell){
      cell.style.backgroundColor = color;
    }
  }



  return (
    <>
      <div className="sticky d-flex" >
        <div className="color-picker d-flex">
          {ColorPicker.map((color) => (
            <div
              key={color}
              style={{ backgroundColor: color, width: "40px", height: "40px" }}
              onClick={() => setCurrentColor(color)}
            ></div>
          ))}
        </div>
        <button onClick={() => changColorCell()}>Eraser</button>

        <div className="slider" style={{ width: "100%" }}>
          <input
            type="range"
            min="20"
            max="100"
            value={gridSize}
            onChange={(e) => setGridSize(e.target.value)}
            style={{ width: "40%", float: "right"}}
          />
          </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${boardSize}, ${gridSize}px)` }}>
        {grid.map((row, i) => row.map((_, j) => {
            const key = `${i}-${j}`;
            return (
                <div 
                    key={key}
                    data-key={key}
                    style={{ border: "1px solid black", width: `${gridSize}px`, height: `${gridSize}px` }} 
                    onClick={(e) => ChangeBGColor(e, key)}
                ></div>
            );
        }))}
    </div>
    </>
  );
}
