import React from 'react';

const Loading = () => {
  return (
    <div>
        <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-gray-900"></div>
        </div>
    </div>
  );
}

export default Loading;