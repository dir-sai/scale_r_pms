import React from 'react';

interface MapFallbackProps {
  error?: Error;
  onRetry?: () => void;
}

export function MapFallback({ error, onRetry }: MapFallbackProps) {
  return (
    <div className="min-h-[400px] bg-gray-100 rounded-lg p-4 flex flex-col items-center justify-center">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800">
          {error ? 'Map temporarily unavailable' : 'Loading map...'}
        </h3>
        
        {error && (
          <>
            <p className="text-gray-600 mt-2">
              We're having trouble loading the map. Please try again later.
            </p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Retry
              </button>
            )}
          </>
        )}

        {/* Static fallback content */}
        <div className="mt-4">
          <p className="text-sm text-gray-500">
            You can still view the property details and contact information below.
          </p>
        </div>
      </div>
    </div>
  );
}