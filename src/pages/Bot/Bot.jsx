import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Markdown from "react-markdown";
import { Send, Sparkles, RotateCcw, WifiOff } from "lucide-react";
import { API_URL } from "../../config";
import { UserData } from "../../context/UserContext";
import { Avatar } from "../../components/ui";

const SUGGESTIONS = [
  "Explain closures in JavaScript with an example",
  "What's the difference between SQL and NoSQL?",
  "Give me a 4-week plan to learn React",
  "How does a REST API work?",
];

const welcome = { id: 0, sender: "bot", text: "Hi! I'm your AI tutor. Ask me about any topic you're learning — I'll explain it step by step." };

const Bot = () => {
  const { user } = UserData();
  const [socket, setSocket] = useState(null);
  const [status, setStatus] = useState("connecting"); // connecting | online | offline
  const [messages, setMessages] = useState([welcome]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const s = io(API_URL, {
      auth: { token: localStorage.getItem("token") },
      transports: ["websocket", "polling"],
      reconnectionAttempts: 10,
    });
    s.on("connect", () => setStatus("online"));
    s.on("disconnect", () => setStatus("offline"));
    s.on("connect_error", () => setStatus("offline"));
    s.on("ai-message-response", (text) => {
      setThinking(false);
      setMessages((m) => [...m, { id: Date.now(), sender: "bot", text }]);
    });
    setSocket(s);
    return () => s.disconnect();
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, thinking]);

  const send = (text = input) => {
    const msg = text.trim();
    if (!msg || !socket || thinking || status !== "online") return;
    setMessages((m) => [...m, { id: Date.now(), sender: "user", text: msg }]);
    setInput("");
    setThinking(true);
    socket.emit("ai-message", msg);
    inputRef.current?.focus();
  };

  const reset = () => {
    socket?.emit("ai-reset");
    setMessages([welcome]);
    setThinking(false);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="bot-page">
      <div className="container bot-shell">
        <div className="bot-head">
          <div className="row">
            <div className="bot-avatar">
              <Sparkles size={20} />
            </div>
            <div>
              <h1>AI Tutor</h1>
              <span className={`bot-status ${status}`}>
                <i /> {status === "online" ? "Online" : status === "connecting" ? "Connecting…" : "Reconnecting…"}
              </span>
            </div>
          </div>
          <button className="btn btn-sm btn-ghost" onClick={reset} disabled={messages.length <= 1}>
            <RotateCcw size={15} /> New chat
          </button>
        </div>

        <div className="bot-messages">
          {messages.map((m) => (
            <div key={m.id} className={`msg ${m.sender}`}>
              {m.sender === "bot" ? (
                <div className="bot-avatar sm">
                  <Sparkles size={14} />
                </div>
              ) : (
                <Avatar name={user?.name} src={user?.avatar} size={30} />
              )}
              <div className="bubble">
                {m.sender === "bot" ? <Markdown>{m.text}</Markdown> : <p>{m.text}</p>}
              </div>
            </div>
          ))}
          {thinking && (
            <div className="msg bot">
              <div className="bot-avatar sm">
                <Sparkles size={14} />
              </div>
              <div className="bubble typing">
                <span />
                <span />
                <span />
              </div>
            </div>
          )}
          {messages.length === 1 && (
            <div className="suggestions">
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => send(s)} disabled={status !== "online"}>
                  {s}
                </button>
              ))}
            </div>
          )}
          <div ref={endRef} />
        </div>

        {status === "offline" && (
          <div className="alert alert-warning" style={{ margin: "0 0 12px" }}>
            <WifiOff size={18} /> Can't reach the tutor right now. The server may be waking up — it'll reconnect
            automatically.
          </div>
        )}

        <form
          className="bot-input"
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
        >
          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Ask anything… (Shift + Enter for a new line)"
            maxLength={4000}
          />
          <button className="btn btn-primary" type="submit" disabled={!input.trim() || thinking || status !== "online"} aria-label="Send">
            <Send size={18} />
          </button>
        </form>
        <p className="bot-note">AI can make mistakes. Double-check important information with your instructor.</p>
      </div>
    </div>
  );
};

export default Bot;
