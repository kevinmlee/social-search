import React from "react";

export default function Loader() {
  return (
    <div className="loader text-center pt-[100px]">
      <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-accent rounded-full animate-spin"></div>
    </div>
  );
}
