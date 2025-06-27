export default function Index() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen text-center p-10 relative bg-cover bg-center"
      style={{ backgroundImage: "url('/pisit-heng-ci1F55HaVWQ-unsplash.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/40 z-0" />

      <div className="relative z-10">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          Unearthed Truths
        </h1>
        <p className="mb-6 text-lg text-gray-700 dark:text-gray-300">
          Explore archaeological discoveries that align with Biblical scripture.
        </p>

        <a
          href="/map"
          className="w-full bg-gray-700/80 text-white font-semibold py-2 px-4 rounded-xl shadow-lg border border-gray-600 hover:bg-gray-600/80 hover:shadow-md active:scale-[0.98] transition duration-150 ease-in-out backdrop-blur-md"
        >
          Explore Discoveries
        </a>
      </div>

      <footer className="absolute bottom-6 right-6 text-sm text-gray-400 z-10">
        <a
          href="/login"
          className="hover:text-amber-400 transition-colors duration-200 font-medium tracking-wide"
        >
          Admin Access
        </a>
      </footer>
    </div>
  );
}
