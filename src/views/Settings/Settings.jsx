'use client'

import React, { useState } from "react"
import Loader from "@/components/Loader/Loader"

const Settings = () => {
  const [loading, setLoading] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [enabled, setEnabled] = useState(true)

  const updateBasicDetails = () => {
    setLoading(true)
    // do something
    setLoading(false)
  }

  const validatePassword = () => {
    if (currentPassword && newPassword === confirmNewPassword) {
      // updateUser
    }
  }

  return (
    <section id="settings" className="px-5 md:px-8 py-6 space-y-12">
      {/* Page Title */}
      <h1 className="text-3xl font-semibold mb-6">Settings</h1>

      {/* Basic Details */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-medium">Basic Details</h2>
          <p className="text-gray-500 text-sm">
            Basic information about you. Your email address is your username.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">First name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Last name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email address</label>
            <input
              type="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div className="flex justify-end mt-6">
            <button
              className={`cta-button ${loading ? "loading" : ""}`}
              onClick={updateBasicDetails}
              disabled={loading}
            >
              {loading ? <Loader /> : "Update details"}
            </button>
          </div>
        </div>
      </div>

      {/* Password */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-medium">Password</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Confirm New Password</label>
            <input
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div className="flex justify-end mt-6">
            <button
              className={`cta-button ${loading ? "loading" : ""}`}
              onClick={validatePassword}
              disabled={loading}
            >
              {loading ? <Loader /> : "Update password"}
            </button>
          </div>
        </div>
      </div>

      {/* Example Switch */}
      <div className="flex flex-col gap-3 mt-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={enabled}
            onChange={() => setEnabled(!enabled)}
            className="w-5 h-5 rounded-md accent-primary focus:ring-2 focus:ring-primary"
          />
          <span className="text-sm font-medium">Label</span>
        </label>

        <label className="flex items-center gap-3 opacity-50 cursor-not-allowed">
          <input type="checkbox" disabled className="w-5 h-5 rounded-md" />
          <span className="text-sm font-medium">Disabled</span>
        </label>
      </div>
    </section>
  )
}

export default Settings
