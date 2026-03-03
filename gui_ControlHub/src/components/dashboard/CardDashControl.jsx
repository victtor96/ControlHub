import { useEffect, useState } from 'react';
import { PencilSquareIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

import Button from '../ui/Button';
import Switch from '../ui/Switch';
import './Cards.css';

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

const CardDashControl = ({ webSocketService }) => {
  const [backgroundColor, setBackgroundColor] = useState('#1F1F22');
  const [textColor, setTextColor] = useState('#fff');
  const [isTransitionEnabled, setIsTransitionEnabled] = useState(false);
  const [switchStates, setSwitchStates] = useState([false, false, false]);
  const [activeButton, setActiveButton] = useState(null);
  const [showButtonIndexes, setShowButtonIndexes] = useState(false);
  const [buttonNames, setButtonNames] = useState([
    'Palavra',
    'Louvor',
    'Ofertas',
    'Criancas',
    'Comunhao',
    'Ceia',
  ]);
  const [callActive, setCallActive] = useState(true);
  const [presetActive, setPresetActive] = useState(false);

  const switchNames = ['PTZ CAM 1', 'PTZ CAM 2', 'PTZ CAM 3'];

  const sendButtonUpdateToServer = (updatedButtons) => {
    webSocketService.sendMessage({
      type: 'buttonUpdate',
      buttons: updatedButtons,
    });
  };

  useEffect(() => {
    const handleMessage = (data) => {
      if (data.type === 'backgroundColor' && data.key === 'backgroundCard1') {
        setBackgroundColor(data.backgroundColor);
      } else if (data.type === 'initialSwitchStates' && Array.isArray(data.states)) {
        setSwitchStates(data.states);
      } else if (data.type === 'buttonUpdate' && Array.isArray(data.buttons)) {
        setButtonNames(data.buttons);
      } else if (data.type === 'modeChanged') {
        if (data.call_preset === 0x01) {
          setPresetActive(true);
          setCallActive(false);
        } else if (data.call_preset === 0x02) {
          setCallActive(true);
          setPresetActive(false);
        }
      }
    };

    webSocketService.addMessageListener(handleMessage);
    webSocketService.sendMessage({ type: 'getInitialSwitchStates' });
    webSocketService.sendMessage({ type: 'getCallPreset' });

    return () => {
      webSocketService.removeMessageListener(handleMessage);
    };
  }, [webSocketService]);

  useEffect(() => {
    const darkText = isDarkColor(backgroundColor) ? '#fff' : '#000';
    setTextColor(darkText);
  }, [backgroundColor]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTransitionEnabled(true);
    }, 5);

    return () => clearTimeout(timer);
  }, [backgroundColor]);

  const handleSwitchChange = (index) => {
    const updatedSwitches = [...switchStates];
    updatedSwitches[index] = !updatedSwitches[index];
    setSwitchStates(updatedSwitches);

    webSocketService.sendMessage({
      type: 'switchState',
      switchId: index + 1,
      state: updatedSwitches[index],
    });
  };

  const handleButtonClick = (buttonId) => {
    setActiveButton(buttonId);

    webSocketService.sendMessage({
      type: 'buttonAction',
      buttonId,
      action: `Button ${buttonId} clicked`,
    });
  };

  const handleAddButton = () => {
    const newName = prompt('Digite o nome do novo botao:');

    if (newName) {
      const updated = [...buttonNames, newName];
      setButtonNames(updated);
      sendButtonUpdateToServer(updated);
    }
  };

  const handleEditButton = () => {
    setShowButtonIndexes(true);

    setTimeout(() => {
      const index = parseInt(prompt('Digite o numero do botao a editar (1, 2, ...)'), 10);
      setShowButtonIndexes(false);

      if (!Number.isNaN(index) && index >= 1 && index <= buttonNames.length) {
        const newLabel = prompt('Novo nome do botao:', buttonNames[index - 1]);

        if (newLabel) {
          const updated = [...buttonNames];
          updated[index - 1] = newLabel;
          setButtonNames(updated);
          sendButtonUpdateToServer(updated);
        }
      }
    }, 100);
  };

  const handleRemoveButton = () => {
    setShowButtonIndexes(true);

    setTimeout(() => {
      const index = parseInt(prompt('Digite o numero do botao a remover (1, 2, ...)'), 10);
      setShowButtonIndexes(false);

      if (!Number.isNaN(index) && index >= 1 && index <= buttonNames.length) {
        const updated = buttonNames.filter((_, i) => i !== index - 1);
        setButtonNames(updated);
        sendButtonUpdateToServer(updated);
      }
    }, 100);
  };

  const handleModeToggle = (mode) => {
    if (mode === 'CALL') {
      setCallActive(true);
      setPresetActive(false);
      webSocketService.sendMessage({ type: 'modeChange', mode: 'CALL' });
    } else if (mode === 'PRESET') {
      setCallActive(false);
      setPresetActive(true);
      webSocketService.sendMessage({ type: 'modeChange', mode: 'PRESET' });
    }
  };

  return (
    <div
      className={`card1 ${presetActive ? 'preset-mode' : ''}`}
      style={{
        backgroundColor,
        color: textColor,
        transition: isTransitionEnabled ? 'background-color 5s ease, color 5s ease' : 'none',
        position: 'relative',
      }}
    >
      <div className="top-controls">
        <div className="custom-sliders">
          <div className="switch">
            <label>
              <input
                type="checkbox"
                checked={callActive}
                onChange={() => handleModeToggle('CALL')}
              />
              <span className="slider" />
            </label>
            <strong>CALL</strong>
          </div>
          <div className="switch">
            <label>
              <input
                type="checkbox"
                checked={presetActive}
                onChange={() => handleModeToggle('PRESET')}
              />
              <span className="slider" />
            </label>
            <strong>PRESET</strong>
          </div>
        </div>

        <div className="button-actions">
          <button className="action-button" onClick={handleAddButton} style={{ color: textColor }}>
            <PlusIcon className="icon-style" />
          </button>
          <button className="action-button" onClick={handleEditButton} style={{ color: textColor }}>
            <PencilSquareIcon className="icon-style" />
          </button>
          <button className="action-button" onClick={handleRemoveButton} style={{ color: textColor }}>
            <TrashIcon className="icon-style" />
          </button>
        </div>
      </div>

      <div className="switch-container">
        {switchNames.map((name, index) => (
          <Switch
            key={name}
            label={name}
            isChecked={switchStates[index]}
            onToggle={() => handleSwitchChange(index)}
          />
        ))}
      </div>

      <div className="button-container-wrapper">
        <div className="button-container">
          {buttonNames.map((name, index) => (
            <Button
              key={`${name}-${index}`}
              label={showButtonIndexes ? (index + 1).toString() : name}
              onClick={() => handleButtonClick(index + 1)}
              isActive={activeButton === index + 1}
              className="modern-button"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardDashControl;
