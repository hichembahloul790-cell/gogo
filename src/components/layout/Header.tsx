import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/50 bg-white/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/25">
            <svg
              className="h-6 w-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
              />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-gray-900">
              Signalement
            </span>
            <span className="text-xs text-gray-500">
              Plateforme de signalement
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-sm font-medium text-gray-600 transition-colors hover:text-blue-600"
          >
            Accueil
          </Link>
          <Link
            href="/signaler"
            className="text-sm font-medium text-gray-600 transition-colors hover:text-blue-600"
          >
            Signaler
          </Link>
          <Link
            href="/suivre"
            className="text-sm font-medium text-gray-600 transition-colors hover:text-blue-600"
          >
            Suivre un signalement
          </Link>
          <Link
            href="/faq"
            className="text-sm font-medium text-gray-600 transition-colors hover:text-blue-600"
          >
            FAQ
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/signaler"
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/30 hover:scale-105"
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Nouveau signalement
          </Link>
        </div>
      </div>
    </header>
  );
}
