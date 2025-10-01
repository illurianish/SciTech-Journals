import { propertiesData } from '../../data'
import DocumentHubClient from './client-component'

export function generateStaticParams() {
  return propertiesData.map((property) => ({
    id: property.id.toString()
  }))
}

export default function DocumentHubPage() {
  return <DocumentHubClient />
} 