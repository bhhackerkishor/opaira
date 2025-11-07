"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";


export default function Home() {
  const [name, setName] = useState("");
  const router = useRouter();

  const handleJoin = () => {
    if (name.trim()) {
      localStorage.setItem("username", name);
      router.push("/com/chat");
    }
  };

  return (
    <div style={styles.container}>
      <h2>TalkPair 🎙️</h2>
      <input
        style={styles.input}
        placeholder="Enter your name..."
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button style={styles.button} onClick={handleJoin}>
        Join Chat
      </button>
    </div>
  );
}

const styles = {
  container: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", gap: 10 },
  input: { padding: "10px", width: "200px", borderRadius: "8px", border: "1px solid #aaa" },
  button: { padding: "10px 20px", borderRadius: "8px", background: "#0070f3", color: "white", border: "none" }
};
