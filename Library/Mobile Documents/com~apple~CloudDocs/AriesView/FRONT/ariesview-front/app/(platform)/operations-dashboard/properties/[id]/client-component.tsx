"use client";

import { useState, useEffect, useRef, ChangeEvent, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged, getIdToken } from "firebase/auth";
import { app } from "@/app/firebase/config";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

// Financial (placeholder) tabs – leave imports even if not used yet
import SummaryDashboardTab from "./analysis/components/SummaryDashboardTab";
import RentRollTab from "./analysis/components/RentRollTab";
import IncomeStatementTab from "./analysis/components/IncomeStatementTab";
import CashFlowTab from "./analysis/components/CashFlowTab";
import CapExPlanTab from "./analysis/components/CapExPlanTab";
import AssumptionsTab from "./analysis/components/AssumptionsTab";

// Existing components used elsewhere on page
import DocumentHub from "./components/DocumentHub";
import FinancialAnalysisHub from "./components/FinancialAnalysisHub";
import { UnitTable } from "./components/unit-table";
import { UnitMixSummaryTable } from "./components/unit-mix-summary-table";

// ✅ NEW: Legal Hub client import
import LegalHubClient from "./legal-hub/client-component";

// ───────────────────────────────────────────────────────────────────────────────
// Types
// ───────────────────────────────────────────────────────────────────────────────

interface PropertyFormData {
  name?: string;
  address?: string;
  status?: string;
  propertyType?: string;
  category?: string | null;
  squareFootage?: number | string | null;
  units?: number | string | null;
  acquisitionDate?: string | null;
  yearBuilt?: number | string | null;
  fund?: string | null;
  notes?: string | null;
  marketValue?: number | null;
  occupancy?: number | null;
}

interface Tenant {
  name: string;
  industry: string;
  contact: string;
  leaseEnd: string;
  paymentStatus: string;
}

interface Property {
  id: string;
  name: string;
  address: string;
  status: string;
  property_type: string;
  acquisition_date?: string | null;
  acquisition_price?: number | null;
  market_value?: number | null;
  square_footage?: number | null;
  year_built?: number | null;
  notes?: string | null;
  created_at: string;
  updated_at?: string | null;
  user_ref_id: string;
  image?: string;
  fund?: string;
  units?: number;
  occupancy?: number;
  roi?: number;
  category?: string;
  description?: string;
  tenants?: Tenant[];
}

// ───────────────────────────────────────────────────────────────────────────────
// Helpers
// ───────────────────────────────────────────────────────────────────────────────

async function getFirebaseAuthToken(): Promise<string | null> {
  const auth = getAuth(app);
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        unsubscribe();
        if (user) {
          try {
            const token = await getIdToken(user, true);
            resolve(token);
          } catch (error) {
            console.error("Error getting Firebase token:", error);
            reject(new Error("Could not get Firebase ID token."));
          }
        } else {
          console.warn(
            "No Firebase user currently signed in for token retrieval."
          );
          resolve(null);
        }
      },
      (error) => {
        console.error("Auth state error:", error);
        reject(error);
      }
    );
  });
}

const formatCurrency = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// ───────────────────────────────────────────────────────────────────────────────
// UI Tabs (top navigation)
// ───────────────────────────────────────────────────────────────────────────────

export default function PropertyDetailsClient({
  propertyId,
}: {
  propertyId: string;
}) {
  const router = useRouter();

  // Core property + loading
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Tabs
  const [activeTab, setActiveTab] = useState<
    "overview" | "units" | "documents" | "financial" | "legal"
  >("overview");

  // units refresh
  const [unitUpdateCounter, setUnitUpdateCounter] = useState(0);

  // image upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);

  // inline edit
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [editableDetails, setEditableDetails] = useState<
    Partial<PropertyFormData>
  >({});
  const [detailsSaveError, setDetailsSaveError] = useState<string | null>(null);

  // inline title edit
  const [title, setTitle] = useState("Property");
  const [isEditing, setIsEditing] = useState(false);
  const [hovered, setHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUnitUpdate = () => setUnitUpdateCounter((p) => p + 1);

  // ───────────────────────────────────────────────────────────────────────────
  // Inline details handlers
  // ───────────────────────────────────────────────────────────────────────────

  const handleEditDetailsClick = () => {
    setEditableDetails({
      name: property?.name,
      address: property?.address,
      status: property?.status,
      propertyType: property?.property_type,
      category: property?.category ?? null,
      squareFootage: property?.square_footage ?? null,
      units: property?.units ?? null,
      acquisitionDate: property?.acquisition_date
        ? property.acquisition_date.split("T")[0]
        : null,
      yearBuilt: property?.year_built ?? null,
      fund: property?.fund ?? null,
      notes: property?.notes ?? "",
      marketValue: property?.market_value ?? null,
      occupancy: property?.occupancy ?? null,
    });
    setIsEditingDetails(true);
    setDetailsSaveError(null);
  };

  const handleCancelEditDetails = () => {
    setIsEditingDetails(false);
    setEditableDetails({});
    setDetailsSaveError(null);
  };

  const handleDetailsInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setEditableDetails((prev) => ({
      ...prev,
      [name]:
        type === "number" ? (value === "" ? null : parseFloat(value)) : value,
    }));
  };

  const handleDetailsSelectChange = (
    name: keyof PropertyFormData,
    value: string
  ) => {
    setEditableDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSavePropertyName = async (newName: string) => {
    if (!propertyId || !newName.trim() || !property) return;

    setLoading(true);
    setDetailsSaveError(null);

    try {
      const token = await getFirebaseAuthToken();
      if (!token) throw new Error("Authentication required.");

      const payload = {
        name: newName.trim(),
        address: property.address,
        status: property.status,
        propertyType: property.property_type,
        acquisitionDate: property.acquisition_date || null,
        marketValue: property.market_value ?? null,
        squareFootage: property.square_footage ?? null,
        yearBuilt: property.year_built ?? null,
        units: property.units ?? null,
        fund: property.fund || null,
        notes: property.notes || "",
        occupancy: property.occupancy ?? null,
      };

      const backendUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const response = await fetch(`${backendUrl}/api/property/${propertyId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error ||
            `Failed to update property name: ${response.status}`
        );
      }

      const result = await response.json();
      if (result?.success) {
        setProperty((prev) =>
          prev ? { ...prev, name: newName.trim() } : prev
        );
      } else {
        throw new Error(result?.error || "Failed to update property name.");
      }
    } catch (err) {
      console.error("Save name error:", err);
      setDetailsSaveError(
        err instanceof Error ? err.message : "An unknown error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDetails = async () => {
    if (!propertyId) return;

    setLoading(true);
    setDetailsSaveError(null);

    try {
      const token = await getFirebaseAuthToken();
      if (!token) throw new Error("Authentication required.");

      const payload = {
        name: editableDetails.name,
        address: editableDetails.address,
        status: editableDetails.status,
        propertyType: editableDetails.propertyType,
        acquisitionDate: editableDetails.acquisitionDate || null,
        marketValue: editableDetails.marketValue ?? null,
        squareFootage: editableDetails.squareFootage
          ? parseInt(String(editableDetails.squareFootage), 10)
          : null,
        yearBuilt: editableDetails.yearBuilt
          ? parseInt(String(editableDetails.yearBuilt), 10)
          : null,
        units: editableDetails.units
          ? parseInt(String(editableDetails.units), 10)
          : null,
        fund: editableDetails.fund || null,
        notes: editableDetails.notes,
        occupancy: editableDetails.occupancy ?? null,
      };

      const backendUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const response = await fetch(`${backendUrl}/api/property/${propertyId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error ||
            `Failed to update property details: ${response.status}`
        );
      }

      const result = await response.json();
      if (result?.success) {
        setProperty((prev) => {
          if (!prev) return null;
          const updatedUnits = editableDetails.units
            ? Number(editableDetails.units)
            : prev.units;
          const updatedSqFt = editableDetails.squareFootage
            ? Number(editableDetails.squareFootage)
            : prev.square_footage;
          const updatedYearBuilt = editableDetails.yearBuilt
            ? Number(editableDetails.yearBuilt)
            : prev.year_built;

          return {
            ...prev,
            ...editableDetails,
            property_type: editableDetails.propertyType || prev.property_type,
            acquisition_date:
              editableDetails.acquisitionDate || prev.acquisition_date || null,
            units: updatedUnits,
            square_footage: updatedSqFt,
            year_built: updatedYearBuilt,
            name: editableDetails.name || prev.name,
            address: editableDetails.address || prev.address,
            status: editableDetails.status || prev.status,
            category: editableDetails.category || prev.category,
            fund: editableDetails.fund || prev.fund,
            notes: editableDetails.notes ?? prev.notes,
          } as Property;
        });

        setIsEditingDetails(false);
        setEditableDetails({});

        // Optional: navigate somewhere else after save
        // router.push('/operations-dashboard/properties/property-overview');
      } else {
        throw new Error(result?.error || "Failed to update property details.");
      }
    } catch (err) {
      console.error("Save details error:", err);
      setDetailsSaveError(
        err instanceof Error ? err.message : "An unknown error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  // ───────────────────────────────────────────────────────────────────────────
  // Fetch property + image
  // ───────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!propertyId) {
      setError("Property ID is missing.");
      setLoading(false);
      return;
    }

    let isMounted = true;

    (async () => {
      setLoading(true);
      setError(null);

      try {
        const token = await getFirebaseAuthToken();
        if (!token) throw new Error("Authentication required. Please log in.");

        const backendUrl = process.env.NEXT_PUBLIC_BASE_URL;
        const response = await fetch(
          `${backendUrl}/api/property/${propertyId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          let errorMsg = `HTTP error ${response.status}`;
          if (response.status === 404) errorMsg = "Property not found";
          else if (response.status === 403) errorMsg = "Access denied";
          else {
            try {
              const errorData = JSON.parse(errorText);
              errorMsg = errorData?.error || errorMsg;
            } catch {
              errorMsg = errorText.substring(0, 120) || errorMsg;
            }
          }
          throw new Error(errorMsg);
        }

        const data = await response.json();
        if (data?.success && data?.property) {
          if (!isMounted) return;
          setProperty(data.property);
          setTitle(data.property.name ?? "Property");

          if (data.property.image) {
            await fetchImage(data.property.id, token);
          }
        } else {
          throw new Error("Invalid data format received from server.");
        }
      } catch (err) {
        console.error("Failed to fetch property details:", err);
        if (isMounted)
          setError(
            err instanceof Error ? err.message : "An unknown error occurred"
          );
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyId]);

  const fetchImage = async (id: string, token: string) => {
    setImageLoading(true);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const response = await fetch(`${backendUrl}/api/property/${id}/image`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        console.error(`Failed to fetch image: ${response.status}`);
        setImageUrl(null);
        return;
      }

      const imageBlob = await response.blob();
      const objectUrl = URL.createObjectURL(imageBlob);
      if (imageUrl) URL.revokeObjectURL(imageUrl);

      setImageUrl(objectUrl);
    } catch (err) {
      console.error("Error fetching image data:", err);
      setImageUrl(null);
    } finally {
      setImageLoading(false);
    }
  };

  useEffect(() => {
    if (property?.name) setTitle(property.name);
  }, [property?.name]);

  const handleInlineTitleSave = () => {
    setIsEditing(false);
    if (title.trim() && title !== property?.name) {
      setProperty((prev) => (prev ? { ...prev, name: title } : prev));
      handleSavePropertyName(title);
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleInlineTitleSave();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setTitle(property?.name || "");
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setUploadError(null);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile || !propertyId) return;

    setIsUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append("propertyImage", selectedFile);

    try {
      const token = await getFirebaseAuthToken();
      if (!token) throw new Error("Authentication required. Please log in.");

      const backendUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const response = await fetch(
        `${backendUrl}/api/property/${propertyId}/upload-image`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        const errorMsg = result?.error || `HTTP error ${response.status}`;
        throw new Error(errorMsg);
      }

      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      await fetchImage(propertyId, token);
    } catch (err) {
      console.error("Failed to upload image:", err);
      setUploadError(
        err instanceof Error ? err.message : "An unknown upload error occurred"
      );
    } finally {
      setIsUploading(false);
    }
  };

  // ───────────────────────────────────────────────────────────────────────────
  // Loading / Error
  // ───────────────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Loading Property Details
          </h2>
          <p className="text-gray-500">
            Please wait while we fetch the property information…
          </p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="bg-red-100 text-red-600 p-4 rounded-full inline-block mb-4">
            <svg
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            {error || "Property Data Unavailable"}
          </h2>
          <p className="text-gray-500 mb-4">
            We couldn’t retrieve the details for this property. It might not
            exist or you may not have permission.
          </p>
          <Link
            href="/operations-dashboard/properties/property-overview"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <svg
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Return to Properties
          </Link>
        </div>
      </div>
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Render
  // ───────────────────────────────────────────────────────────────────────────

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link
                href="/operations-dashboard"
                className="text-blue-600 hover:text-blue-800"
              >
                Dashboard
              </Link>
            </li>
            <li className="text-gray-500">/</li>
            <li>
              <Link
                href="/operations-dashboard/properties/property-overview"
                className="text-blue-600 hover:text-blue-800"
              >
                Properties
              </Link>
            </li>
            <li className="text-gray-500">/</li>
            <li className="text-gray-600 font-medium">{property.name}</li>
          </ol>
        </nav>

        {/* Header card */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <div className="flex items-center">
                  {/* Editable Title */}
                  <div
                    className="inline-block relative h-[48px]"
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                  >
                    {isEditing ? (
                      <input
                        ref={inputRef}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onBlur={handleInlineTitleSave}
                        onKeyDown={handleTitleKeyDown}
                        className="w-full h-full text-2xl font-bold text-gray-900 border border-gray-300 px-2 py-1 rounded"
                      />
                    ) : (
                      <h1
                        className={`w-full h-full text-2xl font-bold text-gray-900 px-2 py-1 rounded cursor-pointer flex items-center ${
                          hovered ? "border border-gray-300" : ""
                        }`}
                        onClick={() => setIsEditing(true)}
                      >
                        {property?.name}
                      </h1>
                    )}
                  </div>

                  {/* Status & Fund */}
                  <div className="flex items-center ml-4 space-x-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                      ${
                        property.status?.toLowerCase() === "active" ||
                        property.status?.toLowerCase() === "owned"
                          ? "bg-green-100 text-green-800"
                          : property.status?.toLowerCase() === "pending" ||
                            property.status?.toLowerCase() === "evaluation"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {property.status}
                    </span>
                    {!!property.fund && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {property.fund}
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-gray-600 mt-1 text-sm">{property.address}</p>
              </div>

              <div className="flex items-center space-x-4">
                <Button variant="outline">Export as PDF</Button>
              </div>
            </div>
          </div>

          {/* Top Tabs */}
          <div className="px-6">
            <div className="flex overflow-x-auto space-x-8">
              <button
                onClick={() => setActiveTab("overview")}
                className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "overview"
                    ? "text-blue-600 border-blue-600"
                    : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
                }`}
                suppressHydrationWarning
              >
                Overview
              </button>

              <button
                onClick={() => setActiveTab("units")}
                className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "units"
                    ? "text-blue-600 border-blue-600"
                    : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
                }`}
                suppressHydrationWarning
              >
                Units
              </button>

              <button
                onClick={() => setActiveTab("documents")}
                className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "documents"
                    ? "text-blue-600 border-blue-600"
                    : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
                }`}
                suppressHydrationWarning
              >
                Document Hub
              </button>

              <button
                onClick={() => setActiveTab("financial")}
                className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "financial"
                    ? "text-blue-600 border-blue-600"
                    : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
                }`}
                suppressHydrationWarning
              >
                Financial Hub
              </button>

              {/* ✅ NEW: Legal Hub tab button */}
              <button
                onClick={() => setActiveTab("legal")}
                className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "legal"
                    ? "text-blue-600 border-blue-600"
                    : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
                }`}
                suppressHydrationWarning
              >
                Legal Hub
              </button>
            </div>
          </div>
        </div>

        {/* ──────────────────────────────────────────────────────────────────── */}
        {/* Tab Content */}
        {/* ──────────────────────────────────────────────────────────────────── */}

        {/* Overview */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 space-y-6">
              {/* Image */}
              <div className="col-span-1 bg-white rounded-lg shadow-sm overflow-hidden relative group">
                {imageLoading ? (
                  <div className="w-full h-96 bg-gray-200 flex items-center justify-center text-gray-400">
                    Loading Image…
                  </div>
                ) : imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={property?.name || "Property Image"}
                    className="w-full h-96 object-cover"
                  />
                ) : (
                  <div className="w-full h-96 bg-gray-200 flex items-center justify-center text-gray-400">
                    No Image Available
                  </div>
                )}

                <div
                  className={`absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-opacity duration-300 ${
                    !imageUrl && !imageLoading ? "bg-opacity-50" : ""
                  }`}
                >
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-white text-gray-800 px-4 py-2 rounded shadow hover:bg-gray-100 transition-colors text-sm font-medium opacity-0 group-hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isUploading}
                  >
                    {isUploading
                      ? "Uploading…"
                      : imageUrl
                      ? "Change Image"
                      : "Upload Image"}
                  </button>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/jpeg, image/png, image/gif, image/webp"
                  className="hidden"
                  disabled={isUploading}
                  id="property-image-upload"
                  aria-label="Upload property image"
                />
                <label htmlFor="property-image-upload" className="sr-only">
                  {imageUrl ? "Change Property Image" : "Upload Property Image"}
                </label>
              </div>

              {/* Pending upload bar */}
              {selectedFile && (
                <div className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
                  <span className="text-sm text-gray-600 truncate pr-4">
                    Selected: {selectedFile.name}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleImageUpload}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                      disabled={isUploading}
                    >
                      {isUploading ? "Uploading…" : "Upload"}
                    </button>
                    <button
                      onClick={() => {
                        setSelectedFile(null);
                        if (fileInputRef.current)
                          fileInputRef.current.value = "";
                      }}
                      className="text-gray-500 hover:text-gray-700 text-sm"
                      disabled={isUploading}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              {uploadError && (
                <div
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                  role="alert"
                >
                  <strong className="font-bold">Upload Failed: </strong>
                  <span className="block sm:inline">{uploadError}</span>
                </div>
              )}

              {/* Description */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Property Description
                  </h2>
                  {!isEditingDetails ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleEditDetailsClick}
                      disabled={loading}
                    >
                      Edit
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={handleSaveDetails}
                        disabled={loading}
                      >
                        Save
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCancelEditDetails}
                        disabled={loading}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>

                {isEditingDetails ? (
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    name="notes"
                    value={editableDetails.notes || ""}
                    onChange={handleDetailsInputChange}
                    placeholder="Enter property description"
                    rows={4}
                  />
                ) : (
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {property?.notes || "No description provided."}
                  </p>
                )}
              </div>

              {/* Financial summary (mocked) */}
              <Financial_Summary propertyId={property.id} />
            </div>

            {/* Details + structure */}
            <div className="lg:col-span-2 space-y-6">
              {/* Details */}
              <div className="bg-white rounded-lg shadow-sm p-6 top-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Property Details
                  </h2>
                  {!isEditingDetails ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleEditDetailsClick}
                      disabled={loading}
                    >
                      Edit Details
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={handleSaveDetails}
                        disabled={loading}
                      >
                        Save
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCancelEditDetails}
                        disabled={loading}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>

                {detailsSaveError && (
                  <div
                    className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm"
                    role="alert"
                  >
                    <strong>Error:</strong> {detailsSaveError}
                  </div>
                )}

                <dl className="space-y-3 text-sm">
                  {/* Property Type */}
                  <div className="flex justify-between items-center">
                    <dt className="text-gray-500">Property Type</dt>
                    {isEditingDetails ? (
                      <Select
                        name="propertyType"
                        value={editableDetails.propertyType || ""}
                        onValueChange={(value) =>
                          handleDetailsSelectChange("propertyType", value)
                        }
                      >
                        <SelectTrigger className="h-8 text-sm w-1/2">
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Multifamily">
                            Multifamily
                          </SelectItem>
                          <SelectItem value="Office">Office</SelectItem>
                          <SelectItem value="Retail">Retail</SelectItem>
                          <SelectItem value="Industrial">Industrial</SelectItem>
                          <SelectItem value="Hotel">Hotel</SelectItem>
                          <SelectItem value="Mixed-Use">Mixed-Use</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <dd className="text-blue-600 font-medium">
                        {property.property_type || "N/A"}
                      </dd>
                    )}
                  </div>

                  {/* Category */}
                  <div className="flex justify-between items-center">
                    <dt className="text-gray-500">Category</dt>
                    {isEditingDetails ? (
                      <Input
                        className="h-8 text-sm w-1/2"
                        name="category"
                        value={editableDetails.category || ""}
                        onChange={handleDetailsInputChange}
                        placeholder="e.g., Class A"
                      />
                    ) : (
                      <dd className="text-blue-600 font-medium">
                        {property.category || property.property_type || "N/A"}
                      </dd>
                    )}
                  </div>

                  {/* Square Footage */}
                  <div className="flex justify-between items-center">
                    <dt className="text-gray-500">Square Footage</dt>
                    {isEditingDetails ? (
                      <Input
                        className="h-8 text-sm w-1/2"
                        name="squareFootage"
                        type="number"
                        value={editableDetails.squareFootage ?? ""}
                        onChange={handleDetailsInputChange}
                        placeholder="Sq Ft"
                      />
                    ) : (
                      <dd className="text-blue-600 font-medium">
                        {property.square_footage
                          ? `${property.square_footage.toLocaleString()} sq ft`
                          : "N/A"}
                      </dd>
                    )}
                  </div>

                  {/* Number of Units */}
                  <div className="flex justify-between items-center">
                    <dt className="text-gray-500">Number of Units</dt>
                    {isEditingDetails ? (
                      <Input
                        className="h-8 text-sm w-1/2"
                        name="units"
                        type="number"
                        value={editableDetails.units ?? ""}
                        onChange={handleDetailsInputChange}
                        placeholder="Units"
                      />
                    ) : (
                      <dd className="text-blue-600 font-medium">
                        {property.units ?? "N/A"}
                      </dd>
                    )}
                  </div>

                  {/* Name */}
                  <div className="flex justify-between items-center">
                    <dt className="text-gray-500">Name</dt>
                    {isEditingDetails ? (
                      <Input
                        className="h-8 text-sm w-1/2"
                        name="name"
                        type="text"
                        value={editableDetails.name ?? ""}
                        onChange={handleDetailsInputChange}
                        placeholder="Property Name"
                      />
                    ) : (
                      <dd className="text-gray-900 font-medium">
                        {property.name}
                      </dd>
                    )}
                  </div>

                  {/* Address */}
                  <div className="flex justify-between items-center">
                    <dt className="text-gray-500">Address</dt>
                    {isEditingDetails ? (
                      <Input
                        className="h-8 text-sm w-1/2"
                        name="address"
                        type="text"
                        value={editableDetails.address ?? ""}
                        onChange={handleDetailsInputChange}
                        placeholder="Property Address"
                      />
                    ) : (
                      <dd className="text-gray-600 font-medium">
                        {property.address || "N/A"}
                      </dd>
                    )}
                  </div>

                  {/* Status */}
                  <div className="flex justify-between items-center">
                    <dt className="text-gray-500">Status</dt>
                    {isEditingDetails ? (
                      <Select
                        name="status"
                        value={editableDetails.status || ""}
                        onValueChange={(value) =>
                          handleDetailsSelectChange("status", value)
                        }
                      >
                        <SelectTrigger className="h-8 text-sm w-1/2">
                          <SelectValue placeholder="Select Status..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Owned">Owned</SelectItem>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Under Evaluation">
                            Under Evaluation
                          </SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="For Liquidation">
                            For Liquidation
                          </SelectItem>
                          <SelectItem value="Sold">Sold</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <dd
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          property.status === "Active" ||
                          property.status === "Owned"
                            ? "bg-green-100 text-green-800"
                            : property.status === "Under Evaluation"
                            ? "bg-yellow-100 text-yellow-800"
                            : property.status === "Pending"
                            ? "bg-orange-100 text-orange-800"
                            : property.status === "For Liquidation"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {property.status || "N/A"}
                      </dd>
                    )}
                  </div>

                  {/* Acquisition Date */}
                  <div className="flex justify-between items-center">
                    <dt className="text-gray-500">Acquisition Date</dt>
                    {isEditingDetails ? (
                      <Input
                        className="h-8 text-sm w-1/2"
                        name="acquisitionDate"
                        type="date"
                        value={editableDetails.acquisitionDate ?? ""}
                        onChange={handleDetailsInputChange}
                      />
                    ) : (
                      <dd className="text-gray-600 font-medium">
                        {property.acquisition_date
                          ? new Date(
                              property.acquisition_date
                            ).toLocaleDateString()
                          : "N/A"}
                      </dd>
                    )}
                  </div>

                  {/* Year Built */}
                  <div className="flex justify-between items-center">
                    <dt className="text-gray-500">Year Built</dt>
                    {isEditingDetails ? (
                      <Input
                        className="h-8 text-sm w-1/2"
                        name="yearBuilt"
                        type="number"
                        value={editableDetails.yearBuilt ?? ""}
                        onChange={handleDetailsInputChange}
                        placeholder="YYYY"
                      />
                    ) : (
                      <dd className="text-gray-600 font-medium">
                        {property.year_built || "N/A"}
                      </dd>
                    )}
                  </div>

                  {/* Fund */}
                  <div className="flex justify-between items-center">
                    <dt className="text-gray-500">Fund</dt>
                    {isEditingDetails ? (
                      <Input
                        className="h-8 text-sm w-1/2"
                        name="fund"
                        type="text"
                        value={editableDetails.fund || ""}
                        onChange={handleDetailsInputChange}
                        placeholder="Fund Name"
                      />
                    ) : (
                      <dd className="text-blue-600 font-medium">
                        {property.fund || "N/A"}
                      </dd>
                    )}
                  </div>

                  {/* Market Value */}
                  <div className="flex justify-between items-center">
                    <dt className="text-gray-500">Market Value ($)</dt>
                    {isEditingDetails ? (
                      <Input
                        className="h-8 text-sm w-1/2"
                        name="marketValue"
                        type="number"
                        step="0.01"
                        value={editableDetails.marketValue ?? ""}
                        onChange={handleDetailsInputChange}
                        placeholder="e.g., 650000"
                      />
                    ) : (
                      <dd className="text-gray-900 font-medium">
                        {formatCurrency(property.market_value)}
                      </dd>
                    )}
                  </div>

                  {/* Occupancy */}
                  <div className="flex justify-between items-center">
                    <dt className="text-gray-500">Occupancy (%)</dt>
                    {isEditingDetails ? (
                      <Input
                        className="h-8 text-sm w-1/2"
                        name="occupancy"
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        value={editableDetails.occupancy ?? ""}
                        onChange={handleDetailsInputChange}
                        placeholder="e.g., 95.5"
                      />
                    ) : (
                      <dd className="text-gray-900 font-medium">
                        {property.occupancy ? `${property.occupancy}%` : "N/A"}
                      </dd>
                    )}
                  </div>
                </dl>
              </div>

              {/* Financial Structure (mock) */}
              <Financial_Structure propertyId={propertyId} />
            </div>
          </div>
        )}

        {/* Units */}
        {activeTab === "units" && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <UnitMixSummaryTable
              propertyId={propertyId}
              updateTrigger={unitUpdateCounter}
            />
            <h2 className="text-xl font-semibold mb-4">Unit Overview</h2>
            <UnitTable
              propertyId={propertyId}
              onUnitChange={handleUnitUpdate}
            />
          </div>
        )}

        {/* Document Hub */}
        {activeTab === "documents" && (
          <Suspense fallback={<div>Loading Document Hub…</div>}>
            <DocumentHub propertyId={propertyId} propertyName={property.name} />
          </Suspense>
        )}

        {/* Financial Hub */}
        {activeTab === "financial" && (
          <Suspense fallback={<div>Loading Financial Hub…</div>}>
            <FinancialAnalysisHub />
          </Suspense>
        )}

        {/* ✅ Legal Hub */}
        {activeTab === "legal" && property && (
          <Suspense fallback={<div>Loading Legal Hub…</div>}>
            <LegalHubClient propertyId={property.id} property={property} />
          </Suspense>
        )}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────────
// Mock financial structure & summary (unchanged from your version)
// ───────────────────────────────────────────────────────────────────────────────

const mockFinancialsData = {
  loanAmount: 15930500,
  interestRate: 3.0,
  amortizationPeriod: 30,
  loanTerm: 10,
  monthlyPayment: 658421,
  annualPayment: 557998,
};

export function Financial_Structure({ propertyId }: { propertyId: string }) {
  const [financials, setFinancials] = useState(mockFinancialsData);
  const [isEditing, setIsEditing] = useState(false);
  const [editable, setEditable] = useState<typeof mockFinancialsData>({
    ...mockFinancialsData,
  });
  const [saveError, setSaveError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing) setEditable({ ...financials });
  }, [isEditing, financials]);

  const handleEdit = () => {
    setIsEditing(true);
    setSaveError(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditable({ ...financials });
    setSaveError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setEditable((prev) => ({
      ...prev,
      [name]:
        type === "number"
          ? value === ""
            ? ("" as any)
            : Number(value)
          : value,
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setSaveError(null);
    try {
      await new Promise((r) => setTimeout(r, 500));
      setFinancials({ ...editable });
      setIsEditing(false);
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : "An unknown error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lg:col-span-2">
      <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Financial Structure
          </h2>
          {!isEditing ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleEdit}
              disabled={loading}
            >
              Edit Details
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleSave}
                disabled={loading}
              >
                Save
              </Button>
            </div>
          )}
        </div>

        {saveError && (
          <div
            className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm"
            role="alert"
          >
            <strong>Error:</strong> {saveError}
          </div>
        )}

        <dl className="space-y-3 text-sm">
          <LabeledNumber
            label="Loan Amount"
            isEditing={isEditing}
            name="loanAmount"
            value={editable.loanAmount}
            display={formatCurrency(financials.loanAmount)}
            onChange={handleInputChange}
          />
          <LabeledNumber
            label="Interest Rate"
            isEditing={isEditing}
            name="interestRate"
            step="0.01"
            value={editable.interestRate}
            display={`${financials.interestRate}%`}
            onChange={handleInputChange}
          />
          <LabeledNumber
            label="Amortization Period"
            isEditing={isEditing}
            name="amortizationPeriod"
            value={editable.amortizationPeriod}
            display={`${financials.amortizationPeriod} years`}
            onChange={handleInputChange}
          />
          <LabeledNumber
            label="Loan Term"
            isEditing={isEditing}
            name="loanTerm"
            value={editable.loanTerm}
            display={`${financials.loanTerm} years`}
            onChange={handleInputChange}
          />
          <LabeledNumber
            label="Monthly Payment"
            isEditing={isEditing}
            name="monthlyPayment"
            value={editable.monthlyPayment}
            display={formatCurrency(financials.monthlyPayment)}
            onChange={handleInputChange}
          />
          <LabeledNumber
            label="Annual Payment"
            isEditing={isEditing}
            name="annualPayment"
            value={editable.annualPayment}
            display={formatCurrency(financials.annualPayment)}
            onChange={handleInputChange}
          />
        </dl>
      </div>
    </div>
  );
}

function LabeledNumber({
  label,
  isEditing,
  name,
  value,
  display,
  onChange,
  step,
}: {
  label: string;
  isEditing: boolean;
  name: string;
  value: number | "" | undefined;
  display: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  step?: string;
}) {
  return (
    <div className="flex justify-between items-center">
      <dt className="text-gray-500">{label}</dt>
      {isEditing ? (
        <Input
          className="h-8 text-sm w-1/2"
          name={name}
          type="number"
          step={step}
          value={value ?? ""}
          onChange={onChange}
        />
      ) : (
        <dd className="font-medium text-gray-800">{display}</dd>
      )}
    </div>
  );
}

const mockFinancialSummary = {
  purchasePrice: 24508462,
  atInBasis: 25047396,
  goingInCapRate: 6.5,
  goingOutCapRate: 7.0,
  cashOnCashReturn: 1593050,
  leverageIRR: 5.2,
  leveredIRR: 7.6,
  debtOnCashReturn: 7.11,
  dscr: 1.8,
  occupancy: 85.0,
};

export function Financial_Summary({ propertyId }: { propertyId: string }) {
  const [financialSummary, setFinancialSummary] =
    useState(mockFinancialSummary);
  const [isEditing, setIsEditing] = useState(false);
  const [editable, setEditable] = useState<typeof mockFinancialSummary>({
    ...mockFinancialSummary,
  });
  const [saveError, setSaveError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing) setEditable({ ...financialSummary });
  }, [isEditing, financialSummary]);

  const handleEdit = () => {
    setIsEditing(true);
    setSaveError(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditable({ ...financialSummary });
    setSaveError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setEditable((prev) => ({
      ...prev,
      [name]:
        type === "number"
          ? value === ""
            ? ("" as any)
            : Number(value)
          : value,
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setSaveError(null);
    try {
      await new Promise((r) => setTimeout(r, 500));
      setFinancialSummary({ ...editable });
      setIsEditing(false);
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : "An unknown error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-base font-semibold text-gray-900">
          Financial Summary
        </h2>
        {!isEditing ? (
          <Button
            variant="outline"
            size="sm"
            onClick={handleEdit}
            disabled={loading}
          >
            Edit Details
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleSave}
              disabled={loading}
            >
              Save
            </Button>
          </div>
        )}
      </div>

      {saveError && (
        <div
          className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm"
          role="alert"
        >
          <strong>Error:</strong> {saveError}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-6 text-sm">
        {(
          [
            ["Purchase Price", "purchasePrice"],
            ["At-In Basis", "atInBasis"],
            ["Going-In Cap Rate", "goingInCapRate"],
            ["Going-Out Cap Rate", "goingOutCapRate"],
            ["Cash-on-Cash Return", "cashOnCashReturn"],
            ["Leverage IRR", "leverageIRR"],
            ["Levered IRR", "leveredIRR"],
            ["Debt-on-Cash Return", "debtOnCashReturn"],
            ["DSCR", "dscr"],
            ["Occupancy", "occupancy"],
          ] as const
        ).map(([label, key]) => (
          <div key={key}>
            <div className="text-gray-500">{label}</div>
            {isEditing ? (
              <Input
                className="h-8 text-sm"
                name={key}
                type="number"
                value={(editable as any)[key]}
                onChange={handleInputChange}
              />
            ) : (
              <div className="font-medium text-gray-800">
                {key.includes("Cap") ||
                key.includes("IRR") ||
                key === "occupancy"
                  ? `${(financialSummary as any)[key]}${
                      key === "dscr" ? "x" : "%"
                    }`
                  : key === "dscr"
                  ? `${(financialSummary as any)[key]}x`
                  : formatCurrency((financialSummary as any)[key])}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
