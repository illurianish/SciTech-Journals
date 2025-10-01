import { propertiesData } from '../../data'
import FinancialHubClient from './client-component'

export function generateStaticParams() {
  return propertiesData.map((property) => ({
    id: property.id,
  }))
}

export default function FinancialHubPage() {
  return <FinancialHubClient />
} 