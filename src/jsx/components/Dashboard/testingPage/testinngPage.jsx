import React, { useState } from "react";

const TestingPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleStreamResponse = async (url, payload) => {
    setLoading(true);
    setError(null);
    setJobs([]); // Clear previous results

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error("ReadableStream not supported");
      }

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        // Decode the current chunk and add it to our buffer
        buffer += decoder.decode(value, { stream: true });

        // Split on newlines, keeping any partial line in the buffer
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        // Process each complete line
        for (const line of lines) {
          if (line.trim()) {
            try {
              // Remove 'data: ' prefix if it exists
              const jsonStr = line.startsWith('data: ') ? line.slice(6) : line;
              const parsedData = JSON.parse(jsonStr);

              if (parsedData.status === "complete") {
                console.log("Stream complete:", parsedData.message);
              } else if (parsedData.matches) {
                setJobs(prevJobs => [...prevJobs, ...parsedData.matches]);
              }
            } catch (err) {
              console.warn("Error parsing line:", err, line);
            }
          }
        }
      }

      // Handle any remaining data in buffer
      if (buffer.trim()) {
        try {
          const jsonStr = buffer.startsWith('data: ') ? buffer.slice(6) : buffer;
          const parsedData = JSON.parse(jsonStr);
          if (parsedData.matches) {
            setJobs(prevJobs => [...prevJobs, ...parsedData.matches]);
            console.log("response",jobs)
          }
        } catch (err) {
          console.warn("Error parsing final buffer:", err);
        }
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => {
    handleStreamResponse(
      "https://us-east1-foursssolutions.cloudfunctions.net/Get_Jobs_From_Database_Comparing_Resume_streaming_v2",
      { email_id: "sravya.vya2@gmail.com" }
    );
  };

  const resumeSuggestions = () => {
    handleStreamResponse(
      "https://us-east1-foursssolutions.cloudfunctions.net/resume_update_suggestions_all_streaming_v2",
      {
        email_id: "ankitraowaves@gmail.com",
        file_name: "Muni_Duplicate.docx",
        job_id: "1jddFfzHnIwOY5cRAAAAAA=="
      }
    );
  };

  const tailoredJobs = () => {
    handleStreamResponse(
      "https://us-east1-foursssolutions.cloudfunctions.net/resume_update_suggestions_tailored_job_streaming_v2",
      {
        email_id: "careersavvy.ai@gmail.com",
        job_description: "Senior Data Scientist\n Knowledge of machine learning algos as well as good in NLP..."
      }
    );
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-wrap gap-4 mb-4" style={{color:"black !important"}}>
        <button
          onClick={handleSend}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 transition-colors"
          disabled={loading}
        >
          {loading ? "Loading..." : "Show Jobs"}
        </button>
        <button
          onClick={resumeSuggestions}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 transition-colors"
          disabled={loading}
        >
          {loading ? "Loading..." : "Resume Suggestions"}
        </button>
        <button
          onClick={tailoredJobs}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 transition-colors"
          disabled={loading}
        >
          {loading ? "Loading..." : "Tailored Jobs"}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}

      <div className="grid gap-4">
        {jobs.length > 0 ? (
          jobs.map((job, index) => (
            <div
              // key={`${job.job_id || index}`}
              className="border rounded p-4 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {job.job_title}
                  </h2>
                  <p className="text-gray-600">
                    {job.employer_name} | {job.job_publisher}
                  </p>
                  <p className="text-gray-500">
                    {job.job_city}, {job.job_state}
                  </p>
                </div>
                <a
                  href={job.job_apply_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition-colors"
                >
                  Apply
                </a>
              </div>
              {/* <div className="mt-2">
                <p className="text-gray-700 whitespace-pre-line">{job.job_description}</p>
                {job.job_highlights?.Qualifications && (
                  <div className="mt-4">
                    <h3 className="font-semibold mb-2">Qualifications:</h3>
                    <ul className="list-disc ml-5">
                      {job.job_highlights.Qualifications.map((qual, idx) => (
                        <li key={idx} className="text-gray-600 mb-1">
                          {qual}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {job.employer_website && (
                  <p className="text-blue-500 mt-2">
                    <a 
                      href={job.employer_website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      Company Website
                    </a>
                  </p>
                )}
              </div> */}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">
            {loading ? "Loading jobs..." : "No jobs available"}
          </p>
        )}
      </div>
    </div>
  );
};

export default TestingPage;