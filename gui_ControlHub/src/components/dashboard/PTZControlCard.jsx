import { useEffect, useState } from 'react';

import './ControlPTZ.css';

const PTZControlCard = ({ id, webSocketService }) => {
  const [sliderValues, setSliderValues] = useState({
    iris: 0,
    gain: 0,
    contraste: 0,
  });
  const [backgroundColor, setBackgroundColor] = useState('#1F1F22');
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [isConnected, setIsConnected] = useState(false);

  const sendPTZCommand = (control, value) => {
    webSocketService.sendMessage({
      type: 'ptz',
      id,
      control,
      value,
    });
  };

  useEffect(() => {
    const handleOpen = () => setIsConnected(true);
    const handleClose = () => setIsConnected(false);

    webSocketService.socket.addEventListener('open', handleOpen);
    webSocketService.socket.addEventListener('close', handleClose);

    return () => {
      webSocketService.socket.removeEventListener('open', handleOpen);
      webSocketService.socket.removeEventListener('close', handleClose);
    };
  }, [webSocketService]);

  const updateSliderBackground = (slider, value) => {
    if (!slider) {
      return;
    }

    const percentage = ((value - slider.min) / (slider.max - slider.min)) * 100;

    slider.style.background = `linear-gradient(
      to right,
      var(--slider-progress-color) ${percentage}%,
      var(--slider-track-color) ${percentage}%
    )`;
  };

  const handleSliderChange = (event, control) => {
    const value = parseInt(event.target.value, 10);
    updateSliderBackground(event.target, value);

    setSliderValues((prevValues) => ({
      ...prevValues,
      [control]: value,
    }));
  };

  const handleSliderRelease = (control) => {
    const value = sliderValues[control];
    sendPTZCommand(control, value);
  };

  useEffect(() => {
    const handleMessage = (data) => {
      if (data.type === 'backgroundColor' && data.key === 'backgroundCard') {
        setBackgroundColor(data.backgroundColor);
        setTextColor(isDarkColor(data.backgroundColor) ? '#FFFFFF' : '#000000');
      }

      if (data[id]) {
        if (data[id].iris !== undefined) {
          setSliderValues((prevValues) => ({ ...prevValues, iris: data[id].iris }));
          updateSliderBackground(document.getElementById(`iris-slider-${id}`), data[id].iris);
        }

        if (data[id].gain !== undefined) {
          setSliderValues((prevValues) => ({ ...prevValues, gain: data[id].gain }));
          updateSliderBackground(document.getElementById(`gain-slider-${id}`), data[id].gain);
        }

        if (data[id].contraste !== undefined) {
          setSliderValues((prevValues) => ({ ...prevValues, contraste: data[id].contraste }));
          updateSliderBackground(document.getElementById(`contraste-slider-${id}`), data[id].contraste);
        }
      }
    };

    webSocketService.addMessageListener(handleMessage);

    return () => {
      webSocketService.removeMessageListener(handleMessage);
    };
  }, [id, webSocketService]);

  const isDarkColor = (color) => {
    let r = 0;
    let g = 0;
    let b = 0;

    if (color.length === 7) {
      r = parseInt(color.slice(1, 3), 16);
      g = parseInt(color.slice(3, 5), 16);
      b = parseInt(color.slice(5, 7), 16);
    }

    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luminance < 128;
  };

  return (
    <div
      className="ptz-card"
      style={{
        backgroundColor,
        color: textColor,
        transition: 'background-color 5s ease, color 5s ease',
      }}
    >
      <h1>
        PTZ CAM {id} {isConnected ? '' : '(offline)'}
      </h1>

      <div className="ptz-controls">
        <div className="ptz-control">
          <label htmlFor={`iris-slider-${id}`}>Iris</label>
        </div>
        <div className="ptz-control">
          <input
            id={`iris-slider-${id}`}
            type="range"
            min="0"
            max="13"
            value={sliderValues.iris}
            aria-label={`Iris control for PTZ ${id}`}
            onChange={(event) => handleSliderChange(event, 'iris')}
            onMouseUp={() => handleSliderRelease('iris')}
            onTouchEnd={() => handleSliderRelease('iris')}
          />
          <span>{sliderValues.iris}</span>
        </div>
        <div className="ptz-control">
          <label htmlFor={`gain-slider-${id}`}>Gain</label>
        </div>
        <div className="ptz-control">
          <input
            id={`gain-slider-${id}`}
            type="range"
            min="0"
            max="20"
            value={sliderValues.gain}
            aria-label={`Gain control for PTZ ${id}`}
            onChange={(event) => handleSliderChange(event, 'gain')}
            onMouseUp={() => handleSliderRelease('gain')}
            onTouchEnd={() => handleSliderRelease('gain')}
          />
          <span>{sliderValues.gain}</span>
        </div>
        <div className="ptz-control">
          <label htmlFor={`contraste-slider-${id}`}>Contraste</label>
        </div>
        <div className="ptz-control">
          <input
            id={`contraste-slider-${id}`}
            type="range"
            min="0"
            max="20"
            value={sliderValues.contraste}
            aria-label={`Contrast control for PTZ ${id}`}
            onChange={(event) => handleSliderChange(event, 'contraste')}
            onMouseUp={() => handleSliderRelease('contraste')}
            onTouchEnd={() => handleSliderRelease('contraste')}
          />
          <span>{sliderValues.contraste}</span>
        </div>
      </div>
    </div>
  );
};

export default PTZControlCard;
