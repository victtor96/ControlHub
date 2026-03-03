import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Navbar from '../components/layout/Navbar';
import Home from '../pages/Home';
import PTZ from '../pages/PTZ';
import VMIX from '../pages/VMIX';
import webSocketService from '../services/websocket/wsClient';

import '../styles/App.css';

function App() {
  const [bgColor, setBgColor] = useState('#101015');

  useEffect(() => {
    const timer = setTimeout(() => {
      document.body.classList.add('transition-enabled');
    }, 10);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleMessage = (data) => {
      if (data.type === 'backgroundColor' && data.key === 'backgroundCard') {
        setBgColor(data.backgroundColor);
      }
    };

    webSocketService.addMessageListener(handleMessage);

    const notifyServer = () => {
      webSocketService.sendMessage({ type: 'page_loaded' });
    };

    const checkConnectionAndNotify = () => {
      if (webSocketService.socket?.readyState === WebSocket.OPEN) {
        notifyServer();
        return;
      }

      const interval = setInterval(() => {
        if (webSocketService.socket?.readyState === WebSocket.OPEN) {
          clearInterval(interval);
          notifyServer();
        }
      }, 100);
    };

    checkConnectionAndNotify();

    return () => {
      webSocketService.removeMessageListener(handleMessage);
    };
  }, []);

  useEffect(() => {
    document.body.style.backgroundColor = bgColor;
  }, [bgColor]);

  return (
    <Router>
      <Navbar />
      <div className="content">
        <Routes>
          <Route path="/" element={<Home webSocketService={webSocketService} />} />
          <Route path="/about" element={<PTZ webSocketService={webSocketService} />} />
          <Route path="/services" element={<VMIX webSocketService={webSocketService} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
