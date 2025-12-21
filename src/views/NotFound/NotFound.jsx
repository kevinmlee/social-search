import React from "react";
import Link from "next/link";

const NotFound = () => {
  return (
    <div id="notFound" className="flex flex-col items-center justify-center min-h-screen text-center px-8">
      <h2 className="text-4xl font-bold mb-4 text-black dark:text-white">Well this is awkward.</h2>
      <p className="text-lg mb-6 text-gray-600 dark:text-gray-400">This page could not be found.</p>
      <Link
        href="/"
        className="px-6 py-3 rounded-md font-medium transition-colors bg-accent hover:bg-accent/90 cursor-pointer text-black"
      >
        Go to dashboard
      </Link>
    </div>
  );
}

export default NotFound