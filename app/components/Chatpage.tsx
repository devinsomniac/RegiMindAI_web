"use client";

// This is the main chat screen for RegiMind.
// It shows a welcome screen first, then once you ask something it turns into
// a normal chat: your question and the AI's answer stack up and the view
// scrolls to the newest message. Each answer also shows the policy sources
// it was based on, which is the main point of the project.

import { useState, useRef, useEffect } from "react";

// The backend URL. Locally this is my FastAPI server.
// When I deploy, I'll put the real URL in an env variable instead.
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Shape of one source chunk coming back from my API.
type Source = {
  policy_name: string;
  section_heading: string;
  text: string;
  chunk_id: string;
};

// A single message in the chat. "user" = me asking, "bot" = RegiMind answering.
type Message = {
  role: "user" | "bot";
  content: string;
  sources?: Source[]; // only bot messages have sources
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // I use this to scroll down to the newest message after each one is added.
  const bottomRef = useRef<HTMLDivElement>(null);

  // Whenever messages change, scroll to the bottom so the latest is visible.
  // This is the "everything moves up" effect - new messages get added at the
  // bottom and the browser scrolls there, so older ones go up out of view.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // This runs when I send a question (button click or Enter key).
  async function sendMessage(question: string) {
    const text = question.trim();
    if (!text || loading) return;

    // 1. Add my question to the chat straight away so it feels responsive.
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setLoading(true);

    try {
      // 2. Send the question to my FastAPI backend.
      const res = await fetch(`${API_URL}/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text }),
      });

      if (!res.ok) throw new Error(`Server error ${res.status}`);

      const data = await res.json();

      // 3. Add the AI's answer (with its sources) to the chat.
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: data.answer, sources: data.sources },
      ]);
    } catch (err) {
      // If the backend isn't running or something breaks, show a friendly message.
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content:
            "Sorry, I couldn't reach the policy server. Make sure the backend is running, then try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  // Send on Enter, but allow Shift+Enter for a new line.
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  // The four example questions on the welcome screen.
  const suggestions = [
    { tag: "Assessment", q: "What counts as extenuating circumstances?" },
    { tag: "Submission", q: "What's the penalty for submitting 24 hours late?" },
    { tag: "Appeals", q: "How do I appeal a final mark I disagree with?" },
    { tag: "Integrity", q: "Is paraphrasing without citation considered plagiarism?" },
  ];

  // If there are no messages yet, we're on the welcome screen.
  const isWelcome = messages.length === 0;

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-[#faf9f6]">
      {/* ===== MESSAGES AREA (scrolls) ===== */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-6 py-8">

          {isWelcome ? (
            // ----- Welcome screen (shown only before the first question) -----
            <div>
              <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#d3374a]">
                <span className="h-px w-6 bg-[#d3374a]" /> Croeso · Welcome
              </p>
              <h1 className="font-serif text-4xl leading-tight text-[#22211f]">
                Cardiff University policy,
                <br />
                <span className="italic text-[#d3374a]">answered plainly.</span>
              </h1>
              <p className="mt-4 max-w-md text-[#3a3936]">
                Ask anything about assessment, attendance, appeals, or academic
                regulations. Every answer is grounded in official Cardiff
                University documents with traceable citations.
              </p>

              {/* suggestion cards */}
              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {suggestions.map((s) => (
                  <button
                    key={s.q}
                    onClick={() => sendMessage(s.q)}
                    className="rounded-xl border border-[#e6e4df] bg-white p-4 text-left transition hover:border-[#d3374a]"
                  >
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#d3374a]">
                      {s.tag}
                    </p>
                    <p className="text-sm text-[#22211f]">{s.q}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // ----- Chat messages (shown once a question is asked) -----
            <div className="flex flex-col gap-6">
              {messages.map((m, i) => (
                <div key={i}>
                  {m.role === "user" ? (
                    // my question
                    <div className="flex justify-end">
                      <div className="max-w-[80%] rounded-2xl bg-[#22211f] px-4 py-2.5 text-white">
                        {m.content}
                      </div>
                    </div>
                  ) : (
                    // RegiMind's answer
                    <div className="flex flex-col gap-3">
                      <div className="rounded-2xl border-l-4 border-[#d3374a] bg-white px-5 py-4 text-[#22211f]">
                        {m.content}
                      </div>

                      {/* the policy sources this answer was based on */}
                      {m.sources && m.sources.length > 0 && (
                        <div className="flex flex-col gap-2">
                          <p className="text-xs font-semibold uppercase tracking-wide text-[#3a3936]/60">
                            Sources
                          </p>
                          {m.sources.map((src, j) => (
                            <div
                              key={j}
                              className="rounded-lg border border-[#e6e4df] bg-white p-3"
                            >
                              <div className="mb-1 flex items-baseline justify-between gap-3">
                                <span className="text-sm font-medium text-[#d3374a]">
                                  {src.policy_name}
                                </span>
                                <span className="whitespace-nowrap text-xs text-[#3a3936]/60">
                                  {src.section_heading}
                                </span>
                              </div>
                              <p className="text-xs leading-relaxed text-[#3a3936]">
                                {src.text.slice(0, 200)}…
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {/* "thinking..." dots while waiting for the API */}
              {loading && (
                <div className="flex gap-1.5">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-[#d3374a] [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-[#d3374a] [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-[#d3374a]" />
                </div>
              )}

              {/* invisible div I scroll to, to keep the newest message in view */}
              <div ref={bottomRef} />
            </div>
          )}
        </div>
      </div>

      {/* ===== COMPOSER (input box, stays at the bottom) ===== */}
      <div className="border-t border-[#e6e4df] bg-[#faf9f6] px-6 py-4">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-[#e6e4df] bg-white p-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask RegiMind about Cardiff University policy…"
              rows={1}
              className="w-full resize-none bg-transparent text-[#22211f] outline-none placeholder:text-[#3a3936]/50"
            />
            <div className="mt-2 flex justify-end">
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#d3374a] text-white transition disabled:opacity-40"
                aria-label="Send"
              >
                ↑
              </button>
            </div>
          </div>
          <p className="mt-2 text-center text-xs text-[#3a3936]/50">
            Press Enter to send · Shift + Enter for newline · RegiMind only
            quotes official Cardiff University policy
          </p>
        </div>
      </div>
    </div>
  );
}