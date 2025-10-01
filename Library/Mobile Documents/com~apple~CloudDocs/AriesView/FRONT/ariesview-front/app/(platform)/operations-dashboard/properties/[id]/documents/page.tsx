import { propertiesData } from '../../../data'
import DocumentsContent from './client-component'

// Add generateStaticParams function for static export
export function generateStaticParams() {
  return propertiesData.map((property) => ({
    id: property.id.toString()
  }))
}

// Server Component
export default function DocumentsPage() {
  return <DocumentsContent />
} 