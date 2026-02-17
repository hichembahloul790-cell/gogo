"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface ReportStatus {
  trackingNumber: string;
  status: string;
  priority: string;
  incidentDescription: string;
  incidentUrl: string | null;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
  resolution: string | null;
  category: string;
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending: {
    label: "En attente",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  in_review: {
    label: "En cours d'analyse",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  resolved: {
    label: "Résolu",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  rejected: {
    label: "Rejeté",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
};

function SuivreContent() {
  const searchParams = useSearchParams();
  const [trackingNumber, setTrackingNumber] = useState(searchParams.get("tracking") || "");
  const [report, setReport] = useState<ReportStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const tracking = searchParams.get("tracking");
    if (tracking) {
      handleSearch(tracking);
    }
  }, [searchParams]);

  const handleSearch = async (tracking?: string) => {
    const searchValue = tracking || trackingNumber;
    if (!searchValue.trim()) {
      setError("Veuillez entrer un numéro de suivi");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSearched(true);

    try {
      const response = await fetch(`/api/reports?tracking=${encodeURIComponent(searchValue)}`);
      const data = await response.json();

      if (response.ok && data.success) {
        setReport(data.report);
      } else {
        setError(data.error || "Signalement non trouvé");
        setReport(null);
      }
    } catch {
      setError("Une erreur est survenue lors de la recherche");
      setReport(null);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Suivre un signalement
          </h1>
          <p className="text-gray-600">
            Entrez votre numéro de suivi pour consulter l&apos;avancement de votre signalement
          </p>
        </div>

        {/* Search Form */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-6 md:p-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Ex: SIG-ABC123-XYZ"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  error={error || undefined}
                />
              </div>
              <Button
                variant="primary"
                onClick={() => handleSearch()}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Recherche...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Rechercher
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Report Details */}
        {report && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 overflow-hidden">
              {/* Status Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm mb-1">Numéro de suivi</p>
                    <p className="text-2xl font-mono font-bold">{report.trackingNumber}</p>
                  </div>
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${statusConfig[report.status]?.color || "bg-gray-100 text-gray-800"}`}>
                    {statusConfig[report.status]?.icon}
                    <span className="font-medium">{statusConfig[report.status]?.label || report.status}</span>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="p-6 md:p-8 space-y-6">
                {/* Timeline */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Chronologie</h3>
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                    <div className="space-y-6">
                      <div className="relative flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center z-10">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Signalement créé</p>
                          <p className="text-sm text-gray-500">{formatDate(report.createdAt)}</p>
                        </div>
                      </div>

                      {report.status !== "pending" && (
                        <div className="relative flex items-start gap-4">
                          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center z-10">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">En cours d&apos;analyse</p>
                            <p className="text-sm text-gray-500">{formatDate(report.updatedAt)}</p>
                          </div>
                        </div>
                      )}

                      {report.status === "resolved" && report.resolvedAt && (
                        <div className="relative flex items-start gap-4">
                          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center z-10">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Résolu</p>
                            <p className="text-sm text-gray-500">{formatDate(report.resolvedAt)}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Report Info */}
                <div className="border-t border-gray-100 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Détails du signalement</h3>
                  <dl className="space-y-4">
                    <div>
                      <dt className="text-sm text-gray-500">Catégorie</dt>
                      <dd className="font-medium text-gray-900">{report.category || "-"}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Description</dt>
                      <dd className="text-gray-900">{report.incidentDescription}</dd>
                    </div>
                    {report.incidentUrl && (
                      <div>
                        <dt className="text-sm text-gray-500">URL concernée</dt>
                        <dd className="text-gray-900 break-all">
                          <a
                            href={report.incidentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {report.incidentUrl}
                          </a>
                        </dd>
                      </div>
                    )}
                    {report.resolution && (
                      <div>
                        <dt className="text-sm text-gray-500">Résolution</dt>
                        <dd className="text-gray-900">{report.resolution}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No Results */}
        {searched && !report && !isLoading && !error && (
          <div className="max-w-xl mx-auto text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun signalement trouvé</h3>
            <p className="text-gray-500">
              Vérifiez que le numéro de suivi est correct et réessayez.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SuivrePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Suivre un signalement
            </h1>
            <p className="text-gray-600">Chargement...</p>
          </div>
        </div>
      </div>
    }>
      <SuivreContent />
    </Suspense>
  );
}