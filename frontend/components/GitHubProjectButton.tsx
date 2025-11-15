export default function GitHubProjectButton({ link }: { link?: string }) {
  if (!link) return null; // no button if no link

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-md bg-black text-white dark:bg-gray-800 dark:text-white hover:bg-gray-900"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 16 16"
        className="w-4 h-4"
      >
        <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 005.47 7.59c.4.07.55-.17.55-.38v-1.33c-2.23.48-2.7-1.07-2.7-1.07-.36-.92-.89-1.17-.89-1.17-.73-.5.06-.49.06-.49.81.06 1.24.84 1.24.84.72 1.23 1.88.88 2.34.67.07-.52.28-.88.5-1.09-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82A7.56 7.56 0 018 4.7c.68.003 1.36.092 1.99.27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.2c0 .21.15.45.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z" />
      </svg>

      View on GitHub
    </a>
  );
}
