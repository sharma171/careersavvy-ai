import React, { useState } from 'react';
import { Streaming } from 'react-streaming';

const GPTStreamingComponent = () => {
  const [prompt, setPrompt] = useState('');

  // Function to fetch streaming response from your API
  const fetchStream = async () => {
    const response = await fetch('/api/gpt-stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.body) throw new Error('No response body');

    return response.body;
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter your prompt..."
        />
      </div>

      <button
        onClick={() => setPrompt('')}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Send
      </button>

      <div className="mt-4 p-4 border rounded bg-gray-50">
        <Streaming.Suspense fallback={<div>Loading...</div>}>
          <Streaming stream={fetchStream()}>
            {(chunk) => {
              const decoder = new TextDecoder();
              const text = decoder.decode(chunk);
              return <span>{text}</span>;
            }}
          </Streaming>
        </Streaming.Suspense>
      </div>
    </div>
  );
};

// Default export
export default GPTStreamingComponent;
