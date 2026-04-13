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
import "./ChatBot.css";

const Motion = motion;

export const ChatBot = ({ forceFullPage = false }) => {
  const navigate = useNavigate();
  const location = useLocation();

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
  const [countryKnowledge, setCountryKnowledge] = useState([]);
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
        } catch {
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
    fetch("https://openapi.programming-hero.com/api/all")
      .then((res) => res.json())
      .then((data) => {
        setCountryKnowledge(data?.countries || []);
      })
      .catch(() => {
        setCountryKnowledge([]);
      });
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

  const formatNumber = (value) => {
    if (typeof value !== "number") return "N/A";
    return value.toLocaleString();
  };

  const normalize = (value = "") => value.toLowerCase().trim();

  const extractText = (value) => {
    if (value == null) return [];
    if (typeof value === "string" || typeof value === "number") {
      const v = String(value).trim();
      return v ? [v] : [];
    }

    if (Array.isArray(value)) {
      return value.flatMap((item) => extractText(item));
    }

    if (typeof value === "object") {
      if (typeof value.name === "string") return extractText(value.name);
      if (typeof value.common === "string") return extractText(value.common);
      if (typeof value.official === "string") {
        return extractText(value.official);
      }
      if (typeof value.symbol === "string") return extractText(value.symbol);

      return Object.values(value).flatMap((item) => extractText(item));
    }

    return [];
  };

  const toReadableList = (value) => {
    const items = Array.from(new Set(extractText(value))).filter(Boolean);
    return items.length ? items.join(", ") : "N/A";
  };

  const toFlagEmoji = (country) => {
    const code = (country?.cca2 || "").toUpperCase();
    if (!/^[A-Z]{2}$/.test(code)) return "";
    const base = 127397;
    return code
      .split("")
      .map((char) => String.fromCodePoint(base + char.charCodeAt(0)))
      .join("");
  };

  const findCountryFromQuestion = (question) => {
    const q = normalize(question);
    if (!q || !countryKnowledge.length) return null;

    return (
      countryKnowledge.find((country) => {
        const common = normalize(country?.name?.common);
        const official = normalize(country?.name?.official);
        return (
          (common && q.includes(common)) || (official && q.includes(official))
        );
      }) || null
    );
  };

  const findCountryByCapitalMention = (question) => {
    const q = normalize(question);
    if (!q || !countryKnowledge.length) return null;

    return (
      countryKnowledge.find((country) => {
        const capitals = extractText(country?.capital);
        return capitals.some((capital) => {
          const normalizedCapital = normalize(capital);
          return normalizedCapital && q.includes(normalizedCapital);
        });
      }) || null
    );
  };

  const buildCountrySummary = (country) => {
    if (!country) return null;

    const name = country?.name?.common || "This country";
    const capital = country?.capital?.capital || country?.capital?.[0] || "N/A";
    const region = country?.region?.region || country?.region || "N/A";
    const subregion =
      country?.subregion?.subregion || country?.subregion || "N/A";
    const population = formatNumber(
      country?.population?.population || country?.population,
    );
    const area = `${formatNumber(country?.area?.area || country?.area)} km2`;
    const languages = toReadableList(country?.languages);
    const currencies = toReadableList(country?.currencies);
    const flagEmoji = toFlagEmoji(country);
    const flagImage = country?.flags?.flags?.png || country?.flags?.png || "";

    return {
      name,
      capital,
      region,
      subregion,
      population,
      area,
      languages,
      currencies,
      flagEmoji,
      flagImage,
      rawText: `${name}: capital ${capital}, region ${region}, subregion ${subregion}, population ${population}, area ${area}, languages ${languages}, currencies ${currencies}.`,
    };
  };

  const resolveCountryQuestion = (question) => {
    const country =
      findCountryFromQuestion(question) ||
      findCountryByCapitalMention(question);
    if (!country) return null;

    const q = normalize(question);
    const summary = buildCountrySummary(country);

    if (!summary) return null;

    if (q.includes("capital")) {
      return `The capital of ${summary.name} is ${summary.capital}.`;
    }
    if (q.includes("population")) {
      return `${summary.name} has a population of ${summary.population}.`;
    }
    if (q.includes("area") || q.includes("size")) {
      return `${summary.name} covers an area of ${summary.area}.`;
    }
    if (q.includes("region") || q.includes("continent")) {
      return `${summary.name} is in ${summary.region} (${summary.subregion}).`;
    }
    if (q.includes("language")) {
      return `Languages spoken in ${summary.name}: ${summary.languages}.`;
    }
    if (q.includes("currency")) {
      return `Currencies used in ${summary.name}: ${summary.currencies}.`;
    }
    if (q.includes("flag")) {
      if (summary.flagEmoji) {
        return `${summary.name} flag: ${summary.flagEmoji}`;
      }
      if (summary.flagImage) {
        return `You can view the ${summary.name} flag here: ${summary.flagImage}`;
      }
      return `I could not find a flag source for ${summary.name}.`;
    }
    if (
      q.includes("cca3") ||
      q.includes("country code") ||
      q.includes("code")
    ) {
      return `The CCA3 code for ${summary.name} is ${country?.cca3 || "N/A"}.`;
    }

    return `${summary.rawText}`;
  };

  const resolveGeneralFallback = (question) => {
    const q = normalize(question);

    if (!q) {
      return "Ask me anything. I can help with countries, coding, travel, study tips, and general guidance.";
    }

    if (q.includes("cca3")) {
      return "CCA3 is a three-letter country code standard (ISO 3166-1 alpha-3), like BGD for Bangladesh or JPN for Japan.";
    }

    const mathExpr = question.replace(/[^0-9+\-*/().%\s]/g, "").trim();
    if (
      mathExpr &&
      /^[0-9+\-*/().%\s]+$/.test(mathExpr) &&
      /[+\-*/%]/.test(mathExpr)
    ) {
      try {
        const result = Function(`"use strict"; return (${mathExpr})`)();
        if (Number.isFinite(result)) {
          return `The result is ${result}.`;
        }
      } catch {
        // Ignore parse errors and continue with other fallbacks.
      }
    }

    if (q.includes("time") || q.includes("date") || q.includes("today")) {
      const now = new Date();
      return `Current local date/time: ${now.toLocaleString()}.`;
    }

    if (q.includes("hello") || q.includes("hi") || q.includes("hey")) {
      return "Hello! Ask me any question and I will do my best to help.";
    }

    if (q.includes("how are you")) {
      return "I am doing great. Tell me what you want to know and I will help.";
    }

    if (
      q.includes("largest country") ||
      q.includes("biggest country in the world")
    ) {
      return "The largest country in the world by area is Russia.";
    }

    return "I can answer this. For richer and more detailed responses on any topic, keep the AI API key configured and ask your question in one line with context.";
  };

  const askDeepSeek = async (question, countryContext = "") => {
    const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
    if (!apiKey) return null;

    let timeout;

    try {
      const controller = new AbortController();
      timeout = setTimeout(() => controller.abort(), 7000);

      const response = await fetch(
        "https://api.deepseek.com/v1/chat/completions",
        {
          method: "POST",
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "deepseek-chat",
            messages: [
              {
                role: "system",
                content:
                  "You are World Explorer AI, a helpful general assistant. Answer any type of question clearly and concisely. When country context is provided, prioritize factual country data.",
              },
              {
                role: "user",
                content: countryContext
                  ? `Country context: ${countryContext}\n\nUser question: ${question}`
                  : question,
              },
            ],
            temperature: 0.3,
          }),
        },
      );

      if (!response.ok) return null;
      const data = await response.json();
      return data?.choices?.[0]?.message?.content?.trim() || null;
    } catch {
      return null;
    } finally {
      if (timeout) clearTimeout(timeout);
    }
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

    try {
      const input = newUserMsg.content.toLowerCase().trim();
      const countryAnswer = resolveCountryQuestion(newUserMsg.content);
      const llmAnswer = await askDeepSeek(
        newUserMsg.content,
        countryAnswer || "",
      );

      let response =
        llmAnswer ||
        countryAnswer ||
        resolveGeneralFallback(newUserMsg.content);

      if (input.includes("your name") && !llmAnswer) {
        response =
          "I'm World Explorer AI, your assistant for countries and general questions.";
      }

      if (input.includes("about") && input.includes("website") && !llmAnswer) {
        response =
          "World to Go is a premium country explorer app. You can browse countries, track visited/planned places, and chat with AI for both country and general questions.";
      }

      await new Promise((resolve) => setTimeout(resolve, 450));

      const botMsg = {
        id: Date.now() + 1,
        type: "bot",
        content: response,
      };
      updateCurrentSession([...updatedMessages, botMsg]);
    } catch {
      const fallbackMsg = {
        id: Date.now() + 1,
        type: "bot",
        content:
          "I had a temporary connection issue. Please try again with your question.",
      };
      updateCurrentSession([...updatedMessages, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
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
          isMobile && isSidebarOpen
            ? "chatbot-overlay--open"
            : "chatbot-overlay--closed"
        }`}
        onClick={() => {
          if (isMobile) setIsSidebarOpen(false);
        }}
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
                    Ask me anything. I can help with countries plus general
                    questions on many topics.
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
                  placeholder="Ask any question... countries, coding, study, travel, and more"
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

      <Motion.button
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => navigate("/chat")}
        className="chatbot-float-btn"
        aria-label="Open World Explorer AI chat"
      >
        <MessageSquare className="w-6 h-6 text-white chatbot-float-icon" />
        <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 transition-opacity chatbot-float-glow" />
      </Motion.button>
    </div>,
    document.body,
  );
};
