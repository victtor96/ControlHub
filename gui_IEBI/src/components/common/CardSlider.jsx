import './CardSlider.css';

const CardSlider = ({ title, value, icon, onSwitchChange }) => {
  return (
    <div className="card4">
      <div className="card">
        <div className="card-icon">{icon}</div>
        <div className="card-content">
          <h2>{title}</h2>
        </div>
        <div className="card-body">
          {value && <p>{value}</p>}
          {onSwitchChange && (
            <label className="switch">
              <input type="checkbox" onChange={(event) => onSwitchChange(event.target.checked)} />
              <span className="slider" />
            </label>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardSlider;
