import React, { useState } from "react";
import { Building2, ShieldAlert, KeyRound, Save, CheckCircle2 } from "lucide-react";
import { updateAdminAccount } from "../../services/adminApi";

export default function AdminSettings() {
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Studio Details State
  const [studioInfo, setStudioInfo] = useState({
    name: "Lume Beauty Studio",
    email: "contact@lumebeautystudio.com",
    phone: "+234 800 000 0000",
    address: "Ibadan, Oyo State, Nigeria",
  });

  // Booking Policies State
  const [policies, setPolicies] = useState({
    depositPercentage: 30,
    gracePeriodMinutes: 15,
    cancellationNoticeHours: 24,
  });

  // Password Update State
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (!studioInfo.email.trim()) {
      setErrorMessage("Contact email is required.");
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      setErrorMessage("New passwords do not match.");
      return;
    }

    if (passwords.newPassword && !passwords.currentPassword) {
      setErrorMessage("Enter your current password to change it.");
      return;
    }

    setSaving(true);
    try {
      if (passwords.currentPassword) {
        await updateAdminAccount({
          currentPassword: passwords.currentPassword,
          email: studioInfo.email,
          newPassword: passwords.newPassword || undefined,
        });
      }
      setSaving(false);
      setSuccessMessage("Settings updated successfully.");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to save settings.");
      setSaving(false);
    }
  };

  return (
    <div className="p-6 lg:p-10 space-y-8 bg-[#FAF7F3] min-h-screen text-[#292524]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#78716C] mb-1">
            Configuration
          </p>
          <h1 className="font-serif text-3xl font-semibold text-[#3D1E1A]">
            Settings
          </h1>
        </div>

        <button
          type="button"
          onClick={handleSaveSettings}
          disabled={saving}
          className="inline-flex items-center justify-center space-x-2 bg-[#3D1E1A] text-white px-5 py-2.5 rounded-xl text-xs font-semibold hover:bg-[#291411] transition-colors shadow-sm disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Saving Changes..." : "Save Settings"}</span>
        </button>
      </div>

      {/* Success Banner */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-8">
        {/* Studio Information */}
        <section className="bg-white border border-[#E8DFD8] p-6 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-[#E8DFD8]">
            <div className="p-2 rounded-xl bg-[#FAF7F3] text-[#3D1E1A]">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-semibold text-[#3D1E1A]">
                Studio Information
              </h2>
              <p className="text-xs text-[#78716C]">
                General business details displayed across your booking portal.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 text-xs">
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#78716C] mb-1">
                Studio Name
              </label>
              <input
                type="text"
                value={studioInfo.name}
                onChange={(e) => setStudioInfo({ ...studioInfo, name: e.target.value })}
                className="w-full bg-[#FAF7F3] border border-[#E8DFD8] rounded-xl p-3 outline-none focus:border-[#C88A95] font-medium"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#78716C] mb-1">
                Contact Email
              </label>
              <input
                type="email"
                value={studioInfo.email}
                onChange={(e) => setStudioInfo({ ...studioInfo, email: e.target.value })}
                className="w-full bg-[#FAF7F3] border border-[#E8DFD8] rounded-xl p-3 outline-none focus:border-[#C88A95] font-medium"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#78716C] mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={studioInfo.phone}
                onChange={(e) => setStudioInfo({ ...studioInfo, phone: e.target.value })}
                className="w-full bg-[#FAF7F3] border border-[#E8DFD8] rounded-xl p-3 outline-none focus:border-[#C88A95] font-medium"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#78716C] mb-1">
                Physical Address
              </label>
              <input
                type="text"
                value={studioInfo.address}
                onChange={(e) => setStudioInfo({ ...studioInfo, address: e.target.value })}
                className="w-full bg-[#FAF7F3] border border-[#E8DFD8] rounded-xl p-3 outline-none focus:border-[#C88A95] font-medium"
              />
            </div>
          </div>
        </section>

        {/* Booking Policies */}
        <section className="bg-white border border-[#E8DFD8] p-6 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-[#E8DFD8]">
            <div className="p-2 rounded-xl bg-[#FAF7F3] text-[#3D1E1A]">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-semibold text-[#3D1E1A]">
                Booking Policies
              </h2>
              <p className="text-xs text-[#78716C]">
                Configure required deposits, cancellation windows, and lateness rules.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 text-xs">
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#78716C] mb-1">
                Deposit Requirement (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={policies.depositPercentage}
                onChange={(e) => setPolicies({ ...policies, depositPercentage: Number(e.target.value) })}
                className="w-full bg-[#FAF7F3] border border-[#E8DFD8] rounded-xl p-3 outline-none focus:border-[#C88A95] font-medium"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#78716C] mb-1">
                Grace Period (Minutes)
              </label>
              <input
                type="number"
                min="0"
                value={policies.gracePeriodMinutes}
                onChange={(e) => setPolicies({ ...policies, gracePeriodMinutes: Number(e.target.value) })}
                className="w-full bg-[#FAF7F3] border border-[#E8DFD8] rounded-xl p-3 outline-none focus:border-[#C88A95] font-medium"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#78716C] mb-1">
                Cancellation Window (Hours)
              </label>
              <input
                type="number"
                min="0"
                value={policies.cancellationNoticeHours}
                onChange={(e) => setPolicies({ ...policies, cancellationNoticeHours: Number(e.target.value) })}
                className="w-full bg-[#FAF7F3] border border-[#E8DFD8] rounded-xl p-3 outline-none focus:border-[#C88A95] font-medium"
              />
            </div>
          </div>
        </section>

        {/* Security & Credentials */}
        <section className="bg-white border border-[#E8DFD8] p-6 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-[#E8DFD8]">
            <div className="p-2 rounded-xl bg-[#FAF7F3] text-[#3D1E1A]">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-semibold text-[#3D1E1A]">
                Account Security
              </h2>
              <p className="text-xs text-[#78716C]">
                Update administrative access passwords.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 text-xs">
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#78716C] mb-1">
                Current Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={passwords.currentPassword}
                onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                className="w-full bg-[#FAF7F3] border border-[#E8DFD8] rounded-xl p-3 outline-none focus:border-[#C88A95] font-medium"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#78716C] mb-1">
                New Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={passwords.newPassword}
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                className="w-full bg-[#FAF7F3] border border-[#E8DFD8] rounded-xl p-3 outline-none focus:border-[#C88A95] font-medium"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#78716C] mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={passwords.confirmPassword}
                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                className="w-full bg-[#FAF7F3] border border-[#E8DFD8] rounded-xl p-3 outline-none focus:border-[#C88A95] font-medium"
              />
            </div>
          </div>
        </section>
      </form>
    </div>
  );
}