import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { initializeData } from './data/seed';
import Home from './pages/Home';
import Bills from './pages/Bills';
import AddBill from './pages/AddBill';
import Stats from './pages/Stats';
import Settings from './pages/Settings';

function TabBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const tabs = [
    { path: '/', label: '首页', icon: '🏠' },
    { path: '/bills', label: '账单', icon: '📋' },
    { path: '/add', label: '记一笔', icon: '➕', primary: true },
    { path: '/stats', label: '统计', icon: '📊' },
    { path: '/settings', label: '设置', icon: '⚙️' },
  ];
  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };
  return (
    <nav className="tab-bar">
      {tabs.map((tab) => (
        <button
          key={tab.path}
          className={`tab-item ${tab.primary ? 'primary' : ''} ${isActive(tab.path) ? 'active' : ''}`}
          onClick={() => navigate(tab.path)}
        >
          <span className="tab-icon">{tab.icon}</span>
          <span className="tab-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}

function AppShell() {
  const location = useLocation();
  const isAddPage = location.pathname === '/add';
  return (
    <div className={`app-shell ${isAddPage ? 'no-tab' : ''}`}>
      <main className="app-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bills" element={<Bills />} />
          <Route path="/add" element={<AddBill />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
      {!isAddPage && <TabBar />}
    </div>
  );
}

export default function App() {
  useEffect(() => {
    initializeData();
  }, []);
  return (
    <BrowserRouter basename="/jizhang-bear/">
      <AppShell />
    </BrowserRouter>
  );
}
