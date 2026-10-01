import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Search from './pages/Search';
import GameDetail from './pages/GameDetail';
import Profile from './pages/Profile';
import Discover from './pages/Discover';
import Settings from './pages/Settings';

function App() {
  const { user, loading, login, register, logout, refetch } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-bold">
          PLAYD<span className="text-accent">.</span>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-bg-primary">
        <Navbar user={user} onLogout={logout} />
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/login" element={<Login onLogin={login} />} />
          <Route path="/register" element={<Register onRegister={register} />} />
          <Route path="/search" element={<Search />} />
          <Route path="/game/:rawgId" element={<GameDetail user={user} />} />
          <Route path="/@:username" element={<Profile />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/settings" element={<Settings user={user} onUpdate={refetch} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
