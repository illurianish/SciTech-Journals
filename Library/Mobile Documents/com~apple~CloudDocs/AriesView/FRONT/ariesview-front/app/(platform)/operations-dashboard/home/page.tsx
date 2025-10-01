'use client';

import Link from 'next/link';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const assetManagementPillars = [
  {
    title: 'Properties',
    description: 'Manage your property portfolio including overviews, details, document hub, and financial management',
    link: '/operations-dashboard/properties/property-overview',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
      </svg>
    ),
  },
  {
    title: 'AriesView Dashboards',
    description: 'View comprehensive dashboards for executive insights, cash flow, budgets, operations, and delinquency analysis',
    link: '/operations-dashboard/dashboards',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
];

const acquisitionScreeningPillars = [
  {
    title: 'Deal Screen',
    description: 'Evaluate and screen potential acquisition opportunities',
    link: '/operations-dashboard/acquisition-screening/deal-screen',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 102 0V9z" clipRule="evenodd" />
      </svg>
    ),
  }
];

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h2>
        <p className="text-gray-600 mb-4">{error.message}</p>
        <button
          onClick={resetErrorBoundary}
          className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

function HomePage() {
  // AI Chat state
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [generateTable, setGenerateTable] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const { user } = useAuth();

  // Function to get Firebase auth token
  const getFirebaseAuthToken = async () => {
    if (user) {
      try {
        return await user.getIdToken();
      } catch (error) {
        console.error('Error getting Firebase token:', error);
        return null;
      }
    }
    return null;
  };

  // Chatbot functions
  const handleSendMessage = async () => {
    if (!message.trim()) return

    // Expand the chat when sending a message
    setIsExpanded(true)

    // Prepare the message with optional table generation instruction
    let finalMessage = message;
    if (generateTable) {
      finalMessage = "Format your answers as well-structured tables using Markdown. Use appropriate column headers. If the input doesn't naturally map to a table, extract key points or categories and organize them into a comparative or descriptive table. Always include a brief explanation above the table describing what the table contains. Do not output plain text paragraphs — always prefer tabular summaries.\n\n" + message;
    }

    const newChatHistory: ChatMessage[] = [
      ...chatHistory,
      { role: 'user' as const, content: message } // Show original message to user
    ]
    setChatHistory(newChatHistory)
    setMessage('')
    setIsLoading(true)
    
    // Reset table generation mode after sending
    setGenerateTable(false)

    try {
      // Get authentication token
      const token = await getFirebaseAuthToken()
      if (!token) {
        throw new Error('Authentication required. Please log in.')
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/ai/rag-query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ question: finalMessage }), // Send message with table instruction if enabled
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`)
      }

      const data = await response.json()

      const aiResponse: ChatMessage = {
        role: 'assistant' as const,
        content: data.answer,
      }
      setChatHistory((prev) => [...prev, aiResponse])
    } catch (error) {
      console.error('Error fetching AI response:', error)
      setChatHistory((prev) => [
        ...prev,
        {
          role: 'assistant' as const,
          content: 'Sorry, I encountered an error while processing your request. Please try again later.',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
    // Allow Shift+Enter to create new lines (default behavior)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    } else {
      setSelectedFile(null)
    }
  }

  const handleFileButtonClick = () => {
    fileInputRef.current?.click()
  }

  // Effect to get ID token when user is available
  useEffect(() => {
    if (user) {
      user.getIdToken()
        .then(token => {
          setIdToken(token);
        })
        .catch(error => {
          console.error("Error getting ID token:", error);
          setIdToken("Error fetching token. Check console.");
        });
    } else {
      setIdToken(null);
    }
  }, [user]);

  // Effect to handle body scroll when chat is expanded
  useEffect(() => {
    if (isExpanded) {
      // Prevent body scroll when chat is expanded
      document.body.style.overflow = 'hidden';
      // Close mobile sidebar when chat is closed
      setShowMobileSidebar(false);
    } else {
      // Restore body scroll when chat is closed
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scroll on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isExpanded]);

  // Effect to auto-resize textarea when message changes
  useEffect(() => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  }, [message]);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex flex-col">
        {/* Clean Minimal Header */}
        <div className="bg-white border-b border-gray-100 py-4 md:py-12">
          <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-800 leading-tight">
                Welcome to AriesView{user?.displayName ? `, ${user.displayName}` : ''}
              </h1>
            </div>
          </div>
        </div>

        <div className={`max-w-[1300px] mx-auto px-3 sm:px-6 lg:px-8 py-6 md:py-16 flex-grow ${isExpanded ? 'relative' : ''}`}>
          {/* AI Chat Interface */}
          <section className="mb-8 md:mb-10">
            {/* Backdrop for expanded view */}
            {isExpanded && (
              <div className="fixed inset-0 md:top-0 md:left-64 md:right-0 md:bottom-0 bg-black bg-opacity-30 z-40" onClick={() => setIsExpanded(false)} />
            )}
            
            {/* Chat container with responsive full-screen behavior */}
            <div className="max-w-[1200px] mx-auto">
              <div className={`bg-white rounded-2xl md:rounded-3xl shadow-lg border border-gray-200 ${
                isExpanded 
                  ? 'fixed inset-0 md:top-0 md:left-64 md:right-0 md:bottom-0 z-50 rounded-none md:rounded-2xl shadow-2xl' 
                  : 'h-[55vh] md:h-[520px]'
              } flex flex-col transition-all duration-300 overflow-hidden hover:shadow-xl`}>
              {/* Chat History */}
              <div className="flex-grow overflow-y-auto p-4 md:p-8 space-y-4 md:space-y-6 relative">
                {/* Close button for expanded view - sticky positioning to stay visible while scrolling */}
                {isExpanded && (
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="sticky top-4 md:top-6 right-4 md:right-6 z-20 p-3 md:p-4 bg-white/95 backdrop-blur-sm hover:bg-white active:bg-gray-100 rounded-full transition-all duration-200 shadow-lg border border-gray-200 hover:shadow-xl min-h-[44px] min-w-[44px] flex items-center justify-center ml-auto mb-4 md:mb-6"
                    title="Close chat"
                    style={{ marginLeft: 'auto', display: 'flex' }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}

                {/* Mobile menu button for sidebar access when chat is expanded */}
                {isExpanded && (
                  <button
                    onClick={() => setShowMobileSidebar(!showMobileSidebar)}
                    className="md:hidden absolute top-4 left-4 z-10 p-3 bg-white hover:bg-gray-50 active:bg-gray-100 rounded-full transition-all duration-200 shadow-lg border border-gray-200 hover:shadow-xl min-h-[44px] min-w-[44px] flex items-center justify-center"
                    title="Toggle menu"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                )}

                {/* Mobile sidebar overlay when chat is expanded */}
                {isExpanded && showMobileSidebar && (
                  <div className="md:hidden absolute inset-0 bg-white z-20 p-4 overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Navigation</h3>
                      <button
                        onClick={() => setShowMobileSidebar(false)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    {/* Add navigation items here as needed */}
                    <div className="space-y-3">
                      <Link href="/operations-dashboard" className="block p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                        Dashboard Home
                      </Link>
                      <Link href="/operations-dashboard/properties/property-overview" className="block p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                        Properties
                      </Link>
                      <Link href="/operations-dashboard/dashboards" className="block p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                        Dashboards
                      </Link>
                    </div>
                  </div>
                )}
                
                {chatHistory.length === 0 && (
                  <div className="flex items-center justify-center h-full text-gray-500 text-sm md:text-base px-1">
                    <div className="text-center w-full max-w-xl md:max-w-md">
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-4 md:mb-8">
                        <svg className="w-8 h-8 md:w-10 md:h-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <p className="text-base md:text-[22px] font-semibold text-gray-800 mb-4 md:mb-3 leading-snug break-words px-2">Start a conversation with your AI assistant</p>
                    </div>
                  </div>
                )}
                
                {chatHistory.map((chat, index) => (
                  <div key={index} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[85%] md:max-w-[80%] rounded-2xl px-4 py-3 md:px-5 md:py-4 text-sm md:text-sm ${
                        chat.role === 'user' 
                          ? 'bg-blue-600 text-white shadow-sm' 
                          : chat.role === 'system'
                          ? 'bg-blue-50 text-blue-800 border border-blue-100'
                          : 'bg-gray-50 text-gray-800 shadow-sm border border-gray-100'
                      }`}
                    >
                      {chat.role === 'assistant' ? (
                        <div className="prose prose-sm max-w-none text-gray-800">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{chat.content}</ReactMarkdown>
                        </div>
                      ) : (
                        <span>{chat.content}</span>
                      )}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[85%] md:max-w-[80%] rounded-2xl px-4 py-3 md:px-5 md:py-4 bg-gray-50 text-gray-800 shadow-sm border border-gray-100">
                      <div className="flex space-x-2 items-center">
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '200ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '400ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="border-t border-gray-100 p-4 md:p-8 bg-gray-50/50">
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 md:space-x-4 items-stretch sm:items-center mb-3 md:mb-6">
                  <input 
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    aria-label="File upload"
                  />
                  <button
                    onClick={handleFileButtonClick}
                    disabled={isLoading}
                    className={`order-2 sm:order-1 rounded-xl p-2.5 md:p-4 transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center ${
                      isLoading
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-600 hover:bg-gray-50 active:bg-gray-100 border border-gray-200 shadow-sm hover:shadow-md'
                    }`}
                    aria-label="Attach file"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setGenerateTable(!generateTable)}
                    disabled={isLoading}
                    className={`order-3 sm:order-2 rounded-xl p-2.5 md:p-4 transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center ${
                      isLoading
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : generateTable
                        ? 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-md'
                        : 'bg-white text-gray-600 hover:bg-gray-50 active:bg-gray-100 border border-gray-200 shadow-sm hover:shadow-md'
                    }`}
                    aria-label={generateTable ? "Disable table generation" : "Enable table generation"}
                    title={generateTable ? "Table mode active - responses will be formatted as tables" : "Click to generate tabular financial data"}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v6zM3 9l5.5-3L14 9l5.5-3" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M8 7v10M16 7v10" />
                    </svg>
                  </button>
                  <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={1}
                    className={`order-1 sm:order-3 flex-1 border rounded-xl md:rounded-2xl px-3 md:px-6 py-3 md:py-5 text-base md:text-base min-h-[44px] max-h-[120px] focus:outline-none focus:ring-2 transition-all duration-200 shadow-sm hover:shadow-md focus:shadow-lg bg-white font-medium resize-none overflow-y-auto ${
                      generateTable 
                        ? 'border-blue-300 focus:ring-blue-400 focus:border-blue-400 bg-blue-50/30' 
                        : 'border-gray-300 focus:ring-blue-400 focus:border-blue-400'
                    }`}
                    placeholder={generateTable ? "Ask for financial data (will be formatted as a table)..." : "Ask about your portfolio, documents, or performance metrics..."}
                    disabled={isLoading}
                    style={{ 
                      fontSize: '16px',
                      height: 'auto',
                      minHeight: '44px'
                    }}
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = 'auto';
                      target.style.height = Math.min(target.scrollHeight, 120) + 'px';
                    }}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isLoading || !message.trim()}
                    className={`order-4 rounded-xl p-2.5 md:p-4 transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center ${
                      isLoading || !message.trim()
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95'
                    }`}
                    aria-label="Send message"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
                
                {/* Table mode indicator */}
                {generateTable && (
                  <div className="mb-3 md:mb-6 text-sm text-blue-700 bg-blue-50 rounded-xl p-3 md:p-4 border border-blue-200 shadow-sm flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="font-medium">Table mode active:</span>
                    <span>Your next response will be formatted as a financial data table</span>
                  </div>
                )}
                
                {selectedFile && (
                  <div className="mb-3 md:mb-6 text-sm text-gray-600 bg-white rounded-xl p-3 md:p-4 border border-gray-200 shadow-sm">
                    <span className="font-medium">Selected file:</span> {selectedFile.name}
                    <button 
                      onClick={() => setSelectedFile(null)} 
                      className="ml-3 text-red-500 hover:text-red-700 active:text-red-800 font-medium transition-colors duration-200 min-h-[44px] min-w-[44px] inline-flex items-center justify-center"
                      aria-label="Remove selected file"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {/* Suggestions - Desktop only */}
                <div className="hidden md:block space-y-2 md:space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-600">Try asking:</h4>
                    {!isExpanded && (
                      <button
                        onClick={() => setIsExpanded(true)}
                        className="hidden md:flex text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 items-center space-x-1"
                      >
                        <span>Expand chat</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                      </button>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row sm:flex-wrap gap-1.5 md:gap-3">
                    {[
                      "How do I evaluate if a property is a good investment?",
                      "What are signs that a real estate market is about to decline?",
                      "How can I quickly analyze the ROI of a rental property?",
                      "What risks should I watch for before buying real estate?"
                    ].map((query, index) => (
                      <button
                        key={index}
                        onClick={() => { setMessage(query) }}
                        className="px-4 md:px-6 py-3 md:py-3.5 bg-white hover:bg-blue-50 active:bg-blue-100 text-gray-700 hover:text-blue-700 text-xs md:text-sm font-medium rounded-full border border-gray-200 hover:border-blue-200 transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98] hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 min-h-[44px] flex items-center justify-center text-center"
                        disabled={isLoading}
                      >
                        {query}
                      </button>
                    ))}
                  </div>                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Access Cards */}
          <section className="mb-6 md:mb-14">
            <div className="mb-4 md:mb-10 text-center">
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-2 md:mb-4">Quick Access</h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg leading-relaxed px-4">
                Navigate to key sections of your real estate management platform with these essential tools.
              </p>
            </div>
            {/* Responsive container for cards */}
            <div className="max-w-[1200px] mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 lg:gap-8">
              {/* Combine all pillars into one array */}
              {[...assetManagementPillars, ...acquisitionScreeningPillars].map(pillar => (
                <Link
                  key={pillar.title}
                  href={pillar.link}
                  className="block h-full group"
                >
                  <div className="bg-[#1e293b] rounded-xl md:rounded-2xl p-4 md:p-8 text-white hover:bg-[#334155] active:bg-[#475569] transition-all duration-400 cursor-pointer h-full flex flex-col shadow-lg hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1 active:scale-[1.02] border border-[#1e293b] hover:border-[#334155] text-center min-h-[260px] md:min-h-[320px]">
                    <div className="flex justify-center items-center mb-3 md:mb-6">
                      <div className="bg-white/10 backdrop-blur-sm p-2 md:p-4 rounded-xl md:rounded-2xl group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110">
                        <span className="text-white">
                          {pillar.icon}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-base md:text-xl font-semibold text-white mb-2 md:mb-4 leading-tight group-hover:text-blue-100 transition-colors">{pillar.title}</h3>
                    <p className="text-white/90 text-xs md:text-sm flex-grow leading-relaxed mb-3 md:mb-6 group-hover:text-white/95 transition-colors">{pillar.description}</p>
                    <div className="flex justify-center items-center text-xs md:text-sm text-white/80 pt-2 md:pt-4 group-hover:text-white transition-colors border-t border-white/10 min-h-[40px] md:min-h-[44px]">
                      <span className="font-medium">Open</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 transform group-hover:translate-x-2 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
              </div>
            </div>
          </section>
        </div>
        
        {/* Footer */}
        <footer className="bg-gray-50 border-t border-gray-100 py-6 md:py-12">
          <div className="max-w-[1300px] mx-auto px-3 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:flex-wrap justify-between items-center space-y-4 sm:space-y-0">
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-6 md:space-x-8 text-center sm:text-left">
                <Link href="/customer-success" className="text-gray-600 hover:text-gray-900 active:text-gray-700 transition-colors duration-200 font-medium py-2 px-3 rounded-lg hover:bg-gray-100 min-h-[44px] flex items-center justify-center">
                  Customer Success
                </Link>
                <Link href="#" className="text-gray-600 hover:text-gray-900 active:text-gray-700 transition-colors duration-200 font-medium py-2 px-3 rounded-lg hover:bg-gray-100 min-h-[44px] flex items-center justify-center">
                  Contact Support
                </Link>
                <Link href="#" className="text-gray-600 hover:text-gray-900 active:text-gray-700 transition-colors duration-200 font-medium py-2 px-3 rounded-lg hover:bg-gray-100 min-h-[44px] flex items-center justify-center">
                  Privacy Policy
                </Link>
              </div>
              <div className="text-gray-500 text-xs md:text-sm font-medium text-center sm:text-right">
                © 2024 AriesView. All rights reserved.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
}

export default HomePage;
