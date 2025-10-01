import { redirect } from "next/navigation";

export default function LegalHubUnitRedirect({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { id } = params;
  const unitId =
    typeof searchParams.unitId === "string" ? searchParams.unitId : "";

  const qp = new URLSearchParams();
  qp.set("tab", "unit");
  if (unitId) qp.set("unitId", unitId);

  redirect(`/operations-dashboard/properties/${id}/legal-hub?${qp.toString()}`);
}
