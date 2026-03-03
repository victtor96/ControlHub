import CardDash from './CardDash';
import CardDashControl from './CardDashControl';

const Dashboard = ({ webSocketService }) => {
  return (
    <div className="dashboard">
      <CardDash webSocketService={webSocketService} />
      <CardDashControl webSocketService={webSocketService} />
    </div>
  );
};

export default Dashboard;
