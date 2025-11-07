"use client";
import { useEffect, useRef, useState } from "react";
// Create socket outside component so it persists
import io from "socket.io-client";
const socket = io("http://localhost:5000", { autoConnect: true });

export default function Chat() {
  const [status, setStatus] = useState("Idle");
  const [inCall, setInCall] = useState(false);
  const [partnerId, setPartnerId] = useState(null);
  const [micOn, setMicOn] = useState(true);
  const [speakerOn, setSpeakerOn] = useState(true);
  const [ringing, setRinging] = useState(false);

  const pcRef = useRef(null);
  const localAudio = useRef(null);
  const remoteAudio = useRef(null);
  const localStreamRef = useRef(null);
  const ringtoneRef = useRef(null);

  const startCall = async (targetId) => {
    pcRef.current = createPeerConnection(targetId);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    localStreamRef.current = stream;
    localAudio.current.srcObject = stream;
    stream.getTracks().forEach((t) => pcRef.current.addTrack(t, stream));
    const offer = await pcRef.current.createOffer();
    await pcRef.current.setLocalDescription(offer);
    socket.emit("offer", { targetId, offer });
  };
  const handleOffer = async (from, offer) => {
    pcRef.current = createPeerConnection(from);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    localStreamRef.current = stream;
    localAudio.current.srcObject = stream;
    stream.getTracks().forEach((t) => pcRef.current.addTrack(t, stream));
    await pcRef.current.setRemoteDescription(offer);
    const answer = await pcRef.current.createAnswer();
    await pcRef.current.setLocalDescription(answer);
    socket.emit("answer", { targetId: from, answer });
    setStatus("🟢 In Call");
    setInCall(true);
    stopRingtone();
  };

  useEffect(() => {
    if (!socket.connected) socket.connect();

    socket.on("waiting", () => setStatus("⏳ Waiting for a partner..."));

    socket.on("partner-found", async ({ partnerId }) => {
      setPartnerId(partnerId);
      setStatus("🎧 Partner found! Ringing...");
      playRingtone();
      setRinging(true);
      setTimeout(() => {
        stopRingtone();
        startCall(partnerId);
      }, 3000);
    });

    socket.on("offer", async ({ from, offer }) => {
      await handleOffer(from, offer);
    });

    socket.on("answer", async ({ answer }) => {
      if (pcRef.current.signalingState !== "have-local-offer") return;
      await pcRef.current.setRemoteDescription(answer);
      setStatus("🟢 In Call");
      setInCall(true);
      stopRingtone();
    });

    socket.on("ice-candidate", async ({ candidate }) => {
      if (candidate && pcRef.current) {
        try {
          await pcRef.current.addIceCandidate(candidate);
        } catch (e) {
          console.error("Error adding ICE candidate:", e);
        }
      }
    });

    return () => {
      socket.off(); // Clean listeners safely
    };
  }, [handleOffer,startCall]);

  const playRingtone = () => {
    if (ringtoneRef.current) {
      ringtoneRef.current.currentTime = 0;
      ringtoneRef.current.play().catch(() => {});
    }
  };

  const stopRingtone = () => {
    if (ringtoneRef.current) {
      ringtoneRef.current.pause();
      ringtoneRef.current.currentTime = 0;
      setRinging(false);
    }
  };

  const createPeerConnection = (targetId) => {
    const pc = new RTCPeerConnection();
    pc.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit("ice-candidate", { targetId, candidate: e.candidate });
      }
    };
    pc.ontrack = (e) => {
      remoteAudio.current.srcObject = e.streams[0];
    };
    return pc;
  };

  
  
  
  
  
  

  
  
  
  

  
  
  
  
  
  

  
  
  
  
  
  
  
  

  const endCall = () => {
    if (pcRef.current) pcRef.current.close();
    pcRef.current = null;
    setInCall(false);
    setPartnerId(null);
    setStatus("🔴 Call Ended");
    stopRingtone();
  };

  const nextPartner = () => {
    endCall();
    setStatus("🔄 Finding new partner...");
    socket.emit("find-partner");
  };

  const toggleMic = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setMicOn(audioTrack.enabled);
    }
  };

  const toggleSpeaker = () => {
    if (remoteAudio.current) {
      remoteAudio.current.muted = !remoteAudio.current.muted;
      setSpeakerOn(!remoteAudio.current.muted);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-2">🎙️ TalkPair</h1>
      <p className="text-gray-400 mb-6">{status}</p>

      <div className="flex items-center justify-center mb-8 space-x-10">
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-400 to-blue-600 shadow-lg flex items-center justify-center text-2xl font-bold animate-pulse">
          You
        </div>
        <div className="text-gray-400 text-2xl">🔊</div>
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-pink-400 to-pink-600 shadow-lg flex items-center justify-center text-2xl font-bold animate-pulse">
          {partnerId ? "User" : "?"}
        </div>
      </div>

      <div className="flex space-x-4">
        {!inCall ? (
          <button
            onClick={() => {
              setStatus("Searching for partner...");
              socket.emit("find-partner");
            }}
            className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200"
          >
            🔍 Find Partner
          </button>
        ) : (
          <>
            <button
              onClick={endCall}
              className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200"
            >
              🔴 End Call
            </button>
            <button
              onClick={nextPartner}
              className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200"
            >
              🔁 Next
            </button>
          </>
        )}
      </div>

      {inCall && (
        <div className="flex mt-6 space-x-6">
          <button
            onClick={toggleMic}
            className={`px-5 py-3 rounded-xl transition-all ${
              micOn ? "bg-blue-500" : "bg-gray-600"
            }`}
          >
            {micOn ? "🎤 Mic On" : "🔇 Mic Off"}
          </button>

          <button
            onClick={toggleSpeaker}
            className={`px-5 py-3 rounded-xl transition-all ${
              speakerOn ? "bg-yellow-500" : "bg-gray-600"
            }`}
          >
            {speakerOn ? "🔊 Speaker On" : "🔈 Speaker Off"}
          </button>
        </div>
      )}

      <audio ref={localAudio} autoPlay muted></audio>
      <audio ref={remoteAudio} autoPlay></audio>
      <audio ref={ringtoneRef} src="/ringtone.wav" />
    </div>
  );
}
