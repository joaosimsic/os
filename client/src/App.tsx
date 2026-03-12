import { OSProvider } from './context/OSContext';
import { Desktop } from './components/Desktop';

function App() {
  return (
    <OSProvider>
      <Desktop />
    </OSProvider>
  );
}

export default App;
