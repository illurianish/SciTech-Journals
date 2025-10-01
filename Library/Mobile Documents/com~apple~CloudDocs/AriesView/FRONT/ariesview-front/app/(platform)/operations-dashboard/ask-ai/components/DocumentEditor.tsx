import React, { useState } from 'react';

interface DocumentEditorProps {
  onSave: (content: string, title: string, propertyId: string) => void;
}

const DocumentEditor: React.FC<DocumentEditorProps> = ({ onSave }) => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [selectedProperty, setSelectedProperty] = useState('');
  const [fontSize, setFontSize] = useState('medium');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [align, setAlign] = useState('left');

  const handleSave = () => {
    if (!title.trim()) {
      alert('Please enter a document title');
      return;
    }
    if (!selectedProperty) {
      alert('Please select a property');
      return;
    }
    onSave(content, title, selectedProperty);
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'small': return 'text-sm';
      case 'medium': return 'text-base';
      case 'large': return 'text-lg';
      case 'x-large': return 'text-xl';
      default: return 'text-base';
    }
  };

  const getAlignClass = () => {
    switch (align) {
      case 'left': return 'text-left';
      case 'center': return 'text-center';
      case 'right': return 'text-right';
      default: return 'text-left';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-4">Document Editor</h2>
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mb-4">
          <input
            type="text"
            placeholder="Document Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a365d]"
            aria-label="Document Title"
            suppressHydrationWarning
          />
          <select
            value={selectedProperty}
            onChange={(e) => setSelectedProperty(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a365d]"
            aria-label="Select Property"
            suppressHydrationWarning
          >
            <option value="">Select Property</option>
            <option value="property1">Hooksett Retail Center</option>
            <option value="property2">River Street Plaza</option>
            <option value="property3">Tech Plaza</option>
          </select>
          <button
            onClick={handleSave}
            className="bg-[#1a365d] text-white px-4 py-2 rounded-md hover:bg-[#2a4a7d] transition-colors whitespace-nowrap"
            suppressHydrationWarning
          >
            Save Document
          </button>
        </div>
      </div>
      
      {/* Document Toolbar */}
      <div className="mb-3 p-2 border border-gray-200 rounded flex flex-wrap gap-2 bg-gray-50">
        <select
          value={fontSize}
          onChange={(e) => setFontSize(e.target.value)}
          className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#1a365d]"
          aria-label="Font Size"
          suppressHydrationWarning
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
          <option value="x-large">X-Large</option>
        </select>
        
        <button
          type="button"
          onClick={() => setIsBold(!isBold)}
          className={`px-2 py-1 rounded ${isBold ? 'bg-gray-300' : 'bg-white'} border border-gray-300`}
          aria-label="Bold"
          suppressHydrationWarning
        >
          <span className="font-bold">B</span>
        </button>
        
        <button
          type="button"
          onClick={() => setIsItalic(!isItalic)}
          className={`px-2 py-1 rounded ${isItalic ? 'bg-gray-300' : 'bg-white'} border border-gray-300`}
          aria-label="Italic"
          suppressHydrationWarning
        >
          <span className="italic">I</span>
        </button>
        
        <div className="flex border border-gray-300 rounded overflow-hidden">
          <button
            type="button"
            onClick={() => setAlign('left')}
            className={`px-2 py-1 ${align === 'left' ? 'bg-gray-300' : 'bg-white'}`}
            aria-label="Align Left"
            suppressHydrationWarning
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M2 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/>
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setAlign('center')}
            className={`px-2 py-1 ${align === 'center' ? 'bg-gray-300' : 'bg-white'}`}
            aria-label="Align Center"
            suppressHydrationWarning
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M4 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/>
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setAlign('right')}
            className={`px-2 py-1 ${align === 'right' ? 'bg-gray-300' : 'bg-white'}`}
            aria-label="Align Right"
            suppressHydrationWarning
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M6 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-4-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm4-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-4-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/>
            </svg>
          </button>
        </div>
      </div>
      
      {/* Document Content */}
      <div className="border border-gray-300 rounded-md h-[400px] p-4 mb-2 overflow-y-auto bg-white">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing your document..."
          className={`w-full h-full resize-none focus:outline-none ${getFontSizeClass()} ${getAlignClass()} ${isBold ? 'font-bold' : 'font-normal'} ${isItalic ? 'italic' : ''}`}
          suppressHydrationWarning
        />
      </div>
      
      <div className="text-right text-sm text-gray-500">
        {content.length} characters
      </div>
    </div>
  );
};

export default DocumentEditor; 