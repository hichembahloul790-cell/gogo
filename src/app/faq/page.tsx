import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function FAQPage() {
  const faqs = [
    {
      question: "Qu'est-ce que la plateforme de signalement ?",
      answer: "Notre plateforme vous permet de signaler facilement des incidents en ligne. Vous pouvez soumettre des signalements concernant des contenus illicites, des arnaques, ou tout autre problème nécessitant l'attention des autorités compétentes."
    },
    {
      question: "Comment soumettre un signalement ?",
      answer: "Cliquez sur le bouton 'Signaler un incident' dans le menu principal. Vous devrez sélectionner une catégorie, fournir une description détaillée de l'incident, et optionally fournir vos coordonnées pour le suivi."
    },
    {
      question: "Comment suivre l'état de mon signalement ?",
      answer: "Utilisez la page 'Suivre un signalement' et entrez votre numéro de suivi (au format SIG-XXXXX-XXXXX) pour voir le statut actuel de votre demande."
    },
    {
      question: "Mes informations personnelles sont-elles protégées ?",
      answer: "Oui, vos informations personnelles sont strictement confidentielles. Elles ne sont utilisées que pour le suivi de votre signalement et ne sont jamais partagé avec des tiers sans votre consentement."
    },
    {
      question: "Combien de temps faut-il pour obtenir une réponse ?",
      answer: "Le délai de traitement varie selon la complexité du signalement et la charge de travail des autorités. Vous pouvez suivre l'avancement de votre demande à tout moment grâce à votre numéro de suivi."
    },
    {
      question: "Puis-je signaler anonymement ?",
      answer: "Oui, vous pouvez soumettre un signalement sans fournir vos coordonnées. Cependant, cela peut limiter notre capacité à vous contacter pour des informations supplémentaires ou à vous tenir informé de l'évolution de votre dossier."
    },
    {
      question: "Que se passe-t-il après avoir soumis un signalement ?",
      answer: "Votre signalement est transmis aux autorités compétentes qui l'examinent. Vous recevrez un numéro de suivi unique qui vous permettra de vérifier l'état de traitement de votre demande à tout moment."
    },
    {
      question: "Quels types d'incidents puis-je signaler ?",
      answer: "Vous pouvez signaler divers types d'incidents : contenus illicites sur internet, arnaques en ligne, phishing, cyber-harcèlement, violation de données personnelles, ou tout autre activité illégale survenant en ligne."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 text-center mb-4">
            Foire Aux Questions
          </h1>
          <p className="text-lg text-gray-600 text-center mb-12">
            Trouvez réponses à vos questions sur notre plateforme de signalement
          </p>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-start">
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded mr-3 mt-0.5">
                    {index + 1}
                  </span>
                  {faq.question}
                </h2>
                <p className="text-gray-600 leading-relaxed pl-14">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-blue-50 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Vous n'avez pas trouvé votre réponse ?
            </h3>
            <p className="text-gray-600 mb-4">
              N'hésitez pas à nous contacter pour toute question supplémentaire
            </p>
            <a 
              href="/signaler" 
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
            >
              Soumettre un signalement
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
