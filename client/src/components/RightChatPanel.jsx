import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Link } from "react-router-dom";

import { io } from "socket.io-client";

import { useAuth } from "../context/AuthContext";
import api from "../services/api";

import "./RightChatPanel.css";

const socketUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

function avatarFor(user) {
  return (
    user?.avatar ||
    `https://placehold.co/64x64?text=${encodeURIComponent(
      user?.username?.[0]?.toUpperCase() || "U"
    )}`
  );
}

function sortConversations(items) {
  return [...items].sort((a, b) => {
    const aTime = new Date(a.messages?.[0]?.createdAt || a.createdAt).getTime();

    const bTime = new Date(b.messages?.[0]?.createdAt || b.createdAt).getTime();

    return bTime - aTime;
  });
}

function getPeer(conversation, currentUserId) {
  return conversation?.participants?.find(
    (participant) => participant.userId !== currentUserId
  )?.user;
}

function uniqueConversations(items, currentUserId) {
  const seen = new Set();

  return sortConversations(items).filter((conversation) => {
    const peerId = getPeer(conversation, currentUserId)?.id;

    if (!peerId || seen.has(peerId)) {
      return false;
    }

    seen.add(peerId);
    return true;
  });
}

export default function RightChatPanel() {
  const { user } = useAuth();

  const [conversations, setConversations] = useState([]);

  const [activeConversation, setActiveConversation] = useState(null);

  const [messages, setMessages] = useState([]);

  const [text, setText] = useState("");

  const [query, setQuery] = useState("");

  const [results, setResults] = useState([]);

  const [loading, setLoading] = useState(true);

  const [sending, setSending] = useState(false);

  const [error, setError] = useState("");

  const socketRef = useRef(null);

  const activeConversationRef = useRef(null);

  const conversationsRef = useRef([]);

  const activeUser = useMemo(
    () => getPeer(activeConversation, user?.id),
    [activeConversation, user?.id]
  );

  useEffect(() => {
    activeConversationRef.current = activeConversation;
  }, [activeConversation]);

  useEffect(() => {
    conversationsRef.current = conversations;
  }, [conversations]);

  const startConversation = useCallback(
    async (targetUserId) => {
      setError("");

      const res = await api.post("/conversations", {
        userId: targetUserId,
      });

      const conversation = res.data;

      setConversations(
        uniqueConversations(
          [conversation, ...conversationsRef.current],
          user?.id
        )
      );

      setActiveConversation(conversation);

      setQuery("");
      setResults([]);
    },
    [user?.id]
  );

  useEffect(() => {
    const socket = io(socketUrl, {
      withCredentials: true,
    });

    socketRef.current = socket;

    socket.on("chat-message", (message) => {
      setConversations((current) =>
        uniqueConversations(
          current.map((conversation) =>
            conversation.id === message.conversationId
              ? {
                  ...conversation,
                  messages: [message],
                }
              : conversation
          ),
          user?.id
        )
      );

      if (activeConversationRef.current?.id === message.conversationId) {
        setMessages((current) =>
          current.some((item) => item.id === message.id)
            ? current
            : [...current, message]
        );
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [user?.id]);

  useEffect(() => {
    let cancelled = false;

    async function loadConversations() {
      setLoading(true);

      try {
        const res = await api.get("/conversations");

        if (!cancelled) {
          setConversations(uniqueConversations(res.data || [], user?.id));
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || "Chats unavailable");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadConversations();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  useEffect(() => {
    if (!activeConversation?.id) {
      return;
    }

    let cancelled = false;

    socketRef.current?.emit("join-conversation", activeConversation.id);

    async function loadMessages() {
      try {
        const res = await api.get(`/messages/${activeConversation.id}`);

        if (!cancelled) {
          setMessages(res.data || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || "Messages unavailable");
        }
      }
    }

    loadMessages();

    return () => {
      cancelled = true;

      socketRef.current?.emit("leave-conversation", activeConversation.id);
    };
  }, [activeConversation?.id]);

  async function searchUsers() {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setError("");

    try {
      const res = await api.get(
        `/users/search?q=${encodeURIComponent(query.trim())}`
      );

      setResults((res.data || []).filter((person) => person.id !== user?.id));
    } catch (err) {
      setError(err.response?.data?.message || "Search failed");
    }
  }

  async function sendMessage() {
    const cleanText = text.trim();

    if (!cleanText || !activeConversation || sending) {
      return;
    }

    setSending(true);
    setText("");
    setError("");

    try {
      const res = await api.post("/messages", {
        text: cleanText,

        conversationId: activeConversation.id,
      });

      const message = res.data;

      setMessages((current) => [...current, message]);

      setConversations((current) =>
        uniqueConversations(
          current.map((conversation) =>
            conversation.id === message.conversationId
              ? {
                  ...conversation,
                  messages: [message],
                }
              : conversation
          ),
          user?.id
        )
      );

      socketRef.current?.emit("chat-message", message);
    } catch (err) {
      setText(cleanText);

      setError(err.response?.data?.message || "Send failed");
    } finally {
      setSending(false);
    }
  }

  function openConversation(conversation) {
    setActiveConversation(conversation);

    setResults([]);
    setQuery("");
  }

  if (activeConversation) {
    return (
      <section className="right-chat-panel right-chat-panel-open">
        <header className="right-chat-header">
          <button type="button" onClick={() => setActiveConversation(null)}>
            Back
          </button>

          <div className="right-chat-peer">
            <img src={avatarFor(activeUser)} alt="" />

            <span>@{activeUser?.username || "user"}</span>
          </div>
        </header>

        <div className="right-chat-messages">
          {messages.length === 0 ? (
            <p className="right-chat-empty">Start this chat.</p>
          ) : (
            messages.map((message) => (
              <div
                className={`right-chat-message ${
                  message.senderId === user?.id ? "is-mine" : ""
                }`}
                key={message.id}
              >
                {message.text}
              </div>
            ))
          )}
        </div>

        {error && <p className="right-chat-error">{error}</p>}

        <div className="right-chat-composer">
          <input
            value={text}
            placeholder="Message..."
            onChange={(event) => setText(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                sendMessage();
              }
            }}
          />

          <button
            type="button"
            onClick={sendMessage}
            disabled={sending || !text.trim()}
          >
            Send
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="right-chat-panel">
      <div className="right-chat-title">
        <div>
          <p>Direct</p>

          <h3>Messages</h3>
        </div>

        <Link to="/chat">Open</Link>
      </div>

      <div className="right-chat-search">
        <input
          value={query}
          placeholder="Search users"
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              searchUsers();
            }
          }}
        />

        <button type="button" onClick={searchUsers} disabled={!query.trim()}>
          Find
        </button>
      </div>

      {error && <p className="right-chat-error">{error}</p>}

      {results.length > 0 && (
        <div className="right-chat-list right-chat-results">
          {results.map((person) => (
            <button
              type="button"
              className="right-chat-row"
              key={person.id}
              onClick={() => startConversation(person.id)}
            >
              <img src={avatarFor(person)} alt="" />

              <span>
                <strong>@{person.username}</strong>

                <small>Start chat</small>
              </span>
            </button>
          ))}
        </div>
      )}

      <div className="right-chat-list">
        {loading ? (
          <p className="right-chat-empty">Loading messages...</p>
        ) : conversations.length === 0 ? (
          <p className="right-chat-empty">No chats yet.</p>
        ) : (
          conversations.slice(0, 6).map((conversation) => {
            const peer = getPeer(conversation, user?.id);

            const lastMessage = conversation.messages?.[0];

            return (
              <button
                type="button"
                className="right-chat-row"
                key={conversation.id}
                onClick={() => openConversation(conversation)}
              >
                <img src={avatarFor(peer)} alt="" />

                <span>
                  <strong>@{peer?.username || "user"}</strong>

                  <small>{lastMessage?.text || "Open chat"}</small>
                </span>
              </button>
            );
          })
        )}
      </div>
    </section>
  );
}
