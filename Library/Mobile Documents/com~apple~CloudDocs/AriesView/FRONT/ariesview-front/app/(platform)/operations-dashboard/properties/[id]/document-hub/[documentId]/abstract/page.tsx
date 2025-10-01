import { propertiesData } from '../../../../../data'
import AbstractComponent from './client-component'

export function generateStaticParams() {
  // Generate staticParams for all property ids and document ids (using mock document ids 1-5)
  const params = [];
  
  for (const property of propertiesData) {
    // For each property, we'll create entries for documents 1-5
    for (let docId = 1; docId <= 5; docId++) {
      params.push({
        id: property.id.toString(),
        documentId: docId.toString()
      });
    }
  }
  
  return params;
}

export default function DocumentAbstractPage() {
  return <AbstractComponent />;
} 