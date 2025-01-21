import React, { useState } from "react";
import axios from "axios";

const API_BASE_URL = "https://movie-management-system-production-3733.up.railway.app";

const apis = [
    {
      name: "Register User",
      method: "POST",
      endpoint: "/register",
      description: "Registers a new user with username, email, password, and role.",
      payload: {
        username: "testuser",
        email: "testuser@example.com",
        password: "password123",
        role: "USER",
      },
    },
    {
      name: "Login User",
      method: "POST",
      endpoint: "/login",
      description: "Logs in a user and returns a JWT token.",
      payload: {
        email: "user@example.com",
        password: "User@123",
      },
    },
    {
      name: "Get All Movies",
      method: "GET",
      endpoint: "/movies",
      description: "Retrieves a list of all movies with their details and ratings.",
    },
    {
      name: "Create Movie",
      method: "POST",
      endpoint: "/movies",
      description: "Creates a new movie. Only authenticated users can perform this action.",
      payload: {
        title: "Inception",
        description: "A mind-bending thriller",
        releasedAt: "2010-07-16",
        duration: 148,
        genre: "Sci-Fi",
        language: "English",
      },
    },
    {
      name: "Update Movie",
      method: "PUT",
      endpoint: "/movies/:id",
      description: "Updates the details of a specific movie. Only the creator can perform this action.",
      payload: {
        title: "Updated Movie Title",
        description: "Updated description",
        releasedAt: "2022-01-01",
        duration: 150,
        genre: "Drama",
        language: "English",
      },
    },
    {
      name: "Rate Movie",
      method: "POST",
      endpoint: "/movies/:id/rate",
      description: "Rates a specific movie. Ratings range from 1 to 5.",
      payload: {
        score: 4,
      },
    },
    {
      name: "Report Movie",
      method: "POST",
      endpoint: "/movies/:id/report",
      description: "Reports a specific movie. Only authenticated users can perform this action.",
      payload: {
        reason: "Inappropriate content",
      },
    },
    {
      name: "Get All Reports (Admin Only)",
      method: "GET",
      endpoint: "/admin/reports",
      description: "Retrieves all movie reports. Only accessible by admins.",
    },
    {
      name: "Resolve Report (Admin Only)",
      method: "POST",
      endpoint: "/admin/reports/:id/resolve",
      description: "Approves or rejects a movie report. Only accessible by admins.",
      payload: {
        action: "approve", // or "reject"
      },
    },
    {
      name: "Test Endpoint",
      method: "GET",
      endpoint: "/test",
      description: "A simple test endpoint to verify API connectivity.",
    },
  ];
  

const App = () => {
  const [activeApi, setActiveApi] = useState(null);
  const [customEndpoint, setCustomEndpoint] = useState("");
  const [customPayload, setCustomPayload] = useState("");
  const [jwtToken, setJwtToken] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [validationResponse, setValidationResponse] = useState("");

  console.log(jwtToken)

  const handleGetTokenUser = async () => {
    const loginApi = apis.find((api) => api.name === "Login User");
    if (!loginApi) return;

    try {
      const response = await axios.post(
        `${API_BASE_URL}${loginApi.endpoint}`,
        {
            email: "user2@example.com",
            password: "User2@123",
        }
      );
      setJwtToken(response.data.token);
      setLoginError(null);
    } catch (error) {
      setJwtToken("");
      setLoginError(error.response?.data?.message || "Failed to fetch token");
    }
  };

  const handleGetTokenAdmin = async () => {
    const loginApi = apis.find((api) => api.name === "Login User");
    if (!loginApi) return;

    try {
      const response = await axios.post(
        `${API_BASE_URL}${loginApi.endpoint}`,
       {
        email: "user@example.com",
        password: "User@123",
       }
      );
      setJwtToken(response.data.token);
      setLoginError(null);
    } catch (error) {
      setJwtToken("");
      setLoginError(error.response?.data?.message || "Failed to fetch token");
    }
  };


  const handleTestApi = async (api) => {
    setLoading(true);
    setResponse("Loading...");
    const endpoint = customEndpoint || api.endpoint;

    try {
      const res = await axios({
        method: api.method,
        url: `${API_BASE_URL}${endpoint}`,
        headers: {
          "Content-Type": "application/json",
          ...(jwtToken && { Authorization: `Bearer ${jwtToken}` }),
        },
        data:
          api.method !== "GET"
            ? JSON.parse(customPayload || JSON.stringify(api.payload || {}))
            : null,
      });
      setResponse(JSON.stringify(res.data, null, 2));
    } catch (error) {
      setResponse(
        JSON.stringify(error.response?.data || error.message, null, 2)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        API Testing Tool
      </h1>

      {/* Token Authorization Section */}
      <div className="bg-white p-6 rounded shadow-md border border-gray-200 mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Authorization
        </h2>
        <div className="flex gap-4">
          <button
            onClick={handleGetTokenUser}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
          >
            Login and Set Token as user
          </button>
          <button
            onClick={handleGetTokenAdmin}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
          >
            Login and Set Token as Admin
          </button>
        </div>
        {jwtToken && (
          <div className="mb-4">
            <h4 className="text-md font-medium text-gray-600">JWT Token</h4>
            <pre className="mt-2 bg-gray-800 text-white p-4 rounded break-all">
              {jwtToken}
            </pre>
          </div>
        )}
        {loginError && <p className="text-red-500">Error: {loginError}</p>}
        {/* <button
          onClick={handleValidateToken}
          disabled={!jwtToken}
          className={`px-4 py-2 text-white rounded ${
            !jwtToken
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          Validate Token
        </button> */}
        {validationResponse && (
          <div className="mt-4">
            <h4 className="text-md font-medium text-gray-600">
              {validationResponse.includes("valid")
                ? "Validation Success"
                : "Validation Failed"}
            </h4>
            <pre className="mt-2 bg-gray-800 text-white p-4 rounded break-all">
              {validationResponse}
            </pre>
          </div>
        )}
      </div>

      {/* API Testing Section */}
      <div className="space-y-6">
        {apis.map((api, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded shadow-md border border-gray-200"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-700">
                {api.name}
              </h3>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => {
                  setActiveApi(api);
                  setCustomEndpoint(api.endpoint);
                  setCustomPayload(JSON.stringify(api.payload || {}, null, 2));
                }}
              >
                Try it out
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">{api.description}</p>
            {activeApi === api && (
              <div className="mt-4">
                <div className="bg-gray-100 p-4 rounded">
                  <h4 className="text-md font-medium text-gray-600">
                    Edit Endpoint
                  </h4>
                  <input
                    type="text"
                    value={customEndpoint}
                    onChange={(e) => setCustomEndpoint(e.target.value)}
                    className="w-full mt-2 p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                  />
                </div>
                {api.method !== "GET" && (
                  <div className="bg-gray-100 p-4 rounded mt-4">
                    <h4 className="text-md font-medium text-gray-600">
                      Edit Request Body
                    </h4>
                    <textarea
                      rows="6"
                      value={customPayload}
                      onChange={(e) => setCustomPayload(e.target.value)}
                      className="w-full mt-2 p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                    ></textarea>
                  </div>
                )}
                <button
                  className={`mt-4 px-6 py-2 text-white rounded ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                  onClick={() => handleTestApi(api)}
                  disabled={loading}
                >
                  {loading ? "Executing..." : "Execute"}
                </button>
                {response && (
                  <div className="mt-4">
                    <h4 className="text-md font-medium text-gray-600">
                      Response
                    </h4>
                    <pre className="mt-2 bg-gray-800 text-white p-4 rounded break-all">
                      {response}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;

