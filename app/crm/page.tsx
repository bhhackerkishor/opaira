"use client"
import { useState, useEffect } from "react";
import axios from "axios";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [to, setTo] = useState("");
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("");

  const API_BASE = "https://crm-backend-c54a.onrender.com/api"; // your backend URL

  // Fetch messages
  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${API_BASE}/messages`);
      setMessages(res.data);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  // Auto-refresh every 5 seconds
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  // Send new message
  const sendMessage = async () => {
    if (!to || !message) return alert("Please enter phone and message");
    try {
      await axios.post(`${API_BASE}/send-message`, { to, message });
      setMessage("");
      fetchMessages();
    } catch (err) {
      alert("Failed to send message");
      console.error(err);
    }
  };

  // Filter messages by sender
  const filteredMessages = filter
    ? messages.filter((m) => m.from.includes(filter))
    : messages;

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" ,marginTop:"70px"}}>
      <h1>WhatsApp CRM</h1>

      {/* Send Message */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="Recipient number (e.g. 91XXXXXXXXXX)"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          style={{ flex: 2, padding: "10px" }}
        />
        <input
          type="text"
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ flex: 3, padding: "10px" }}
        />
        <button
          onClick={sendMessage}
          style={{
            background: "#25D366",
            color: "white",
            border: "none",
            padding: "10px 20px",
            cursor: "pointer",
            borderRadius: "5px",
          }}
        >
          Send
        </button>
      </div>

      {/* Filter */}
      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Filter by sender number"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ padding: "8px", width: "50%" }}
        />
      </div>

      {/* Messages Table */}
      <table width="100%" border="1" cellPadding="8">
        <thead>
          <tr style={{ background: "#f1f1f1" }}>
            <th>From</th>
            <th>To</th>
            <th>Message</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {filteredMessages.length > 0 ? (
            filteredMessages.map((msg) => (
              <tr key={msg._id}>
                <td>{msg.from}</td>
                <td>{msg.to}</td>
                <td>{msg.message}</td>
                <td>{new Date(msg.timestamp).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" align="center">
                No messages found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
