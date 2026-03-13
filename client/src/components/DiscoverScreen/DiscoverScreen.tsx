import { useComputerStore } from '../../store/computer';

interface DiscoverScreenProps {
  onDiscover: () => void;
  onLogin: () => void;
}

export function DiscoverScreen({ onDiscover, onLogin }: DiscoverScreenProps) {
  const { isLoading, error, clearError, discoverRandom } = useComputerStore();

  const handleDiscover = async () => {
    await discoverRandom();
    onDiscover();
  };

  return (
    <div className="bg-win-teal fixed inset-0 flex flex-col items-center justify-center">
      {/* Title */}
      <div className="mb-12 text-center">
        <h1 className="mb-2 text-4xl font-bold tracking-tight text-white drop-shadow-lg">
          NetRoulette
        </h1>
        <p className="text-sm text-white/80">
          Anonymous Life Capsule Network
        </p>
      </div>

      {/* Main container */}
      <div className="border-outset bg-win-gray w-[400px] border-2 p-6">
        <div className="mb-6 text-center">
          <p className="text-sm text-black">
            Discover fragments of strangers' lives through their personal computers.
          </p>
          <p className="mt-2 text-xs text-gray-600 italic">
            "The most meaningful eulogies come from strangers."
          </p>
        </div>

        {error && (
          <div className="border-inset mb-4 border-2 bg-white p-2">
            <p className="text-xs text-red-600">{error}</p>
            <button
              className="mt-1 text-xs text-blue-600 underline"
              onClick={clearError}
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Discover button */}
        <button
          className="border-outset bg-win-gray active:border-inset mb-4 w-full cursor-pointer border-2 px-4 py-3 text-sm font-bold hover:bg-[#d0d0d0] disabled:cursor-not-allowed disabled:opacity-50"
          onClick={handleDiscover}
          disabled={isLoading}
        >
          {isLoading ? 'Discovering...' : 'Discover a Life'}
        </button>

        <div className="my-4 flex items-center">
          <div className="h-px flex-1 bg-gray-400"></div>
          <span className="px-3 text-xs text-gray-500">or</span>
          <div className="h-px flex-1 bg-gray-400"></div>
        </div>

        {/* Login to manage your own */}
        <button
          className="border-outset bg-win-gray active:border-inset w-full cursor-pointer border-2 px-4 py-2 text-sm hover:bg-[#d0d0d0]"
          onClick={onLogin}
        >
          Create Your Own Life Capsule
        </button>

        <p className="mt-4 text-center text-xs text-gray-500">
          Leave a piece of yourself for strangers to find.
        </p>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-xs text-white/60">
        <p>No profiles. No followers. No reputation.</p>
        <p className="mt-1">Just anonymous human connection.</p>
      </div>
    </div>
  );
}
