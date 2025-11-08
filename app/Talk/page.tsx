"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import io from "socket.io-client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, MicOff, Video, VideoOff, Volume2, VolumeX, PhoneOff } from "lucide-react";
import { useSession } from "next-auth/react";
import { useUI } from "@/context/UIContext";
import Image from 'next/image';
import SettingsMenu from "@/components/SettingsMenu";

export default function TalkPage() {
  const { data: session }: any = useSession();
  const [socket, setSocket] = useState<any>(null);
  const [registered, setRegistered] = useState(false);
  const [inCall, setInCall] = useState(false);
  const [partnerName, setPartnerName] = useState("");
  const [partnerId, setPartnerId] = useState<string | null>(null);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [speakerOn, setSpeakerOn] = useState(true);
  const [statusMsg, setStatusMsg] = useState("");
  const [searching, setSearching] = useState(false);
  const [prefs, setPrefs] = useState({
    skipPreviousPartner: false,
    soundEffects: false,
    autoConnect: false,
  });
  const [userCount, setUserCount] = useState(0);
  


  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const searchingAudio = useRef<HTMLAudioElement | null>(null);
  const endAudio = useRef<HTMLAudioElement | null>(null);

  const { setShowNavbar ,settings,setSettings,lastPartnerId, setLastPartnerId} = useUI();
function startCall() {
  setShowNavbar(false); // 👈 hide navbar
  // start your call logic
}
  // Setup Socket.io
  useEffect(() => {
    const s = io("https://server-09p9.onrender.com");
    setSocket(s);
  
    const saved = localStorage.getItem("talk_settings");
    if (saved) setPrefs(JSON.parse(saved));
    console.log("at talk", saved);
  
    s.on("connect", () => setStatusMsg("✅ Connected to server"));
    s.on("disconnect", () => setStatusMsg("❌ Disconnected"));
    s.on("status", (msg: string) => setStatusMsg(msg));
    s.on("user-count", (count: number) => {
  setUserCount(count);
});
  
    s.on("waiting", (msg: string) => {
      setStatusMsg(msg);
      if (settings.soundEffects) playSearchingSound();
    });
  
    s.on("partner-found", async ({ partnerId, partnerName, initiator }) => {
      stopSearchingSound();
  
      if (settings.skipPreviousPartner && partnerId === lastPartnerId) {
        console.log("Skipping same partner...");
        s.emit("skip-partner", { partnerId });
        s.emit("find-partner");
        return;
      }
  
      setPartnerId(partnerId);
      setPartnerName(partnerName);
      setSearching(false);
      startCall();
      setInCall(true);
      setStatusMsg(`🎯 Matched with ${partnerName}`);
  
      const localStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30, max: 60 },
          facingMode: "user",
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 2,
        },
      });
  
      localStreamRef.current = localStream;
      if (localVideoRef.current) localVideoRef.current.srcObject = localStream;
  
      const pc = createPeerConnection(s, partnerId);
      pcRef.current = pc;
      localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));
  
      if (initiator) {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        s.emit("signal", { to: partnerId, offer });
      }
    });
  
    s.on("signal", async ({ from, offer, answer, candidate }) => {
      const pc = pcRef.current;
      if (!pc) return;
      if (offer) {
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const ans = await pc.createAnswer();
        await pc.setLocalDescription(ans);
        s.emit("signal", { to: from, answer: ans });
      } else if (answer) {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
      } else if (candidate) {
        if (pc.remoteDescription)
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });
  
    s.on("partner-left", () => {
      setStatusMsg("⚠️ Partner left.");
      playEndSound();
      endCall();
      if (settings.autoConnect) findPartner();
    });
  
    s.on("call-ended", () => {
      setStatusMsg("📞 Call ended by partner.");
      playEndSound();
      endCall();
      if (settings.autoConnect) findPartner();
    });
  
    // ✅ Proper cleanup
    return () => {
      s.disconnect();
    };
  }, []); // ✅ Only one useEffect
  

  // Register automatically with session name
  useEffect(() => {
    //console.log(session);
    if (session?.user?.name && socket && !registered) {
      socket.emit("register", session.user.name);
      setRegistered(true);
      setStatusMsg(`Welcome, ${session.user.name}`);
      
    }
  }, [session, socket]);

  function createPeerConnection(socket: any, partnerId: string) {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    const remoteStream = new MediaStream();
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;

    pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach((t) => remoteStream.addTrack(t));
    };

    pc.onicecandidate = (event) => {
      if (event.candidate)
        socket.emit("signal", { to: partnerId, candidate: event.candidate });
    };

    return pc;
  }

  // 🔊 Sound Functions
  function playSearchingSound() {
    stopSearchingSound();
    searchingAudio.current = new Audio("/sounds/searching.wav");
    searchingAudio.current.loop = true;
    searchingAudio.current.play().catch(() => {});
  }

  function stopSearchingSound() {
    if (searchingAudio.current) {
      searchingAudio.current.pause();
      searchingAudio.current = null;
    }
  }

  function playEndSound() {
    endAudio.current = new Audio("/sounds/end.mp3");
    endAudio.current.play().catch(() => {});
  }

  // User Actions
  function findPartner() {
    socket.emit("find-partner");
    setSearching(true);
    setStatusMsg("🔍 Searching for a partner...");
    if (settings.soundEffects) playSearchingSound();
  }
  function cancelSearch() {
    if (!socket) return;
    socket.emit("cancel-search");
     stopSearchingSound();
    setSearching(false);
    setStatusMsg("❌ Search cancelled");
  }
  

  function endCall() {
     stopSearchingSound();
    if (settings.soundEffects) playEndSound();
    setShowNavbar(true); // 👈 show navbar
    if (partnerId) socket.emit("end-call", { partnerId });
    
    cleanup();
    if (settings.autoConnect) findPartner();
  }

  function cleanup() {
    setInCall(false);
    setPartnerId(null);
    setPartnerName("");
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
  }

  // Toggles
  function toggleMic() {
    const stream = localStreamRef.current;
    if (!stream) return;
    stream.getAudioTracks().forEach((t) => (t.enabled = !t.enabled));
    setMicOn((prev) => !prev);
  }

  function toggleCam() {
    const stream = localStreamRef.current;
    if (!stream) return;
    stream.getVideoTracks().forEach((t) => (t.enabled = !t.enabled));
    setCamOn((prev) => !prev);
  }

  function toggleSpeaker() {
    if (remoteVideoRef.current) remoteVideoRef.current.muted = speakerOn;
    setSpeakerOn((prev) => !prev);
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 to-white text-gray-900 font-[Poppins]">
      {/* 🔸 Hide TalkConnect card when registered or in call */}
      
      <SettingsMenu /> 
      

<div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
  <div className="bg-black/60 text-white px-4 py-2 rounded-full shadow-md text-sm font-medium backdrop-blur-md">
    <AnimatePresence mode="wait">
      <motion.p
        key={userCount}
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 5 }}
        transition={{ duration: 0.3 }}
        className="text-center"
      >
        👥 {userCount} {userCount === 1 ? "user" : "users"} online
      </motion.p>
    </AnimatePresence>
  </div>
</div>
  


      {!inCall && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="z-20 w-full max-w-md"
          >
            <Card className="p-6 rounded-2xl shadow-md border border-yellow-200 bg-white">
              <h1 className="text-3xl font-bold mb-3 text-yellow-600 text-center">
                TalkConnect 🎧
              </h1>
              <p className="text-sm text-center mb-4">{statusMsg}</p>
              
              {searching && <div className="flex justify-center"> 
                <Image
      src="/gif.gif" // Replace with your GIF's path
      alt="Seacrching"
      width={150} // Set appropriate width
      height={80} // Set appropriate height
      unoptimized={true} // Essential for GIF animation
    /></div>}
            {registered && (
       <div className="flex justify-center gap-3">
         {!searching ? (
           <Button onClick={findPartner} className="bg-yellow-500 text-white">
             Find Partner
           </Button>
         ) : (
           <Button onClick={cancelSearch} className="bg-red-500 text-white">
             Cancel
           </Button>
         )}
       </div>
      )}

            </Card>
          </motion.div>
        </AnimatePresence>
      )}

      {/* 🧠 Video Section */}
      <AnimatePresence>
        {inCall && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black flex justify-center items-center"
          >
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Local small preview */}
            <motion.div
              className="absolute top-4 left-4 w-28 h-40 rounded-xl overflow-hidden border-2 border-yellow-400 shadow-lg md:w-40 md:h-56"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover scale-x-[-1]"
              />
            </motion.div>

            {/* Control buttons */}
            <motion.div
              className="fixed bottom-6 inset-x-0 flex justify-center gap-5 px-4"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <Button
                onClick={toggleMic}
                className="rounded-full w-12 h-12 bg-gray-800 text-white hover:bg-gray-700"
              >
                {micOn ? <Mic size={20} /> : <MicOff size={20} />}
              </Button>
              <Button
                onClick={toggleCam}
                className="rounded-full w-12 h-12 bg-gray-800 text-white hover:bg-gray-700"
              >
                {camOn ? <Video size={20} /> : <VideoOff size={20} />}
              </Button>
              <Button
                onClick={toggleSpeaker}
                className="rounded-full w-12 h-12 bg-gray-800 text-white hover:bg-gray-700"
              >
                {speakerOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
              </Button>
              <Button
                onClick={()=>{
                  endCall();
                  setStatusMsg("Call ended");
                }}
                className="rounded-full w-12 h-12 bg-red-600 hover:bg-red-500 text-white"
              >
                <PhoneOff size={20} />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
