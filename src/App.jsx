import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ArticleProvider } from './context/ArticleContext';
import { PageProvider } from './context/PageContext';
import Layout from './components/Layout';
import Hero from './components/Hero';
import NewsSection from './components/NewsSection';
import About from './components/About';
import Contact from './components/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import ArticleDetail from './pages/ArticleDetail';
import DynamicPage from './pages/DynamicPage';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import ReportProblem from './pages/ReportProblem';
import ShinbunFiles from './pages/ShinbunFiles';
import ShinbunConnect from './pages/ShinbunConnect';
import PublicProfile from './pages/PublicProfile';
import RailwayPage from './pages/RailwayPage';
import ShinbunAI from './pages/ShinbunAI';
import MiniShinbunAI from './components/MiniShinbunAI';
import { SettingsProvider } from './context/SettingsContext';
import { ThemeProvider } from './context/ThemeContext';
import { RailwayProvider } from './context/RailwayContext';
import './themes.css';
import './App.css';
import './styles/railway.css';

import usePageTitle from './hooks/usePageTitle';

function Home() {
  usePageTitle('ホーム');
  return (
    <>
      <Hero />
      <NewsSection />
      <About />
      <Contact />
    </>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <RailwayProvider>
          <AuthProvider>
            <SettingsProvider>
              <ArticleProvider>
                <PageProvider>
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/admin" element={<AdminDashboard />} />
                      <Route path="/dashboard" element={<UserDashboard />} />
                      <Route path="/article/:id" element={<ArticleDetail />} />
                      <Route path="/page/:slug" element={<DynamicPage />} />
                      <Route path="/privacy" element={<Privacy />} />
                      <Route path="/terms" element={<Terms />} />
                      <Route path="/report" element={<ReportProblem />} />
                      <Route path="/files" element={<ShinbunFiles />} />
                      <Route path="/connect" element={<ShinbunConnect />} />
                      <Route path="/profile/user/:username" element={<PublicProfile />} />
                      <Route path="/railway" element={<RailwayPage />} />
                      <Route path="/ShinbunAI" element={<ShinbunAI />} />
                    </Routes>
                    <MiniShinbunAI />
                  </Layout>
                </PageProvider>
              </ArticleProvider>
            </SettingsProvider>
          </AuthProvider>
        </RailwayProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
