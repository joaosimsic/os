import { useState, useCallback } from 'react';
import { OSProvider } from './context/OSContext';
import { Desktop } from './components/Desktop';
import { BootScreen } from './components/BootScreen';

function App() {
  const [isBooting, setIsBooting] = useState(true);

  const handleBootComplete = useCallback(() => {
    setIsBooting(false);
  }, []);

  return (
    <OSProvider>
      {isBooting ? (
        <BootScreen onBootComplete={handleBootComplete} />
      ) : (
        <Desktop />
      )}
    </OSProvider>
  );
}

export default App;
