import React, { useState, useEffect, useRef } from 'react';
import { Bug, X, Trash2, Copy, ChevronDown, ChevronUp, AlertCircle, Info, AlertTriangle } from 'lucide-react';

interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  details?: string;
}

declare global {
  interface Window {
    __PRE_LOAD_LOGS__?: any[];
  }
}

const safeStringify = (obj: any) => {
  const cache = new Set();
  try {
    return JSON.stringify(obj, (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (cache.has(value)) {
          return '[Circular]';
        }
        cache.add(value);
      }
      return value;
    }, 2);
  } catch (e) {
    return String(obj);
  }
};

const DebugOverlay: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewError, setHasNewError] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Load early logs from index.html capture
  useEffect(() => {
    if (window.__PRE_LOAD_LOGS__ && window.__PRE_LOAD_LOGS__.length > 0) {
      setLogs(prev => [...window.__PRE_LOAD_LOGS__ as LogEntry[], ...prev]);
      // Check if there were any errors in preload
      if (window.__PRE_LOAD_LOGS__.some((l: any) => l.level === 'error')) {
        setHasNewError(true);
      }
    }
  }, []);

  useEffect(() => {
    const originalConsoleLog = console.log;
    const originalConsoleWarn = console.warn;
    const originalConsoleError = console.error;

    const addLog = (level: 'info' | 'warn' | 'error', args: any[]) => {
      const timestamp = new Date().toLocaleTimeString();
      const message = args.map(arg => {
        if (typeof arg === 'string') return arg;
        if (arg instanceof Error) return `${arg.message}\n${arg.stack}`;
        return safeStringify(arg);
      }).join(' ');

      setLogs(prevLogs => {
        const newLogs = [...prevLogs, { timestamp, level, message }];
        if (newLogs.length > 200) return newLogs.slice(newLogs.length - 200);
        return newLogs;
      });

      if (level === 'error') {
        setHasNewError(true);
        // Auto-open on critical error if not manually closed recently
        // setIsOpen(true); 
      }
    };

    console.log = (...args) => {
      addLog('info', args);
      originalConsoleLog.apply(console, args);
    };

    console.warn = (...args) => {
      addLog('warn', args);
      originalConsoleWarn.apply(console, args);
    };

    console.error = (...args) => {
      addLog('error', args);
      originalConsoleError.apply(console, args);
    };

    const handleError = (event: ErrorEvent) => {
      addLog('error', [`Uncaught Exception: ${event.message}`, event.error]);
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      addLog('error', [`Unhandled Rejection: ${event.reason}`]);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      console.log = originalConsoleLog;
      console.warn = originalConsoleWarn;
      console.error = originalConsoleError;
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (isOpen && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isOpen]);

  const copyToClipboard = () => {
    const text = logs.map(l => `[${l.timestamp}] [${l.level.toUpperCase()}] ${l.message}`).join('\n');
    navigator.clipboard.writeText(text);
    alert('Logs copiados para a área de transferência!');
  };

  const clearLogs = () => {
    setLogs([]);
    setHasNewError(false);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => { setIsOpen(true); setHasNewError(false); }}
        className={`fixed bottom-4 right-4 p-3 rounded-full shadow-lg transition-all z-[9999] flex items-center justify-center ${hasNewError ? 'bg-red-500 animate-pulse text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'}`}
        title="Abrir Debug Console"
      >
        <Bug className="w-6 h-6" />
        {hasNewError && <span className="absolute -top-1 -right-1 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span></span>}
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-[90vw] md:w-[600px] h-[50vh] bg-slate-900 rounded-xl shadow-2xl z-[9999] flex flex-col border border-slate-700 text-xs md:text-sm font-mono">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-slate-700 bg-slate-950 rounded-t-xl">
        <div className="flex items-center gap-2">
          <Bug className="w-4 h-4 text-green-400" />
          <span className="font-bold text-slate-200">Debug Console</span>
          <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full text-xs">{logs.length} events</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={copyToClipboard} className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white" title="Copiar"><Copy className="w-4 h-4" /></button>
          <button onClick={clearLogs} className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-red-400" title="Limpar"><Trash2 className="w-4 h-4" /></button>
          <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white" title="Minimizar"><ChevronDown className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Logs Area */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 bg-slate-900">
        {logs.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-600">
            <Info className="w-8 h-8 mb-2 opacity-50" />
            <p>Nenhum log registrado ainda.</p>
          </div>
        )}
        {logs.map((log, index) => (
          <div key={index} className={`flex gap-2 p-1.5 rounded hover:bg-white/5 break-words ${
            log.level === 'error' ? 'text-red-400 bg-red-900/20 border-l-2 border-red-500' :
            log.level === 'warn' ? 'text-yellow-400 bg-yellow-900/10 border-l-2 border-yellow-500' :
            'text-slate-300 border-l-2 border-blue-500/30'
          }`}>
            <span className="text-slate-500 flex-shrink-0 select-none">[{log.timestamp}]</span>
            <div className="flex-1 whitespace-pre-wrap font-mono">
              {log.message}
            </div>
          </div>
        ))}
        <div ref={logsEndRef} />
      </div>

      {/* Footer / Input (Optional for future commands) */}
      <div className="p-2 bg-slate-950 border-t border-slate-700 text-xs text-slate-500 flex justify-between">
         <span>React v{React.version}</span>
         <span>Process Env: {process.env.API_KEY ? 'API_KEY Present' : 'MISSING API_KEY'}</span>
      </div>
    </div>
  );
};

export default DebugOverlay;