'use client'

import React, { useState, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { 
  useRAGQuery, 
  createInitialChatHistory, 
  addUserMessage, 
  addAssistantMessage, 
  addErrorMessage,
  type ChatMessage 
} from '@/app/rest/ai'

export default function AskAIPage() {
  const [message, setMessage] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(createInitialChatHistory())
  
  // Use the RAG query hook
  const ragQueryMutation = useRAGQuery()

  const handleSendMessage = async () => {
    if (!message.trim()) return

    const userMessage = message
    setMessage('')
    
    // Add user message to chat history
    setChatHistory(prev => addUserMessage(prev, userMessage))

    try {
      // Send RAG query using the hook
      const data = await ragQueryMutation.mutateAsync(userMessage)
      
      // Add AI response to chat history
      setChatHistory(prev => addAssistantMessage(prev, data.answer))
    } catch (error) {
      console.error('Error fetching AI response:', error)
      setChatHistory(prev => addErrorMessage(prev))
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage()
    }
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

  return (
    <div className="bg-gray-50 h-full flex flex-col">
      <div className="px-6 pt-4 pb-2 flex-shrink-0 bg-gray-900 text-white py-8">
        <h1 className="text-3xl font-bold">AriesView Real Estate AI Coach</h1>
      </div>
      <div className="flex-grow overflow-y-auto p-6 space-y-4">
        {chatHistory.map((chat, index) => (
          <div key={index} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] rounded-lg p-3 text-sm ${
                chat.role === 'user' ? 'bg-[#1a365d] text-white' : 'bg-white shadow-sm text-gray-800'
              }`}
            >
              {chat.role === 'assistant' ? (
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{chat.content}</ReactMarkdown>
                </div>
              ) : (
                <span>{chat.content}</span>
              )}
            </div>
          </div>
        ))}

        {ragQueryMutation.isPending && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg p-3 bg-white shadow-sm text-gray-800">
              <div className="flex space-x-2 items-center">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '200ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '400ms' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div className="h-24 flex-shrink-0"></div>
      </div>

      {/* Input Area + Suggestions: Fixed at the bottom */}
      <div className="fixed bottom-0 left-0 md:left-64 right-0 border-t border-gray-200 p-4 bg-white z-10">
        {/* Input Row: Constrained width */}
        <div className="max-w-4xl mx-auto mb-3">
          <div className="flex space-x-3 items-center">
            {/* Hidden File Input */}
            <input 
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              aria-label="File upload"
            />
            <button
              onClick={handleFileButtonClick}
              disabled={ragQueryMutation.isPending}
              className={`rounded-lg p-2 ${
                ragQueryMutation.isPending
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              aria-label="Attach file"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a365d]"
              placeholder="Ask about your portfolio, documents, or performance metrics..."
              disabled={ragQueryMutation.isPending}
            />
            <button
              onClick={handleSendMessage}
              disabled={ragQueryMutation.isPending || !message.trim()}
              className={`rounded-lg p-2 ${
                ragQueryMutation.isPending || !message.trim()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#1a365d] text-white hover:bg-[#2a4a7d]'
              }`}
              aria-label="Send message"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          {selectedFile && (
            <div className="mt-2 text-xs text-gray-500">
              Selected file: {selectedFile.name}
              <button 
                onClick={() => setSelectedFile(null)} 
                className="ml-2 text-red-500 hover:text-red-700 font-semibold"
                aria-label="Remove selected file"
              >
                &times;
              </button>
            </div>
          )}
        </div>

        {/* Suggestions Area: Use full available width */}
        <div className="mx-auto">
          <h3 className="text-xs font-medium text-gray-500 mb-2">Try asking about:</h3>
          <div className="flex flex-wrap gap-2">
            {[
              "How do I evaluate if a property is a good investment?",
              "What risks should I watch for before buying real estate?",
              "How can I quickly analyze the ROI of a rental property?",
              "What are signs that a real estate market is about to decline?",
              "How do I build a diversified real estate portfolio?"
            ].map((query, index) => (
              <button
                key={index}
                onClick={() => { setMessage(query) }}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs rounded-full"
                disabled={ragQueryMutation.isPending}
              >
                {query}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}