import { useEffect, useState } from 'react';

import PTZControlCard from './PTZControlCard';

const CardDash = ({ webSocketService }) => {
  const [backgroundColor, setBackgroundColor] = useState('#1F1F22');
  const [isTransitionEnabled, setIsTransitionEnabled] = useState(false);

  useEffect(() => {
    const handleMessage = (data) => {
      if (data.type === 'backgroundColor' && data.key === 'backgroundCard1') {
        setBackgroundColor(data.backgroundColor);
      }
    };

    webSocketService.addMessageListener(handleMessage);

    return () => {
      webSocketService.removeMessageListener(handleMessage);
    };
  }, [webSocketService]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTransitionEnabled(true);
    }, 1);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="card"
      style={{
        backgroundColor,
        transition: isTransitionEnabled ? 'background-color 5s ease' : 'none',
      }}
    >
      <PTZControlCard id={1} webSocketService={webSocketService} />
      <PTZControlCard id={2} webSocketService={webSocketService} />
      <PTZControlCard id={3} webSocketService={webSocketService} />
    </div>
  );
};

export default CardDash;
