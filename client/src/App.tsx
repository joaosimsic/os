import { useState, useCallback } from 'react';
import { BootScreen } from './components/BootScreen';
import { LoginScreen } from './components/LoginScreen';
import { DiscoverScreen } from './components/DiscoverScreen';
import { ExploreDesktop } from './components/ExploreDesktop';
import { OwnerDesktop } from './components/OwnerDesktop';
import { useAuthStore } from './store/auth';
import { useComputerStore } from './store/computer';
import { useMyComputerStore } from './store/myComputer';

type AppPhase = 'discover' | 'login' | 'booting' | 'desktop' | 'exploring';

function App() {
  const [phase, setPhase] = useState<AppPhase>('discover');
  const { logout } = useAuthStore();
  const { currentComputer, clearComputer } = useComputerStore();
  const { reset: resetMyComputer } = useMyComputerStore();

  // Handle discovery -> exploration
  const handleDiscover = useCallback(() => {
    if (currentComputer) {
      setPhase('exploring');
    }
  }, [currentComputer]);

  // Handle going to login
  const handleGoToLogin = useCallback(() => {
    setPhase('login');
  }, []);

  // Handle back from login
  const handleBackFromLogin = useCallback(() => {
    setPhase('discover');
  }, []);

  // Handle successful login -> boot into owner desktop
  const handleLogin = useCallback(() => {
    setPhase('booting');
  }, []);

  // Handle boot complete
  const handleBootComplete = useCallback(() => {
    setPhase('desktop');
  }, []);

  // Handle shutdown/logout from desktop
  const handleShutdown = useCallback(() => {
    logout();
    clearComputer();
    resetMyComputer();
    setPhase('discover');
  }, [logout, clearComputer, resetMyComputer]);

  // Handle exit from exploration
  const handleExitExplore = useCallback(() => {
    clearComputer();
    setPhase('discover');
  }, [clearComputer]);

  // Render based on phase
  if (phase === 'discover') {
    return (
      <DiscoverScreen 
        onDiscover={handleDiscover} 
        onLogin={handleGoToLogin} 
      />
    );
  }

  if (phase === 'login') {
    return (
      <LoginScreen 
        onLogin={handleLogin} 
        onBack={handleBackFromLogin} 
      />
    );
  }

  if (phase === 'booting') {
    return <BootScreen onBootComplete={handleBootComplete} />;
  }

  if (phase === 'exploring') {
    return <ExploreDesktop onExit={handleExitExplore} />;
  }

  // Desktop phase (owner mode)
  return <OwnerDesktop onShutdown={handleShutdown} />;
}

export default App;
