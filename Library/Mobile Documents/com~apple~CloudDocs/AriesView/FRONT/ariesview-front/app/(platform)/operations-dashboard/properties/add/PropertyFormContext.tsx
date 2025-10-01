import React, { createContext, useContext, useReducer, ReactNode, Dispatch } from 'react';

// --- Interfaces ---
// Reuse or adapt existing PropertyData interface if available elsewhere
export interface PropertyData {
  propertyName: string;
  propertyType: string;
  propertyStatus: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  portfolio: string;
  tags: string[];
  purchasePrice?: number | string; // Allow string for input parsing
  currentValue?: number | string;
  occupancyRate?: number | string;
  annualIncome?: number | string;
  annualExpenses?: number | string;
  // Add any other fields collected in the form
  acquisitionDate?: string; // Example
  squareFootage?: number | string; // Example
  yearBuilt?: number | string; // Example
  notes?: string; // Example
  [key: string]: any; // Allow for flexibility if needed
}

// Add File object to Document interface
export interface Document {
  id: string;
  name: string;
  type: string;
  category: string;
  size: number;
  uploadDate: Date;
  file: File; // The actual file object for upload
}

interface State {
  propertyData: PropertyData | null;
  documents: Document[];
  propertyId: string | null;
}

// --- Actions ---
type Action =
  | { type: 'SET_PROPERTY_DATA'; payload: Partial<PropertyData> }
  | { type: 'SET_PROPERTY_ID'; payload: string }
  | { type: 'ADD_DOCUMENT'; payload: Document }
  | { type: 'REMOVE_DOCUMENT'; payload: string } // id of document to remove
  | { type: 'SET_DOCUMENTS'; payload: Document[] }
  | { type: 'CLEAR_FORM' };

// --- Initial State ---
const initialState: State = {
  propertyData: null,
  documents: [],
  propertyId: null,
};

// --- Reducer ---
const formReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_PROPERTY_DATA':
      return {
        ...state,
        // Initialize if null, otherwise merge partial data
        propertyData: state.propertyData
          ? { ...state.propertyData, ...action.payload }
          : { ...(initialState.propertyData || {}), ...action.payload } as PropertyData,
      };
    case 'SET_PROPERTY_ID':
      return {
        ...state,
        propertyId: action.payload,
      };
    case 'ADD_DOCUMENT':
      // Prevent adding duplicates if needed (e.g., based on name and size)
      // if (state.documents.some(doc => doc.name === action.payload.name && doc.size === action.payload.size)) {
      //   return state;
      // }
      return {
        ...state,
        documents: [...state.documents, action.payload],
      };
    case 'REMOVE_DOCUMENT':
      return {
        ...state,
        documents: state.documents.filter(doc => doc.id !== action.payload),
      };
    case 'SET_DOCUMENTS':
        return {
            ...state,
            documents: action.payload,
        };
    case 'CLEAR_FORM':
      return initialState;
    default:
      return state;
  }
};

// --- Context Object ---
interface PropertyFormContextProps {
  state: State;
  dispatch: Dispatch<Action>;
}

const PropertyFormContext = createContext<PropertyFormContextProps | undefined>(undefined);

// --- Provider Component ---
interface PropertyFormProviderProps {
  children: ReactNode;
}

export const PropertyFormProvider: React.FC<PropertyFormProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(formReducer, initialState);

  // Add validation or side effects here if needed

  return (
    <PropertyFormContext.Provider value={{ state, dispatch }}>
      {children}
    </PropertyFormContext.Provider>
  );
};

// --- Custom Hook ---
export const usePropertyForm = (): PropertyFormContextProps => {
  const context = useContext(PropertyFormContext);
  if (context === undefined) {
    throw new Error('usePropertyForm must be used within a PropertyFormProvider');
  }
  return context;
}; 