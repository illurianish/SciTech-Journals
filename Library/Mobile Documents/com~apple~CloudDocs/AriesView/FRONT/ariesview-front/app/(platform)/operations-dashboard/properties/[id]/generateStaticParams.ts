import { propertiesData } from '../data'

export function generateStaticParams() {
  return propertiesData.map(property => ({
    id: property.id.toString()
  }))
} 