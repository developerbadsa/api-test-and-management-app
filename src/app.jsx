import React, { useState } from "react";
import axios from "axios";

const API_BASE_URL = "https://movie-management-system-production-3733.up.railway.app/"; 
const TEST_TOKEN = ""; // Add your JWT token here if needed

const apis = [
  {
    name: "Register User",
    method: "POST",
    endpoint: "/register",
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
    payload: {
      email: "testuser@example.com",
      password: "password123",
    },
  },
  {
    name: "Create Movie",
    method: "POST",
    endpoint: "/movies",
    headers: { Authorization: `Bearer ${TEST_TOKEN}` },
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
    name: "Get Movies",
    method: "GET",
    endpoint: "/movies",
    headers: { Authorization: `Bearer ${TEST_TOKEN}` },
  },
  {
    name: "Rate Movie",
    method: "POST",
    endpoint: "/movies/1/rate",
    headers: { Authorization: `Bearer ${TEST_TOKEN}` },
    payload: { score: 5 },
  },
  {
    name: "Report Movie",
    method: "POST",
    endpoint: "/movies/1/report",
    headers: { Authorization: `Bearer ${TEST_TOKEN}` },
    payload: { reason: "Inappropriate content" },
  },
];

function App() {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const testApi = async (api) => {
    setLoading(true);
    setResponse("Loading...");

    const url = `${API_BASE_URL}${api.endpoint}`;
    const options = {
      method: api.method,
      headers: {
        "Content-Type": "application/json",
        ...(api.headers || {}),
      },
      data: api.payload || null,
      url: url,
    };

    try {
      const res = await axios(options);
      setResponse(JSON.stringify(res.data, null, 2));
    } catch (error) {
      setResponse(JSON.stringify(error.response?.data || error.message, null, 2));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>API Testing Page</h1>
      {apis.map((api, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ccc",
            marginBottom: "20px",
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          <h3>{api.name}</h3>
          <p>
            <strong>Endpoint:</strong> {api.method} {API_BASE_URL}
            {api.endpoint}
          </p>
          <p>
            <strong>Payload:</strong>
          </p>
          <textarea
            rows="6"
            cols="50"
            readOnly
            value={JSON.stringify(api.payload || {}, null, 2)}
            style={{ width: "100%" }}
          />
          <button
            onClick={() => testApi(api)}
            style={{
              padding: "10px 20px",
              marginTop: "10px",
              cursor: "pointer",
              backgroundColor: "#007BFF",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            {loading ? "Testing..." : "Test API"}
          </button>
        </div>
      ))}
      <div>
        <h3>Response:</h3>
        <pre
          style={{
            backgroundColor: "#f4f4f4",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            whiteSpace: "pre-wrap",
          }}
        >
          {response}
        </pre>
      </div>
    </div>
  );
}

export default App;
