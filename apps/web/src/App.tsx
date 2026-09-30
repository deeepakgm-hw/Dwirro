import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { SystemProvider } from './context/SystemContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';
import { LockScreenModal } from './components/LockScreenModal';

// Domain Pages
import { ChatPage } from './pages/ChatPage';
import { TodayPage } from './pages/TodayPage';
import { EmailPage } from './pages/EmailPage';
import { BillsPage } from './pages/BillsPage';
import { CallsPage } from './pages/CallsPage';
import { MonitorPage } from './pages/MonitorPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';

export const MainAppContent: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('chat');

  const renderActiveTab = () => {
    switch (currentTab) {
      case 'chat':
        return <ChatPage />;
      case 'today':
        return <TodayPage />;
      case 'email':
        return <EmailPage />;
      case 'bills':
        return <BillsPage />;
      case 'calls':
        return <CallsPage />;
      case 'monitor':
        return <MonitorPage />;
      case 'reports':
        return <ReportsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <ChatPage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-cyan-500 selection:text-slate-950">
      <Navbar currentTab={currentTab} onSelectTab={setCurrentTab} />
      <main className="flex-1 w-full">{renderActiveTab()}</main>
      <LockScreenModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <SystemProvider>
        <ProtectedRoute>
          <MainAppContent />
        </ProtectedRoute>
      </SystemProvider>
    </AuthProvider>
  );
};

export default App;
