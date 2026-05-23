"use client";

// Main chat screen for RegiMind.
// Welcome screen first, then a scrolling chat once a question is asked.
// Each answer shows the policy sources it was grounded in.

import { useState, useRef, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type Source = {
  policy_name: string;
  section_heading: string;
  text: string;
  chunk_id: string;
};

type Message = {
  role: "user" | "bot";
  content: string;
  sources?: Source[];
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(question: string) {
    const text = question.trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text }),
      });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: data.answer, sources: data.sources },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content:
            "Sorry, I couldn't reach the policy server. Please try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  const suggestions = [
    { tag: "Assessment", q: "What counts as extenuating circumstances?" },
    { tag: "Submission", q: "What's the penalty for submitting 24 hours late?" },
    { tag: "Appeals", q: "How do I appeal a final mark I disagree with?" },
    { tag: "Integrity", q: "Is paraphrasing without citation considered plagiarism?" },
  ];

  const isWelcome = messages.length === 0;

  return (
    // overflow-x-hidden on the outer wrapper is a safety net against any stray overflow
    <div className="flex h-[calc(100vh-4rem)] flex-col overflow-x-hidden bg-[#faf9f6]">
      {/* ===== MESSAGES AREA ===== */}
      <div className="flex-1 overflow-y-auto">
        {/* smaller padding on mobile (px-4), roomier on desktop (sm:px-6) */}
        <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-8">

          {isWelcome ? (
            <div>
              <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#d3374a]">
                <span className="h-px w-6 bg-[#d3374a]" /> Croeso · Welcome
              </p>
              <h1 className="font-serif text-3xl leading-tight text-[#22211f] sm:text-4xl">
                Cardiff University policy,
                <br />
                <span className="italic text-[#d3374a]">answered plainly.</span>
              </h1>
              <p className="mt-4 max-w-md text-sm text-[#3a3936] sm:text-base">
                Ask anything about assessment, attendance, appeals, or academic
                regulations. Every answer is grounded in official Cardiff
                University documents with traceable citations.
              </p>

              {/* 1 column on mobile, 2 from sm up */}
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
            <div className="flex flex-col gap-6">
              {messages.map((m, i) => (
                <div key={i} className="min-w-0">
                  {m.role === "user" ? (
                    <div className="flex justify-end">
                      {/* break-words stops long questions overflowing */}
                      <div className="max-w-[85%] break-words rounded-2xl bg-[#22211f] px-4 py-2.5 text-white">
                        {m.content}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {/* break-words is the key fix: long answers wrap instead of clipping */}
                      <div className="break-words rounded-2xl border-l-4 border-[#d3374a] bg-white px-4 py-4 text-[#22211f] sm:px-5">
                        {m.content}
                      </div>

                      {m.sources && m.sources.length > 0 && (
                        <div className="flex flex-col gap-2">
                          <p className="text-xs font-semibold uppercase tracking-wide text-[#3a3936]/60">
                            Sources
                          </p>
                          {m.sources.map((src, j) => (
                            <div
                              key={j}
                              className="min-w-0 rounded-lg border border-[#e6e4df] bg-white p-3"
                            >
                              {/* stack policy + section vertically on mobile so neither clips */}
                              <div className="mb-1 flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
                                <span className="break-words text-sm font-medium text-[#d3374a]">
                                  {src.policy_name}
                                </span>
                                <span className="break-words text-xs text-[#3a3936]/60 sm:whitespace-nowrap">
                                  {src.section_heading}
                                </span>
                              </div>
                              <p className="break-words text-xs leading-relaxed text-[#3a3936]">
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

              {loading && (
                <div className="flex gap-1.5">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-[#d3374a] [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-[#d3374a] [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-[#d3374a]" />
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}
        </div>
      </div>

      {/* ===== COMPOSER ===== */}
      <div className="border-t border-[#e6e4df] bg-[#faf9f6] px-4 py-3 sm:px-6 sm:py-4">
        <div className="mx-auto w-full max-w-3xl">
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
          <p className="mt-2 text-center text-[11px] text-[#3a3936]/50 sm:text-xs">
            Press Enter to send · Shift + Enter for newline · RegiMind only
            quotes official Cardiff University policy
          </p>
        </div>
      </div>
    </div>
  );
}