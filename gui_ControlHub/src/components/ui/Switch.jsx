import './Switch.css';

const Switch = ({ label, isChecked, onToggle }) => {
  return (
    <div className="custom-switch">
      <label>
        <input type="checkbox" checked={isChecked} onChange={onToggle} />
        <span className="custom-slider" />
      </label>
      {label && <p>{label}</p>}
    </div>
  );
};

export default Switch;
