import '../dashboard/Cards.css';

const Card = ({ title, value, icon }) => {
  return (
    <div className="card">
      <div className="card-icon">{icon}</div>
      <div className="card-content">
        <h2>{title}</h2>
        <p>{value}</p>
      </div>
    </div>
  );
};

export default Card;
