import React, { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Search,
  SquarePen,
  Trash2,
  Pin,
  Edit2,
  MoreHorizontal,
  Menu,
  ChevronLeft,
  Sparkles,
  Paperclip,
  ArrowLeft,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import "./ChatBot.css";

export const ChatBot = ({ forceFullPage = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();

  const isChatPage = location.pathname === "/chat" || forceFullPage;
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(null);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameId, setRenameId] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const scrollRef = useRef(null);
  const renameInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const didInit = useRef(false);

  const createNewChat = () => {
    const newSession = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
      isPinned: false,
    };
    setSessions((prev) => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    setInputValue("");
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);

    if (!didInit.current) {
      const savedSessions = localStorage.getItem(
        "world_to_go_chatbot_sessions",
      );
      if (savedSessions) {
        try {
          const parsed = JSON.parse(savedSessions);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSessions(parsed);
            setCurrentSessionId(parsed[0].id);
          } else {
            createNewChat();
          }
        } catch (e) {
          createNewChat();
        }
      } else {
        createNewChat();
      }
      didInit.current = true;
    }

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (didInit.current && sessions.length > 0) {
      localStorage.setItem(
        "world_to_go_chatbot_sessions",
        JSON.stringify(sessions),
      );
    }
  }, [sessions]);

  useEffect(() => {
    if (isRenaming && renameInputRef.current) {
      renameInputRef.current.focus();
    }
  }, [isRenaming]);

  const currentSession = useMemo(
    () => sessions.find((s) => s.id === currentSessionId),
    [sessions, currentSessionId],
  );
  const messages = useMemo(
    () => currentSession?.messages || [],
    [currentSession],
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const updateCurrentSession = (updatedMessages) => {
    if (!currentSessionId) return;
    setSessions((prev) =>
      prev.map((session) =>
        session.id === currentSessionId
          ? { ...session, messages: updatedMessages }
          : session,
      ),
    );
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const newUserMsg = {
      id: Date.now(),
      type: "user",
      content: inputValue,
    };
    const updatedMessages = [...messages, newUserMsg];
    updateCurrentSession(updatedMessages);
    setInputValue("");
    setIsTyping(true);

    if (messages.length === 0) {
      const newTitle =
        inputValue.slice(0, 30) + (inputValue.length > 30 ? "..." : "");
      setSessions((prev) =>
        prev.map((session) =>
          session.id === currentSessionId
            ? { ...session, title: newTitle }
            : session,
        ),
      );
    }

    setTimeout(() => {
      const input = newUserMsg.content.toLowerCase().trim();
      let response = "";

      if (input === "hello" || input === "hi" || input === "hey") {
        response =
          "Hello! I'm your World Explorer AI Assistant. I can help you learn about countries worldwide!";
      } else if (input.includes("your name")) {
        response =
          "I'm the World Explorer AI Assistant, your dedicated travel companion.";
      } else if (input.includes("countries")) {
        response =
          "I can help you explore countries! Visit our countries page to browse by region, search for specific countries, and learn fascinating facts.";
      } else if (input.includes("population") || input.includes("area")) {
        response =
          "I can provide information about countries' populations, areas, capitals, and more! Try visiting our countries page to explore.";
      } else if (input.includes("search")) {
        response =
          "You can search for countries in the Countries page using the search bar. Type a country name to filter results!";
      } else if (input.includes("help")) {
        response =
          "I can help you explore countries, find information about regions, and answer questions about world geography. What would you like to know?";
      } else if (input.includes("map")) {
        response =
          "Browse all countries in our interactive Countries page. You can sort by region, search by name, and view detailed information!";
      } else if (input.includes("capital")) {
        response =
          "Each country has a capital city! Visit the Countries page to find capital cities and other details about any country you're interested in.";
      } else if (input.includes("region") || input.includes("continent")) {
        response =
          "Countries are organized by region. Visit the Countries page to explore countries by their geographic location!";
      } else if (input.includes("language")) {
        response =
          "Different countries speak different languages. In the Countries page, you can find detailed information about languages spoken worldwide.";
      } else if (input.includes("currency")) {
        response =
          "Each country uses a different currency. Check the Countries page for detailed information about currencies used in different nations.";
      } else if (input.includes("about")) {
        response =
          "World to Go is your premium country explorer. Discover nations, learn facts, and explore the world from your screen!";
      } else {
        const botResponses = [
          "That's interesting! Let me know if you'd like to explore specific countries or regions.",
          "I understand. Feel free to ask me anything about countries and world geography!",
          "Great question! Our Countries page has comprehensive information about nations worldwide.",
        ];
        response =
          botResponses[Math.floor(Math.random() * botResponses.length)];
      }

      const botMsg = {
        id: Date.now() + 1,
        type: "bot",
        content: response + " How else can I help you?",
      };
      updateCurrentSession([...updatedMessages, botMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const deleteChat = (id) => {
    const newSessions = sessions.filter((session) => session.id !== id);
    setSessions(newSessions);
    if (currentSessionId === id && newSessions.length > 0) {
      setCurrentSessionId(newSessions[0].id);
    } else if (newSessions.length === 0) {
      createNewChat();
    }
    setMenuOpen(null);
  };

  const togglePinChat = (id) => {
    setSessions((prev) =>
      prev.map((session) =>
        session.id === id
          ? { ...session, isPinned: !session.isPinned }
          : session,
      ),
    );
    setMenuOpen(null);
  };

  const openRenameModal = (id, currentTitle) => {
    setRenameId(id);
    setRenameValue(currentTitle);
    setIsRenaming(true);
    setMenuOpen(null);
  };

  const handleRename = () => {
    if (renameValue.trim()) {
      setSessions((prev) =>
        prev.map((session) =>
          session.id === renameId
            ? { ...session, title: renameValue.trim() }
            : session,
        ),
      );
    }
    setIsRenaming(false);
    setRenameId(null);
    setRenameValue("");
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return days + " days ago";
    return d.toLocaleDateString();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setInputValue(
      (prev) => prev + (prev.trim() ? " " : "") + `[File: ${file.name}] `,
    );

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const filteredGroupedSessions = useMemo(() => {
    const filtered = sessions.filter((s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    const pinned = filtered.filter((s) => s.isPinned);
    const unpinned = filtered.filter((s) => !s.isPinned);

    const grouped = {};
    if (pinned.length > 0) grouped["Pinned"] = pinned;

    unpinned.forEach((session) => {
      const dateKey = formatDate(session.createdAt);
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(session);
    });

    return grouped;
  }, [sessions, searchQuery]);

  const handleGoBack = () => {
    navigate(-1);
  };

  if (!mounted) return null;

  // Render sidebar
  const renderSidebar = () => (
    <>
      {/* Mobile Overlay */}
      <div
        className={`chatbot-overlay ${
          isSidebarOpen ? "chatbot-overlay--open" : "chatbot-overlay--closed"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{
          width: isSidebarOpen ? 320 : 0,
          x: isSidebarOpen ? 0 : -320,
          opacity: isSidebarOpen ? 1 : 0,
        }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="chatbot-sidebar"
      >
        <div className="chatbot-sidebar-header">
          <div className="chatbot-sidebar-brand cursor-default">
            <button
              onClick={handleGoBack}
              className="chatbot-sidebar-back-btn"
              title="Go Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="chatbot-logo">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="chatbot-sidebar-title">World Explorer</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="chatbot-sidebar-close-btn"
            title="Hide Sidebar"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        <div className="chatbot-sidebar-actions">
          <button onClick={createNewChat} className="chatbot-new-btn">
            <SquarePen className="w-4 h-4" />
            New Chat
          </button>
        </div>

        <div className="chatbot-search-wrap">
          <div className="relative group">
            <Search className="chatbot-search-icon w-4 h-4 text-foreground/40" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="chatbot-search-input"
            />
          </div>
        </div>

        <div className="chatbot-session-list">
          {Object.entries(filteredGroupedSessions).map(
            ([date, sessionsList]) => (
              <div key={date} className="chatbot-session-group">
                <h3 className="chatbot-date-label cursor-default">{date}</h3>
                <div className="chatbot-session-list-inner">
                  {sessionsList.map((session) => (
                    <div
                      key={session.id}
                      className={`chatbot-session-item ${
                        currentSessionId === session.id
                          ? "chatbot-session-item--active"
                          : "chatbot-session-item--inactive"
                      }`}
                      onClick={() => {
                        setCurrentSessionId(session.id);
                        if (isMobile) setIsSidebarOpen(false);
                      }}
                    >
                      <div className="chatbot-session-item-left">
                        <MessageSquare
                          className={`w-4 h-4 shrink-0 ${
                            currentSessionId === session.id
                              ? "text-blue-400"
                              : "text-foreground/40"
                          }`}
                        />
                        <span className="chatbot-session-item-title">
                          {session.title}
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpen(
                            menuOpen === session.id ? null : session.id,
                          );
                        }}
                        className="chatbot-session-menu-button"
                      >
                        <MoreHorizontal className="w-4 h-4 text-foreground/40" />
                      </button>

                      {menuOpen === session.id && (
                        <div className="chatbot-session-menu">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePinChat(session.id);
                            }}
                            className="chatbot-session-menu-option"
                          >
                            <Pin className="w-4 h-4" />
                            {session.isPinned ? "Unpin" : "Pin"}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openRenameModal(session.id, session.title);
                            }}
                            className="chatbot-session-menu-option"
                          >
                            <Edit2 className="w-4 h-4" />
                            Rename
                          </button>
                          <div className="my-1 h-px bg-border" />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteChat(session.id);
                            }}
                            className="chatbot-session-menu-option chatbot-session-menu-option--danger"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ),
          )}
        </div>
      </motion.div>
    </>
  );

  const renderRenameModal = () => (
    <AnimatePresence>
      {isRenaming && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="chatbot-modal-overlay"
          onClick={() => setIsRenaming(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="chatbot-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="chatbot-modal-title">Rename Thread</h3>
            <input
              ref={renameInputRef}
              type="text"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              className="chatbot-modal-input"
            />
            <div className="chatbot-modal-actions">
              <button
                onClick={() => setIsRenaming(false)}
                className="chatbot-modal-button"
              >
                Cancel
              </button>
              <button
                onClick={handleRename}
                className="chatbot-modal-button chatbot-modal-button--primary"
              >
                Save
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const renderChatContent = () => {
    return (
      <div className="chatbot-main">
        <div className="chatbot-main-inner">
          {!isSidebarOpen && (
            <motion.div
              initial={{ x: -60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -60, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 200 }}
              className="chatbot-collapsed-rail"
            >
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="chatbot-rail-button group"
              >
                <Menu className="w-5 h-5 text-foreground/60" />
                <div className="chatbot-tooltip">Open Sidebar</div>
              </button>

              <div className="chatbot-rail-divider" />

              <button
                onClick={createNewChat}
                className="chatbot-rail-button group"
              >
                <SquarePen className="w-5 h-5 text-foreground/60" />
                <div className="chatbot-tooltip">New Chat</div>
              </button>

              <button
                onClick={() => setIsSidebarOpen(true)}
                className="chatbot-rail-button group"
              >
                <Search className="w-5 h-5 text-foreground/60" />
                <div className="chatbot-tooltip">Search</div>
              </button>
            </motion.div>
          )}

          {/* Chat Messages */}
          <div ref={scrollRef} className="chatbot-message-area">
            <div className="chatbot-message-inner">
              {messages.length === 0 ? (
                <div className="chatbot-empty-state">
                  <div className="chatbot-empty-icon">
                    <Sparkles className="w-8 h-8 text-blue-400" />
                  </div>
                  <h2 className="chatbot-empty-title">
                    Welcome to World Explorer AI
                  </h2>
                  <p className="chatbot-empty-text">
                    Your assistant for exploring countries worldwide. Ask me
                    anything!
                  </p>
                </div>
              ) : (
                <div className="chatbot-message-stack">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`chatbot-message-row ${
                        msg.type === "user" ? "justify-end" : "justify-start"
                      } ${msg.type === "user" ? "chatbot-message-row--user" : "chatbot-message-row--bot"}`}
                    >
                      {msg.type === "bot" && (
                        <div className="chatbot-bot-avatar">
                          <Bot className="w-5 h-5 text-blue-400" />
                        </div>
                      )}
                      <div
                        className={`chatbot-message-bubble ${
                          msg.type === "user"
                            ? "chatbot-message-bubble--user"
                            : "chatbot-message-bubble--bot"
                        }`}
                      >
                        {msg.content}
                      </div>
                      {msg.type === "user" && (
                        <div className="chatbot-user-avatar">
                          <User className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {isTyping && (
                <div>
                  <div className="chatbot-typing-row">
                    <div className="chatbot-bot-avatar">
                      <Bot className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="chatbot-typing-dots">
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Input Area */}
          <div className="chatbot-input-area">
            <div className="chatbot-input-shell">
              <div className="chatbot-input-row">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx,.txt"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="chatbot-attach-btn"
                  title="Attach file"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
                <textarea
                  rows={1}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask about countries, regions, or travel..."
                  className="chatbot-textarea"
                />
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isTyping}
                  className={`chatbot-send-btn ${
                    inputValue.trim() && !isTyping
                      ? "chatbot-send-btn--active"
                      : "chatbot-send-btn--disabled"
                  }`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="chatbot-footer">Powered by World Explorer AI</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isChatPage) {
    return (
      <div className="chatbot-page">
        <div className="chatbot-shell">
          {renderSidebar()}
          {renderChatContent()}
          {renderRenameModal()}
        </div>
      </div>
    );
  }

  return createPortal(
    <div className="chatbot-float-wrapper">
      {/* Tooltip */}
      <div className="chatbot-float-tooltip">
        Open World Explorer AI
        <div className="absolute bottom-[-5px] right-6 w-2.5 h-2.5 bg-foreground rotate-45" />
      </div>

      <motion.button
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => navigate("/chat")}
        className="chatbot-float-btn"
        aria-label="Open World Explorer AI chat"
      >
        <MessageSquare className="w-6 h-6 text-white chatbot-float-icon" />
        <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 transition-opacity chatbot-float-glow" />
      </motion.button>
    </div>,
    document.body,
  );
};
