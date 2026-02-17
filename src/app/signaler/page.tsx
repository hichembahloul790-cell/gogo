"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";

const categories = [
  { value: "harcelement", label: "Harcèlement" },
  { value: "arnaques", label: "Arnaques & Fraudes" },
  { value: "illicite", label: "Contenus illicites" },
  { value: "haine", label: "Discours de haine" },
  { value: "terrorisme", label: "Terrorisme" },
  { value: "mineurs", label: "Protection des mineurs" },
  { value: "autre", label: "Autre" },
];

const steps = [
  { id: 1, title: "Type de signalement", description: "Catégorie et description" },
  { id: 2, title: "Détails", description: "Informations complémentaires" },
  { id: 3, title: "Coordonnées", description: "Contact (optionnel)" },
  { id: 4, title: "Confirmation", description: "Vérification et envoi" },
];

export default function SignalerPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    category: "",
    incidentUrl: "",
    incidentDate: "",
    incidentDescription: "",
    location: "",
    reporterEmail: "",
    reporterPhone: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.category) {
        newErrors.category = "Veuillez sélectionner une catégorie";
      }
      if (!formData.incidentDescription) {
        newErrors.incidentDescription = "Veuillez décrire l'incident";
      } else if (formData.incidentDescription.length < 20) {
        newErrors.incidentDescription = "La description doit contenir au moins 20 caractères";
      }
    }

    if (step === 2) {
      if (formData.incidentUrl && !isValidUrl(formData.incidentUrl)) {
        newErrors.incidentUrl = "Veuillez entrer une URL valide";
      }
    }

    if (step === 3) {
      if (formData.reporterEmail && !isValidEmail(formData.reporterEmail)) {
        newErrors.reporterEmail = "Veuillez entrer une adresse email valide";
      }
      if (formData.reporterPhone && !isValidPhone(formData.reporterPhone)) {
        newErrors.reporterPhone = "Veuillez entrer un numéro de téléphone valide";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPhone = (phone: string): boolean => {
    return /^[\d\s\-+()]{10,}$/.test(phone);
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setTrackingNumber(data.trackingNumber);
        setCurrentStep(4);
      } else {
        setErrors({ submit: "Une erreur est survenue. Veuillez réessayer." });
      }
    } catch {
      setErrors({ submit: "Une erreur est survenue. Veuillez réessayer." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Faire un signalement
          </h1>
          <p className="text-gray-600">
            Remplissez ce formulaire pour signaler un contenu illégal en ligne
          </p>
        </div>

        {/* Progress Steps */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                      currentStep >= step.id
                        ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      step.id
                    )}
                  </div>
                  <div className="mt-2 text-center hidden md:block">
                    <p className={`text-sm font-medium ${currentStep >= step.id ? "text-gray-900" : "text-gray-500"}`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-400">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-full h-1 mx-2 rounded-full transition-all ${
                      currentStep > step.id ? "bg-gradient-to-r from-blue-500 to-indigo-600" : "bg-gray-200"
                    }`}
                    style={{ width: "60px" }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-6 md:p-8">
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Type de signalement
                  </h2>
                  <Select
                    label="Catégorie"
                    options={categories}
                    placeholder="Sélectionnez une catégorie"
                    value={formData.category}
                    onChange={(e) => updateFormData("category", e.target.value)}
                    error={errors.category}
                  />
                </div>
                <Textarea
                  label="Description de l'incident"
                  placeholder="Décrivez en détail l'incident que vous souhaitez signaler..."
                  value={formData.incidentDescription}
                  onChange={(e) => updateFormData("incidentDescription", e.target.value)}
                  error={errors.incidentDescription}
                  helperText="Minimum 20 caractères"
                />
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Détails de l&apos;incident
                  </h2>
                  <Input
                    label="URL du contenu (si applicable)"
                    placeholder="https://exemple.com/page"
                    value={formData.incidentUrl}
                    onChange={(e) => updateFormData("incidentUrl", e.target.value)}
                    error={errors.incidentUrl}
                    helperText="L'adresse web où se trouve le contenu illégal"
                  />
                </div>
                <Input
                  label="Date de l'incident (si connue)"
                  type="date"
                  value={formData.incidentDate}
                  onChange={(e) => updateFormData("incidentDate", e.target.value)}
                />
                <Input
                  label="Lieu (si applicable)"
                  placeholder="Ville, région..."
                  value={formData.location}
                  onChange={(e) => updateFormData("location", e.target.value)}
                  helperText="Le lieu où s'est déroulé l'incident si pertinent"
                />
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Vos coordonnées
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Ces informations sont optionnelles mais nous permettent de vous contacter
                    pour vous tenir informé de l&apos;avancement de votre signalement.
                  </p>
                  <Input
                    label="Adresse email"
                    type="email"
                    placeholder="votre@email.com"
                    value={formData.reporterEmail}
                    onChange={(e) => updateFormData("reporterEmail", e.target.value)}
                    error={errors.reporterEmail}
                  />
                </div>
                <Input
                  label="Téléphone"
                  type="tel"
                  placeholder="06 12 34 56 78"
                  value={formData.reporterPhone}
                  onChange={(e) => updateFormData("reporterPhone", e.target.value)}
                  error={errors.reporterPhone}
                />
              </div>
            )}

            {currentStep === 4 && trackingNumber && (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Signalement envoyé !
                </h2>
                <p className="text-gray-600 mb-6">
                  Votre signalement a été enregistré avec succès.
                </p>
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <p className="text-sm text-gray-500 mb-1">Votre numéro de suivi</p>
                  <p className="text-2xl font-mono font-bold text-blue-600">{trackingNumber}</p>
                </div>
                <p className="text-sm text-gray-500 mb-6">
                  Conservez ce numéro pour suivre l&apos;avancement de votre signalement.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    variant="primary"
                    onClick={() => router.push(`/suivre?tracking=${trackingNumber}`)}
                  >
                    Suivre mon signalement
                  </Button>
                  <Button variant="outline" onClick={() => router.push("/")}>
                    Retour à l&apos;accueil
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 4 && !trackingNumber && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Récapitulatif de votre signalement
                  </h2>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Catégorie</p>
                      <p className="font-medium text-gray-900">
                        {categories.find((c) => c.value === formData.category)?.label}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Description</p>
                      <p className="font-medium text-gray-900">{formData.incidentDescription}</p>
                    </div>
                    {formData.incidentUrl && (
                      <div>
                        <p className="text-sm text-gray-500">URL</p>
                        <p className="font-medium text-gray-900 break-all">{formData.incidentUrl}</p>
                      </div>
                    )}
                    {formData.reporterEmail && (
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium text-gray-900">{formData.reporterEmail}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-blue-900">Confidentialité garantie</p>
                      <p className="text-sm text-blue-700">
                        Vos informations sont traitées de manière confidentielle conformément
                        à notre politique de protection des données.
                      </p>
                    </div>
                  </div>
                </div>

                {errors.submit && (
                  <div className="bg-red-50 rounded-xl p-4">
                    <p className="text-sm text-red-600">{errors.submit}</p>
                  </div>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            {currentStep < 4 && (
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className={currentStep === 1 ? "invisible" : ""}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Retour
                </Button>
                {currentStep === 3 ? (
                  <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        Envoyer le signalement
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </>
                    )}
                  </Button>
                ) : (
                  <Button variant="primary" onClick={handleNext}>
                    Continuer
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}