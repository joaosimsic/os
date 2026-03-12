import { useState, useCallback } from 'react';
import { Desktop } from './components/Desktop';
import { BootScreen } from './components/BootScreen';

function App() {
  const [isBooting, setIsBooting] = useState(true);

  const handleBootComplete = useCallback(() => {
    setIsBooting(false);
  }, []);

  return (
    <>
      {isBooting ? (
        <BootScreen onBootComplete={handleBootComplete} />
      ) : (
        <Desktop />
      )}
    </>
  );
}

export default App;
