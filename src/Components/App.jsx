import { useState } from "react";
import axios from "axios";

const API_BASE_URL = "https://algolia-search-backend-production.up.railway.app";

const apis = [
  {
    "name": "Search Products",
    "method": "GET",
    "endpoint": "/api/search?query=calvin",
    "description": "Search for products in the Algolia index based on a query parameter.",
    "payload": {
      "query": "Product name or keyword"
    }
  },
  {
    "name": "Add Product",
    "method": "POST",
    "endpoint": "/api/add",
    "description": "Adds a new product to the Algolia index.",
    "payload": {
      "objectID": "123",
      "name": "Sample Product",
      "description": "Product description",
      "price": 100.00,
      "category": "Electronics"
    }
  },
  {
    "name": "Test API",
    "method": "GET",
    "endpoint": "/api/test",
    "description": "Test API to check if the server is running properly.",
    "payload": {}
  }
]

  


  const App = () => {
    const [activeApiIndex, setActiveApiIndex] = useState(null);
    const [customEndpoint, setCustomEndpoint] = useState("");
    const [customPayload, setCustomPayload] = useState("");
    const [jwtToken, setJwtToken] = useState("");
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loginError, setLoginError] = useState(null);
  
    const handleGetToken = async (email, password) => {
      try {
        const { data } = await axios.post(`${API_BASE_URL}/login`, { email, password });
        setJwtToken(data.token);
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
          data: api.method !== "GET" ? JSON.parse(customPayload || JSON.stringify(api.payload || {})) : null,
        });
        setResponse(JSON.stringify(res.data, null, 2));
      } catch (error) {
        setResponse(JSON.stringify(error.response?.data || error.message, null, 2));
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">API Testing Tool</h1>
  
        <div className="bg-white p-6 rounded shadow-md border border-gray-200 mb-6">
          <div className="flex items-center mb-2">
          <h2 className="text-xl font-semibold text-gray-700 ">Authorization</h2><span>(Not required)</span> 
          </div>
          <div className="flex gap-4 item">
            <button
              onClick={() => handleGetToken("user2@example.com", "User2@123")}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
            >
              Login as User
            </button>
            <button
              onClick={() => handleGetToken("user@example.com", "User@123")}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
            >
              Login as Admin
            </button>
          </div>
          {jwtToken && (
            <div className="mb-4">
              <h4 className="text-md font-medium text-gray-600">JWT Token</h4>
              <pre className="mt-2 bg-gray-800 text-white p-4 rounded break-all">{jwtToken}</pre>
            </div>
          )}
          {loginError && <p className="text-red-500">Error: {loginError}</p>}
        </div>
  
        <div className="space-y-4">
          {apis.map((api, index) => (
            <div key={index} className="bg-white p-4 rounded shadow-md border border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-700">{api.name}</h3>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  onClick={() => {
                    setActiveApiIndex(activeApiIndex === index ? null : index);
                    setCustomEndpoint(api.endpoint);
                    setCustomPayload(JSON.stringify(api.payload || {}, null, 2));
                    setResponse(null);
                  }}
                >
                  {activeApiIndex === index ? "Collapse" : "Expand"}
                </button>
              </div>
              {activeApiIndex === index && (
                <div className="mt-4">
                  <div className="bg-gray-100 p-4 rounded">
                    <h4 className="text-md font-medium text-gray-600">Edit Endpoint</h4>
                    <input
                      type="text"
                      value={customEndpoint}
                      onChange={(e) => setCustomEndpoint(e.target.value)}
                      className="w-full mt-2 p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                    />
                  </div>
                  {api.method !== "GET" && (
                    <div className="bg-gray-100 p-4 rounded mt-4">
                      <h4 className="text-md font-medium text-gray-600">Edit Request Body</h4>
                      <textarea
                        rows="6"
                        value={customPayload}
                        onChange={(e) => setCustomPayload(e.target.value)}
                        className="w-full mt-2 p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                      ></textarea>
                    </div>
                  )}
                  <button
                    className={`mt-4 px-6 py-2 text-white rounded ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"}`}
                    onClick={() => handleTestApi(api)}
                    disabled={loading}
                  >
                    {loading ? "Executing..." : "Execute"}
                  </button>
                  {response && (
                    <div className="mt-4">
                      <h4 className="text-md font-medium text-gray-600">Response</h4>
                      <pre className="mt-2 bg-gray-800 text-white p-4 rounded break-all">{response}</pre>
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

