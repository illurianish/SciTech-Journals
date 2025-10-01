import PropertyDetailsClient from "./client-component";

export default async function PropertyDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // ✅ Next 15 requires awaiting dynamic APIs
  return <PropertyDetailsClient propertyId={id} />;
}
