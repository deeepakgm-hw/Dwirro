import '@testing-library/jest-dom';
import { vi, beforeEach, afterEach } from 'vitest';

// Mock DOM scrollIntoView and scrollTo
Element.prototype.scrollIntoView = vi.fn();
window.scrollTo = vi.fn();

// Enforce zero console.error and console.warn in tests
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeEach(() => {
  console.error = (...args: unknown[]) => {
    // Ignore expected React test-library logging if intended
    const message = args.join(' ');
    if (message.includes('not wrapped in act')) return;
    originalConsoleError(...args);
    throw new Error(`Test failed due to unexpected console.error: ${message}`);
  };
  console.warn = (...args: unknown[]) => {
    const message = args.join(' ');
    originalConsoleWarn(...args);
    throw new Error(`Test failed due to unexpected console.warn: ${message}`);
  };
});

afterEach(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

// Mock Web Speech API
class MockSpeechRecognition {
  continuous = false;
  interimResults = false;
  lang = 'en-US';
  onresult: ((event: unknown) => void) | null = null;
  onerror: ((event: unknown) => void) | null = null;
  onend: (() => void) | null = null;

  start() {
    // triggered in tests
  }
  stop() {
    if (this.onend) this.onend();
  }
  abort() {
    if (this.onend) this.onend();
  }
}

// @ts-expect-error Mocking window speech recognition
window.SpeechRecognition = MockSpeechRecognition;
// @ts-expect-error Mocking webkit speech recognition
window.webkitSpeechRecognition = MockSpeechRecognition;

// Mock window.speechSynthesis
window.speechSynthesis = {
  paused: false,
  pending: false,
  speaking: false,
  cancel: vi.fn(),
  pause: vi.fn(),
  resume: vi.fn(),
  speak: vi.fn(),
  getVoices: vi.fn().mockReturnValue([]),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
  onvoiceschanged: null,
};

// Mock SpeechSynthesisUtterance
// @ts-expect-error Mocking utterance constructor
window.SpeechSynthesisUtterance = class {
  text: string;
  lang: string = 'en-US';
  rate: number = 1;
  pitch: number = 1;
  volume: number = 1;
  onend: (() => void) | null = null;
  onerror: (() => void) | null = null;

  constructor(text: string) {
    this.text = text;
  }
};
