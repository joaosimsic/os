import { useState } from 'react';
import { useAuthStore } from '../../store/auth';

interface LoginScreenProps {
  onLogin: () => void;
  onBack: () => void;
}

export function LoginScreen({ onLogin, onBack }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  
  const { login, register, isLoading, error, clearError } = useAuthStore();

  const handleSubmit = async () => {
    if (!username || !password) return;
    
    const success = isRegisterMode 
      ? await register(username, password)
      : await login(username, password);
    
    if (success) {
      onLogin();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    clearError();
  };

  return (
    <div className="bg-win-teal fixed inset-0 z-[9999] flex items-center">
      <div className="border-r-win-dark-gray border-b-win-dark-gray bg-win-gray flex h-[60%] w-1/2 items-center justify-center border-t-2 border-r-2 border-b-2 border-t-white">
        <div className="border-inset text-win-dark-gray flex aspect-square h-[70%] items-center justify-center border-2 bg-white p-4">
          <svg
            viewBox="0 0 64 64"
            fill="currentColor"
            className="h-full w-full"
          >
            <circle cx="32" cy="20" r="12" />
            <path d="M32 36c-14 0-24 8-24 16v8h48v-8c0-8-10-16-24-16z" />
          </svg>
        </div>
      </div>
      <div className="border-b-win-dark-gray bg-win-gray flex h-[60%] w-1/2 items-center justify-center border-t-2 border-b-2 border-l-2 border-t-white border-l-white">
        <div className="flex w-[70%] flex-col gap-3">
          <div className="mb-2 text-center">
            <p className="text-sm font-bold text-black">
              {isRegisterMode ? 'Create Account' : 'Welcome Back'}
            </p>
            <p className="mt-1 text-xs text-gray-600">
              {isRegisterMode 
                ? 'Create your life capsule' 
                : 'Access your life capsule'}
            </p>
          </div>

          {error && (
            <div className="border-inset border-2 bg-white p-2">
              <p className="text-xs text-red-600">{error}</p>
            </div>
          )}

          <div className="flex w-full items-center justify-center gap-2">
            <label className="w-20 text-xs text-black">Username:</label>
            <input
              type="text"
              className="border-inset font-inherit w-[70%] border-2 bg-white px-1.5 py-1 text-xs focus:outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              disabled={isLoading}
            />
          </div>
          <div className="flex w-full items-center justify-center gap-2">
            <label className="w-20 text-xs text-black">Password:</label>
            <input
              type="password"
              className="border-inset font-inherit w-[70%] border-2 bg-white px-1.5 py-1 text-xs focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
          </div>
          <div className="mt-2 flex w-full justify-center gap-2">
            <div className="w-20"></div>
            <div className="flex w-[70%] justify-between">
              <button
                className="border-outset bg-win-gray font-inherit active:border-inset min-w-[75px] cursor-pointer border-2 px-4 py-1 text-xs hover:bg-[#d0d0d0]"
                onClick={onBack}
                disabled={isLoading}
              >
                Back
              </button>
              <button
                className="border-outset bg-win-gray font-inherit active:border-inset min-w-[75px] cursor-pointer border-2 px-4 py-1 text-xs hover:bg-[#d0d0d0] disabled:opacity-50"
                onClick={handleSubmit}
                disabled={isLoading || !username || !password}
              >
                {isLoading ? '...' : isRegisterMode ? 'Register' : 'Login'}
              </button>
            </div>
          </div>
          
          <div className="mt-2 text-center">
            <button
              className="text-xs text-blue-700 underline hover:text-blue-900"
              onClick={toggleMode}
              disabled={isLoading}
            >
              {isRegisterMode 
                ? 'Already have an account? Login' 
                : 'New here? Create account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
