import Link from "next/link";

interface CategoryCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color?: string;
}

export function CategoryCard({
  title,
  description,
  icon,
  href,
  color = "blue",
}: CategoryCardProps) {
  const colorClasses: Record<string, { bg: string; icon: string; text: string }> = {
    blue: {
      bg: "bg-blue-50",
      icon: "bg-gradient-to-br from-blue-500 to-blue-600",
      text: "text-blue-600",
    },
    red: {
      bg: "bg-red-50",
      icon: "bg-gradient-to-br from-red-500 to-red-600",
      text: "text-red-600",
    },
    green: {
      bg: "bg-green-50",
      icon: "bg-gradient-to-br from-green-500 to-green-600",
      text: "text-green-600",
    },
    purple: {
      bg: "bg-purple-50",
      icon: "bg-gradient-to-br from-purple-500 to-purple-600",
      text: "text-purple-600",
    },
    orange: {
      bg: "bg-orange-50",
      icon: "bg-gradient-to-br from-orange-500 to-orange-600",
      text: "text-orange-600",
    },
    pink: {
      bg: "bg-pink-50",
      icon: "bg-gradient-to-br from-pink-500 to-pink-600",
      text: "text-pink-600",
    },
  };

  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <Link href={href}>
      <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1">
        <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className={`absolute inset-0 ${colors.bg} opacity-50`} />
        </div>
        <div className="relative">
          <div
            className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${colors.icon} shadow-lg`}
          >
            <span className="text-white">{icon}</span>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
          <div className="mt-4 flex items-center gap-2">
            <span
              className={`text-sm font-medium ${colors.text} group-hover:translate-x-1 transition-transform duration-200`}
            >
              Signaler
            </span>
            <svg
              className={`h-4 w-4 ${colors.text} group-hover:translate-x-1 transition-transform duration-200`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}