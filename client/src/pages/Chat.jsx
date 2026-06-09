import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Link, useParams } from "react-router-dom";

import { io } from "socket.io-client";

import { useAuth } from "../context/AuthContext";
import LeftSidebar from "../layout/LeftSidebar";
import api from "../services/api";

import "./Chat.css";

const socketUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

function avatarFor(user) {
  return (
    user?.avatar ||
    `https://placehold.co/80x80?text=${encodeURIComponent(
      user?.username?.[0]?.toUpperCase() || "U"
    )}`
  );
}

function messageTime(date) {
  if (!date) {
    return "";
  }

  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

function sortConversations(items) {
  return [...items].sort((a, b) => {
    const aTime = new Date(a.messages?.[0]?.createdAt || a.createdAt).getTime();

    const bTime = new Date(b.messages?.[0]?.createdAt || b.createdAt).getTime();

    return bTime - aTime;
  });
}

function getConversationPeerId(conversation, currentUserId) {
  return conversation.participants?.find(
    (participant) => participant.userId !== currentUserId
  )?.userId;
}

function uniqueConversations(items, currentUserId) {
  const seen = new Set();

  return sortConversations(items).filter((conversation) => {
    const peerId = getConversationPeerId(conversation, currentUserId);

    if (!peerId || seen.has(peerId)) {
      return false;
    }

    seen.add(peerId);
    return true;
  });
}

export default function Chat() {
  const { userId } = useParams();

  const { user } = useAuth();

  const [conversations, setConversations] = useState([]);

  const [activeConversation, setActiveConversation] = useState(null);

  const [messages, setMessages] = useState([]);

  const [text, setText] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const [searchResults, setSearchResults] = useState([]);

  const [loading, setLoading] = useState(true);

  const [messagesLoading, setMessagesLoading] = useState(false);

  const [searching, setSearching] = useState(false);

  const [sending, setSending] = useState(false);

  const [error, setError] = useState("");

  const [showDetails, setShowDetails] = useState(false);

  const socketRef = useRef(null);

  const activeConversationRef = useRef(null);

  const conversationsRef = useRef([]);

  useEffect(() => {
    activeConversationRef.current = activeConversation;
  }, [activeConversation]);

  useEffect(() => {
    conversationsRef.current = conversations;
  }, [conversations]);

  const activeUser = useMemo(
    () =>
      activeConversation?.participants?.find(
        (participant) => participant.userId !== user?.id
      )?.user,
    [activeConversation, user?.id]
  );

  const startConversation = useCallback(
    async (targetUserId, currentInbox) => {
      setError("");

      const res = await api.post("/conversations", {
        userId: targetUserId,
      });

      const conversation = res.data;

      const baseInbox = currentInbox || conversationsRef.current;

      const conversationPeerId = getConversationPeerId(conversation, user?.id);

      const nextInbox = uniqueConversations(
        [
          conversation,
          ...baseInbox.filter((item) => {
            const itemPeerId = getConversationPeerId(item, user?.id);

            return (
              item.id !== conversation.id && itemPeerId !== conversationPeerId
            );
          }),
        ],
        user?.id
      );

      setConversations(nextInbox);

      setActiveConversation(conversation);

      setSearchTerm("");
      setSearchResults([]);

      return conversation;
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

    async function loadInbox() {
      setLoading(true);
      setError("");

      try {
        const res = await api.get("/conversations");

        const inbox = uniqueConversations(res.data || [], user?.id);

        if (cancelled) {
          return;
        }

        setConversations(inbox);

        if (userId) {
          await startConversation(userId, inbox);
          return;
        }

        setActiveConversation(inbox[0] || null);
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || "Could not load chats");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadInbox();

    return () => {
      cancelled = true;
    };
  }, [startConversation, user?.id, userId]);

  useEffect(() => {
    if (!activeConversation?.id) {
      return;
    }

    const socket = socketRef.current;

    socket?.emit("join-conversation", activeConversation.id);

    let cancelled = false;

    async function loadMessages() {
      setMessagesLoading(true);
      setError("");

      try {
        const res = await api.get(`/messages/${activeConversation.id}`);

        if (!cancelled) {
          setMessages(res.data || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || "Could not load messages");
        }
      } finally {
        if (!cancelled) {
          setMessagesLoading(false);
        }
      }
    }

    loadMessages();

    return () => {
      cancelled = true;

      socket?.emit("leave-conversation", activeConversation.id);
    };
  }, [activeConversation?.id]);

  async function searchUsers() {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    setError("");

    try {
      const res = await api.get(
        `/users/search?q=${encodeURIComponent(searchTerm.trim())}`
      );

      setSearchResults((res.data || []).filter((item) => item.id !== user?.id));
    } catch (err) {
      setError(err.response?.data?.message || "Search failed");
    } finally {
      setSearching(false);
    }
  }

  function selectConversation(conversation) {
    setActiveConversation(conversation);

    setShowDetails(false);
  }

  function pushLastMessage(message) {
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
  }

  async function sendMessage(overrideText) {
    const cleanText = (overrideText ?? text).trim();

    if (!cleanText || !activeConversation || sending) {
      return;
    }

    setSending(true);
    if (!overrideText) {
      setText("");
    }
    setError("");

    try {
      const res = await api.post("/messages", {
        text: cleanText,

        conversationId: activeConversation.id,
      });

      const message = res.data;

      setMessages((current) => [...current, message]);

      pushLastMessage(message);

      socketRef.current?.emit("chat-message", message);
    } catch (err) {
      if (!overrideText) {
        setText(cleanText);
      }

      setError(err.response?.data?.message || "Send failed");
    } finally {
      setSending(false);
    }
  }

  function sendQuickLike() {
    sendMessage("Liked your message");
  }

  function onComposerKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="chat-page">
      <LeftSidebar />

      <main className="chat-shell">
        <aside className="chat-inbox">
          <div className="chat-sidebar-header">
            <div>
              <p className="chat-kicker">Direct</p>

              <h1>Messages</h1>
            </div>

            <Link
              className="chat-profile-link"
              to={`/profile/${user?.username}`}
            >
              <img src={avatarFor(user)} alt="" />
            </Link>
          </div>

          <div className="chat-search">
            <input
              value={searchTerm}
              placeholder="Search people"
              onChange={(event) => setSearchTerm(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  searchUsers();
                }
              }}
            />

            <button
              type="button"
              onClick={searchUsers}
              disabled={searching || !searchTerm.trim()}
            >
              {searching ? "..." : "Find"}
            </button>
          </div>

          {searchResults.length > 0 && (
            <div className="chat-search-results">
              {searchResults.map((person) => (
                <button
                  type="button"
                  className="chat-person-row"
                  key={person.id}
                  onClick={() => startConversation(person.id)}
                >
                  <img src={avatarFor(person)} alt="" />

                  <span>
                    <strong>@{person.username}</strong>

                    <small>{person.bio || "Start a conversation"}</small>
                  </span>
                </button>
              ))}
            </div>
          )}

          <div className="chat-thread-list">
            {loading ? (
              <div className="chat-empty-small">Loading chats...</div>
            ) : conversations.length === 0 ? (
              <div className="chat-empty-small">
                Search for someone to send your first message.
              </div>
            ) : (
              conversations.map((conversation) => {
                const otherUser = conversation.participants?.find(
                  (participant) => participant.userId !== user?.id
                )?.user;

                const lastMessage = conversation.messages?.[0];

                return (
                  <button
                    type="button"
                    className={`chat-thread ${
                      activeConversation?.id === conversation.id
                        ? "is-active"
                        : ""
                    }`}
                    key={conversation.id}
                    onClick={() => selectConversation(conversation)}
                  >
                    <img src={avatarFor(otherUser)} alt="" />

                    <span>
                      <strong>@{otherUser?.username || "user"}</strong>

                      <small>{lastMessage?.text || "No messages yet"}</small>
                    </span>

                    <time>
                      {messageTime(
                        lastMessage?.createdAt || conversation.createdAt
                      )}
                    </time>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        <section className="chat-main">
          {error && <div className="chat-error">{error}</div>}

          {!activeConversation ? (
            <div className="chat-empty-state">
              <div className="chat-empty-icon">DM</div>

              <h2>Your messages</h2>

              <p>Send private messages to builders in your CohortX network.</p>
            </div>
          ) : (
            <>
              <header className="chat-main-header">
                <div className="chat-peer">
                  <img src={avatarFor(activeUser)} alt="" />

                  <span>
                    <strong>@{activeUser?.username || "user"}</strong>

                    <small>Active conversation</small>
                  </span>
                </div>

                <div className="chat-actions">
                  {activeUser && (
                    <Link to={`/profile/${activeUser.username}`}>Profile</Link>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowDetails((value) => !value)}
                  >
                    Info
                  </button>
                </div>
              </header>

              {showDetails && (
                <div className="chat-details">
                  <img src={avatarFor(activeUser)} alt="" />

                  <div>
                    <strong>@{activeUser?.username}</strong>

                    <p>{activeUser?.bio || "No bio yet."}</p>
                  </div>
                </div>
              )}

              <div className="chat-messages">
                {messagesLoading ? (
                  <div className="chat-empty-small">Loading messages...</div>
                ) : messages.length === 0 ? (
                  <div className="chat-empty-small">
                    Say hello to start this chat.
                  </div>
                ) : (
                  messages.map((message) => {
                    const isMine = message.senderId === user?.id;

                    return (
                      <div
                        className={`chat-message-row ${
                          isMine ? "is-mine" : ""
                        }`}
                        key={message.id}
                      >
                        {!isMine && (
                          <img
                            src={avatarFor(message.sender || activeUser)}
                            alt=""
                          />
                        )}

                        <div className="chat-bubble-wrap">
                          <div className="chat-bubble">{message.text}</div>

                          <time>{messageTime(message.createdAt)}</time>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <footer className="chat-composer">
                <button
                  type="button"
                  className="chat-like-button"
                  onClick={sendQuickLike}
                  disabled={sending}
                >
                  Like
                </button>

                <textarea
                  value={text}
                  placeholder="Message..."
                  rows="1"
                  onChange={(event) => setText(event.target.value)}
                  onKeyDown={onComposerKeyDown}
                />

                <button
                  type="button"
                  onClick={sendMessage}
                  disabled={sending || !text.trim()}
                >
                  {sending ? "Sending" : "Send"}
                </button>
              </footer>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
