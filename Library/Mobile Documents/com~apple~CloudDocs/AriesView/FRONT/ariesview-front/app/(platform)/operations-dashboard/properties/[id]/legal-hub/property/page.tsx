// app/(platform)/operations-dashboard/properties/[id]/legal-hub/property/page.tsx
import LegalHubClient from "../client-component";

export default function LegalPropertyTab({
  params,
}: {
  params: { id: string };
}) {
  return <LegalHubClient propertyId={params.id} initialTab="property" />;
}
