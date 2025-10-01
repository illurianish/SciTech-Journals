import React from 'react';

interface AIDocumentHubProps {
  propertyId: string;
  propertyName: string;
}

const documentTypes = [
  {
    id: 'lease',
    name: 'Lease Agreements',
    documents: [
      { 
        id: 'doc1', 
        title: 'Primary Tenant Lease 2023-2025', 
        abstraction: 'Annual rent: $125,000. Term: 24 months. Renewal option: Yes (2 years). Special clauses: Tenant responsible for all maintenance.',
        date: '2023-04-15'
      },
      { 
        id: 'doc2', 
        title: 'Retail Space Lease Agreement', 
        abstraction: 'Monthly rent: $8,750. Term: 36 months. Security deposit: $17,500. Early termination clause: 60 days notice + 2 months penalty.',
        date: '2023-08-22'
      }
    ]
  },
  {
    id: 'financial',
    name: 'Financial Reports',
    documents: [
      { 
        id: 'doc3', 
        title: 'Q2 2023 Operating Statement', 
        abstraction: 'NOI: $342,500. Expenses: $178,900. Occupancy rate: 92%. CAM recoveries: 87% of projected.',
        date: '2023-07-30'
      },
      { 
        id: 'doc4', 
        title: 'Annual Financial Performance Review', 
        abstraction: 'ROI: 8.7%. Cap rate: 6.2%. Revenue growth YoY: 4.3%. Expense ratio: 32%.',
        date: '2023-12-15'
      }
    ]
  },
  {
    id: 'inspection',
    name: 'Inspection Reports',
    documents: [
      { 
        id: 'doc5', 
        title: 'Property Condition Assessment', 
        abstraction: 'HVAC system requires replacement within 18 months. Roof in good condition. Parking lot needs resurfacing. Building envelope shows minor wear.',
        date: '2023-05-18'
      },
      { 
        id: 'doc6', 
        title: 'Environmental Site Assessment', 
        abstraction: 'No recognized environmental conditions identified. Radon levels within acceptable range. No evidence of asbestos-containing materials.',
        date: '2023-09-10'
      }
    ]
  },
  {
    id: 'tax',
    name: 'Tax Documents',
    documents: [
      { 
        id: 'doc7', 
        title: 'Property Tax Assessment', 
        abstraction: 'Assessed value: $16.4M. Annual tax: $185,300. Special assessments: None. Appeal deadline: March 15, 2024.',
        date: '2023-11-05'
      },
      { 
        id: 'doc8', 
        title: 'Tax Depreciation Schedule', 
        abstraction: 'Building: 39-year straight line. Land improvements: 15-year. FF&E: 7-year MACRS. Total annual depreciation: $318,700.',
        date: '2023-10-22'
      }
    ]
  },
  {
    id: 'insurance',
    name: 'Insurance Documents',
    documents: [
      { 
        id: 'doc9', 
        title: 'Commercial Property Insurance Policy', 
        abstraction: 'Coverage: $18.5M building, $1.2M business personal property. Deductible: $25,000. Premium: $42,800/year. Flood coverage: Yes.',
        date: '2023-03-01'
      },
      { 
        id: 'doc10', 
        title: 'Liability Insurance Certificate', 
        abstraction: 'General liability: $5M per occurrence. Umbrella: $10M. Named insureds: All current tenants. Exclusions: Pollution liability.',
        date: '2023-03-01'
      }
    ]
  },
  {
    id: 'legal',
    name: 'Legal Documents',
    documents: [
      { 
        id: 'doc11', 
        title: 'Property Deed', 
        abstraction: 'Type: Warranty deed. Encumbrances: One active easement for utility access on north border. Chain of title verified back to 1985.',
        date: '2017-08-12'
      },
      { 
        id: 'doc12', 
        title: 'Zoning Compliance Report', 
        abstraction: 'Current zoning: C-2 Commercial. Compliant use: Yes. Future zoning changes planned: None. Variance requirements: None.',
        date: '2023-02-15'
      }
    ]
  }
];

export default function AIDocumentHub({ propertyId, propertyName }: AIDocumentHubProps) {
  const [expandedType, setExpandedType] = React.useState<string | null>('lease');

  const toggleExpand = (typeId: string) => {
    setExpandedType(expandedType === typeId ? null : typeId);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">AI Document Abstractions</h2>
        <p className="mt-1 text-sm text-gray-500">
          AI-powered analysis and summaries of key documents for {propertyName}
        </p>
      </div>
      
      <div className="px-6 py-4">
        <div className="grid grid-cols-1 gap-4">
          {documentTypes.map((type) => (
            <div key={type.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleExpand(type.id)}
                className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 text-left flex justify-between items-center"
              >
                <span className="font-medium text-gray-900">{type.name}</span>
                <svg 
                  className={`h-5 w-5 text-gray-500 transform ${expandedType === type.id ? 'rotate-180' : ''} transition-transform`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {expandedType === type.id && (
                <div className="px-4 py-3 space-y-3">
                  {type.documents.map((doc) => (
                    <div key={doc.id} className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex justify-between mb-1">
                        <h4 className="font-medium text-blue-900">{doc.title}</h4>
                        <span className="text-xs text-gray-500">{doc.date}</span>
                      </div>
                      <p className="text-sm text-gray-700">{doc.abstraction}</p>
                      <div className="mt-2 flex justify-end space-x-2">
                        <button className="text-xs text-blue-600 hover:text-blue-800">
                          View Original
                        </button>
                        <button className="text-xs text-blue-600 hover:text-blue-800">
                          Request Full AI Analysis
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            <span className="font-medium">6</span> document categories with <span className="font-medium">12</span> abstracted documents
          </p>
          <button className="inline-flex items-center px-3 py-1.5 border border-blue-600 text-sm font-medium rounded text-blue-600 bg-white hover:bg-blue-50">
            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Document for AI Processing
          </button>
        </div>
      </div>
    </div>
  );
} 