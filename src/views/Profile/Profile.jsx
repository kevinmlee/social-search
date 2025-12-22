'use client'

import React, { useState } from "react"
// import { ToggleRight } from "lucide-react" // example icon for toggle (optional)

const Profile = () => {
  const [enabled, setEnabled] = useState(true)

  return (
    <section id="settings" className="px-8 py-6">
      <div>
        <h2 className="text-2xl font-semibold mb-6">Topics</h2>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Left / Center column */}
          <div className="flex-1 flex flex-col gap-6">
            <h3 className="text-xl font-medium">Settings</h3>

            {/* Example switch group */}
            <div className="flex flex-col gap-4">
              {/* Enabled switch */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={() => setEnabled(!enabled)}
                  className="w-5 h-5 rounded-md text-primary accent-primary focus:ring-2 focus:ring-primary"
                />
                <span className="text-sm font-medium">Label</span>
              </label>

              {/* Disabled switch */}
              <label className="flex items-center gap-3 opacity-50 cursor-not-allowed">
                <input type="checkbox" disabled className="w-5 h-5 rounded-md" />
                <span className="text-sm font-medium">Disabled</span>
              </label>
            </div>
          </div>

          {/* Right column (empty for now) */}
          <div className="flex-1"></div>
        </div>
      </div>
    </section>
  )
}

export default Profile
