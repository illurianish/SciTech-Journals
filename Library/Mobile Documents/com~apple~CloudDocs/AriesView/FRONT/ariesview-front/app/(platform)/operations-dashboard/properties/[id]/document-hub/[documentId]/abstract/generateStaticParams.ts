import { propertiesData } from '../../../../../data'

export function generateStaticParams() {
  const params = []
  
  // Generate combinations of property IDs and document IDs
  for (const property of propertiesData) {
    // For each property, we'll generate paths for documents 1-5
    // In a real app, you would get these IDs from your actual document data
    for (let docId = 1; docId <= 5; docId++) {
      params.push({
        id: property.id.toString(),
        documentId: docId.toString()
      })
    }
  }
  
  return params
} 