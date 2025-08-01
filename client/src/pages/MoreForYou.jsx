import { Link, Link2 } from "lucide-react";
import React from "react";

const MoreForYou = () => {
  return (
    <div>
      <div class="max-w-md mx-auto mt-10 p-6 bg-gray-700 text-white rounded-lg shadow-lg">
        <h2 class="text-xl font-bold text-gray-300 mb-2">
          🚀 Made with ❤️ by <span class="text-sky-500">Sahil Sahu</span>
        </h2>
        <p class="text-sm text-gray-300 mb-4">
          This project reflects my passion for building clean and functional
          websites. Connect with me below 👇
        </p>

        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <a
            href="https://github.com/sahilsahu731"
            target="_blank"
            class="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg shadow hover:bg-gray-900 transition"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 .5C5.73.5.5 5.73.5 12a11.5 11.5 0 008 11c.58.1.79-.25.79-.56 0-.27-.01-1.17-.01-2.13-3.27.71-3.96-1.45-3.96-1.45-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.76 2.68 1.25 3.33.96.1-.74.4-1.25.72-1.54-2.61-.3-5.35-1.3-5.35-5.79 0-1.28.46-2.32 1.18-3.14-.12-.29-.52-1.46.11-3.05 0 0 .99-.32 3.25 1.2a11.27 11.27 0 015.91 0c2.26-1.52 3.25-1.2 3.25-1.2.63 1.59.23 2.76.11 3.05.73.82 1.18 1.86 1.18 3.14 0 4.5-2.75 5.48-5.37 5.77.42.37.77 1.11.77 2.24 0 1.62-.01 2.93-.01 3.33 0 .31.21.67.8.56A11.5 11.5 0 0023.5 12C23.5 5.73 18.27.5 12 .5z" />
            </svg>
            GitHub
          </a>
          <a
            href="https://sahil-sahu-portfolio.vercel.app"
            target="_blank"
            class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            <Link/>
            Portfolio
          </a>
        </div>
      </div>
    </div>
  );
};

export default MoreForYou;
