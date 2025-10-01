import React, { useState } from 'react';

interface Fund {
  id: string;
  name: string;
  properties: Property[];
}

interface Property {
  id: string;
  name: string;
  address: string;
}

// Mock data for funds and properties
const fundsData: Fund[] = [
  {
    id: 'fund1',
    name: 'Babson Real Estate Fund I',
    properties: [
      { id: 'prop1', name: 'River Street Plaza', address: '522 River St, Boston, MA 02126' },
      { id: 'prop2', name: 'Hooksett Retail Center', address: '555 Hooksett Road, Manchester, NH 03106' }
    ]
  },
  {
    id: 'fund2',
    name: 'Evolston Capital Fund II',
    properties: [
      { id: 'prop3', name: 'Main Street Complex', address: '123 Main St, Hartford, CT 06103' },
      { id: 'prop4', name: 'Oakwood Plaza', address: '789 Oak Ave, Providence, RI 02903' }
    ]
  }
];

interface DocumentEditorProps {
  onSave: (content: string, title: string, propertyId: string) => void;
  initialFundId?: string;
  initialPropertyId?: string;
}

const DocumentEditor: React.FC<DocumentEditorProps> = ({ 
  onSave, 
  initialFundId = '',
  initialPropertyId = ''
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [fundId, setFundId] = useState(initialFundId);
  const [propertyId, setPropertyId] = useState(initialPropertyId);

  // Get properties for selected fund
  const selectedFundProperties = fundsData.find(fund => fund.id === fundId)?.properties || [];

  const handleFundChange = (newFundId: string) => {
    setFundId(newFundId);
    setPropertyId('');
  };

  const handleSave = () => {
    if (!title.trim()) {
      alert('Please enter a document title');
      return;
    }
    onSave(content, title, propertyId);
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="documentTitle" className="block text-sm font-medium text-gray-700">
          Document Title
        </label>
        <input
          type="text"
          id="documentTitle"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="Enter document title"
          suppressHydrationWarning
        />
      </div>

      {/* Fund and Property Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="fund-select" className="block text-sm font-medium text-gray-700">
            Select Fund
          </label>
          <select
            id="fund-select"
            value={fundId}
            onChange={(e) => handleFundChange(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            suppressHydrationWarning
          >
            <option value="">Select a Fund</option>
            {fundsData.map(fund => (
              <option key={fund.id} value={fund.id}>{fund.name}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="property-select" className="block text-sm font-medium text-gray-700">
            Select Property
          </label>
          <select
            id="property-select"
            value={propertyId}
            onChange={(e) => setPropertyId(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            disabled={!fundId}
            suppressHydrationWarning
          >
            <option value="">Select a Property</option>
            {selectedFundProperties.map(property => (
              <option key={property.id} value={property.id}>
                {property.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="documentContent" className="block text-sm font-medium text-gray-700">
          Content
        </label>
        <textarea
          id="documentContent"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="Enter document content"
          suppressHydrationWarning
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          onClick={handleSave}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          suppressHydrationWarning
        >
          Save Document
        </button>
      </div>
    </div>
  );
};

export default DocumentEditor; 