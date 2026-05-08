"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hi there! 👋 I'm the Event Hub assistant. Ask me anything about our platform!
        
       
        `,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // A small set of suggested questions — clicking one will send it
  const SUGGESTED_QUESTIONS = [
    "How do I create an event?",
    "What are the guidelines for posting events?",
    "How does the voting system work?",
  ];

  useEffect(() => {
    // scroll to bottom when messages change or while loading
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const sendUserMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMessage: Message = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      const data = await response.json();

      if (response.ok && data.reply) {
        const botMessage: Message = { role: "assistant", content: data.reply };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        throw new Error(data.error || "রেসপন্স ফরম্যাট সঠিক নয়");
      }
    } catch (error: any) {
      console.error("Fetch Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `দুঃখিত! ${error.message || "টেকনিক্যাল সমস্যা হয়েছে।"}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendUserMessage(input);
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      {/* চ্যাট মেসেজ এলাকা */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                msg.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-white prose prose-invert max-w-none"
              }`}
            >
              {msg.role === "user" ? (
                <div className="whitespace-pre-wrap">{msg.content}</div>
              ) : (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    // কাস্টম কম্পোনেন্ট দিয়ে টেবিল, কোড ইত্যাদি স্টাইল করা
                    table: ({ children }) => (
                      <div className="overflow-x-auto my-2">
                        <table className="min-w-full border border-gray-600 text-sm">
                          {children}
                        </table>
                      </div>
                    ),
                    th: ({ children }) => (
                      <th className="border border-gray-600 px-2 py-1 bg-gray-800">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="border border-gray-600 px-2 py-1">
                        {children}
                      </td>
                    ),
                    code: ({ className, children, ...props }) => {
                      const match = /language-(\w+)/.exec(className || "");
                      return (
                        <code
                          className={`${className} bg-black/50 rounded px-1 py-0.5 text-yellow-200 text-sm`}
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                    pre: ({ children }) => (
                      <pre className="bg-black/50 p-2 rounded-md overflow-x-auto text-sm">
                        {children}
                      </pre>
                    ),
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 underline"
                      >
                        {children}
                      </a>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc pl-5 my-1">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal pl-5 my-1">{children}</ol>
                    ),
                    li: ({ children }) => (
                      <li className="my-0.5">{children}</li>
                    ),
                    h1: ({ children }) => (
                      <h1 className="text-2xl font-bold my-2">{children}</h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-xl font-bold my-1.5">{children}</h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-lg font-semibold my-1">{children}</h3>
                    ),
                    p: ({ children }) => <p className="my-1">{children}</p>,
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-700 rounded-lg p-3">🤖 টাইপ করছে...</div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick replies */}
      <div className="px-4 py-2 border-t border-gray-800">
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_QUESTIONS.map((q) => (
            <motion.button
              key={q}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => sendUserMessage(q)}
              disabled={isLoading}
              className="rounded-full bg-gray-800/60 px-3 py-1 text-sm text-white hover:bg-gray-800 transition"
            >
              {q}
            </motion.button>
          ))}
        </div>
      </div>

      {/* ইনপুট ফর্ম */}
      <form onSubmit={sendMessage} className="border-t border-gray-700 p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What you know about Event Hub..."
            className="flex-1 rounded-lg bg-gray-800 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            Interact
          </button>
        </div>
      </form>
    </div>
  );
}
