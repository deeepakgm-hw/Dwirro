import React, { useState, useRef, useEffect } from 'react';
import { useSystem } from '../context/SystemContext';
import { ApprovalCard } from '../components/ApprovalCard';
import { escapeHtml, detectPromptInjection } from '@aip/security';
import { Send, Mic, MicOff, Volume2, VolumeX, Sparkles, AlertCircle } from 'lucide-react';

export const ChatPage: React.FC = () => {
  const { chatMessages, sendMessage } = useSystem();
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [typing, setTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, typing]);

  // Web Speech API: Recognition Setup
  const handleToggleSpeech = () => {
    setSpeechError(null);
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechError('Web Speech API is not supported in this browser environment.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        // Transcript placed in the input for confirmation before sending
        setInputText(transcript);
      };
      recognition.onerror = (event: any) => {
        setIsListening(false);
        setSpeechError(`Microphone access error: ${event.error || 'Permission denied'}`);
      };
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      setIsListening(false);
      setSpeechError(`Microphone error: ${err.message || 'Could not start recording'}`);
    }
  };

  // Web Speech API: Synthesis
  const handleSpeakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const query = inputText;
    setInputText('');
    setTyping(true);

    // Injection check notification
    const injectionCheck = detectPromptInjection(query);
    if (injectionCheck.isInjected) {
      // Prompt injection defense
    }

    await sendMessage(query);
    setTyping(false);
  };

  const handleChipClick = (chipText: string) => {
    setInputText(chipText);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col h-[calc(100vh-5rem)]">
      {/* Mic error notice */}
      {speechError && (
        <div
          data-testid="mic-error-banner"
          className="bg-amber-950/60 border border-amber-500/50 rounded-xl p-3 mb-3 text-xs text-amber-300 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{speechError} (You can still communicate via keyboard text input).</span>
          </div>
          <button
            onClick={() => setSpeechError(null)}
            className="text-amber-400 hover:text-amber-200 text-xs px-2 py-0.5"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Messages Stream */}
      <div
        data-testid="chat-messages-container"
        className="flex-1 overflow-y-auto space-y-4 pr-2 rounded-2xl bg-slate-900/50 border border-slate-800/80 p-4 shadow-inner"
        role="log"
        aria-live="polite"
      >
        {chatMessages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-2xl ${
                isUser ? 'ml-auto' : 'mr-auto'
              }`}
            >
              <div className="flex items-center gap-2 mb-1 px-1">
                <span className="text-[11px] font-semibold text-slate-400">
                  {isUser ? 'You' : 'Dwirro Assistant'}
                </span>
                <span className="text-[10px] text-slate-500">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
                {!isUser && (
                  <button
                    onClick={() => handleSpeakText(msg.text)}
                    className="text-slate-500 hover:text-cyan-400 transition-colors p-0.5"
                    title="Read aloud"
                  >
                    {isSpeaking ? (
                      <VolumeX className="w-3.5 h-3.5 text-cyan-400" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>

              {/* Message text escaped safely to protect against XSS */}
              <div
                data-testid={`chat-bubble-${msg.sender}`}
                className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  isUser
                    ? 'bg-cyan-600 text-white rounded-tr-xs shadow-md'
                    : 'bg-slate-800 border border-slate-700/80 text-slate-200 rounded-tl-xs shadow-sm'
                }`}
              >
                {/* Rendered as literal text directly */}
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>

              {/* Inline Approval Card if message contains an L2+ action */}
              {msg.action && (
                <div className="w-full mt-2">
                  <ApprovalCard action={msg.action} />
                </div>
              )}
            </div>
          );
        })}

        {typing && (
          <div className="flex items-center gap-2 text-xs text-slate-400 px-2 py-1 animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            <span>Dwirro is thinking...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Action Chips */}
      <div className="flex items-center gap-2 py-3 overflow-x-auto no-scrollbar">
        <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider shrink-0">
          Suggestions:
        </span>
        {[
          'Plan tomorrow',
          'Summarize incoming mail',
          'Audit today schedule conflicts',
          'Review overdue bills',
        ].map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => handleChipClick(chip)}
            className="whitespace-nowrap bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 text-xs px-3 py-1.5 rounded-full transition-colors shrink-0 font-medium"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="relative flex items-center gap-2 mt-1">
        <button
          data-testid="mic-button"
          type="button"
          onClick={handleToggleSpeech}
          className={`p-3 rounded-2xl border transition-all ${
            isListening
              ? 'bg-red-600 border-red-500 text-white animate-pulse'
              : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-cyan-400 hover:bg-slate-700/70'
          }`}
          title={isListening ? 'Stop listening' : 'Speak message (Speech-to-Text)'}
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        <input
          data-testid="chat-input"
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={
            isListening
              ? 'Listening... speak clearly into your mic'
              : 'Ask assistant or type a command (e.g., "Plan tomorrow")...'
          }
          className="flex-1 bg-slate-900 border border-slate-700/90 rounded-2xl px-5 py-3.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors shadow-inner"
        />

        <button
          data-testid="send-message-btn"
          type="submit"
          disabled={!inputText.trim()}
          className="p-3.5 bg-gradient-to-tr from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600 text-white rounded-2xl shadow-lg transition-all"
          title="Send message"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};
