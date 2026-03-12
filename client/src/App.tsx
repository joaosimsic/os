import { useState, useCallback } from 'react';
import { OSProvider } from './context/OSContext';
import { Desktop } from './components/Desktop';
import { BootScreen } from './components/BootScreen';

function App() {
  const [isBooting, setIsBooting] = useState(true);

  const handleBootComplete = useCallback(() => {
    setIsBooting(false);
  }, []);

  if (isBooting) {
    return <BootScreen onBootComplete={handleBootComplete} />;
  }

  return (
    <OSProvider>
      <Desktop />
    </OSProvider>
  );
}

export default App;
