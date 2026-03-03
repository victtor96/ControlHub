import Dashboard from '../components/dashboard/Dashboard';

const Home = ({ webSocketService }) => {
  return (
    <div className="App">
      <Dashboard webSocketService={webSocketService} />
    </div>
  );
};

export default Home;
