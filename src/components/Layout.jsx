import Header from './Header';
import Footer from './Footer';
import { useRailway } from '../context/RailwayContext';

export default function Layout({ children }) {
  const { isRailwayMode } = useRailway();

  return (
    <div className={`app-layout ${isRailwayMode ? 'railway-mode' : ''}`}>
      <Header />
      <main className="main-content">
        {children}
      </main>
      <Footer />
      <style>{`
        .app-layout {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
      `}</style>
    </div>
  );
}
