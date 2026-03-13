import { useState, useCallback } from 'react';
import { Desktop } from './components/Desktop';
import { BootScreen } from './components/BootScreen';
import { LoginScreen } from './components/LoginScreen';

type AppPhase = 'login' | 'booting' | 'desktop';

function App() {
  const [phase, setPhase] = useState<AppPhase>('login');

  const handleLogin = useCallback(() => {
    setPhase('booting');
  }, []);

  const handleBootComplete = useCallback(() => {
    setPhase('desktop');
  }, []);

  if (phase === 'login') {
    return <LoginScreen onLogin={handleLogin} />;
  }

  if (phase === 'booting') {
    return <BootScreen onBootComplete={handleBootComplete} />;
  }

  return <Desktop />;
}

export default App;
