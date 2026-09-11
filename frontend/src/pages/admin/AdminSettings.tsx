import React, { useEffect, useState } from "react";
import {
  Building2,
  ShieldAlert,
  KeyRound,
  Save,
  CheckCircle2,
} from "lucide-react";

import {
  getStudioSettings,
  updateStudioSettings,
  updateAdminAccount,
  getAdminUser,
} from "../../services/adminApi";

export default function AdminSettings() {
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const [successMessage, setSuccessMessage] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  const [studioInfo, setStudioInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [policies, setPolicies] = useState({
    depositPercentage: 30,
    gracePeriodMinutes: 15,
    cancellationNoticeHours: 24,
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // ======================================================
  // LOAD SETTINGS
  // ======================================================

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const response = await getStudioSettings();

        const data = response?.data;

        if (!data) {
          throw new Error(
            "No studio settings were returned."
          );
        }

        setStudioInfo({
          name:
            data.studioName ||
            data.name ||
            "Lume Beauty Studio",

          email: data.email || "",

          phone: data.phone || "",

          address: data.address || "",
        });

        setPolicies({
          depositPercentage:
            data.depositPercentage ?? 30,

          gracePeriodMinutes:
            data.latenessGracePeriod ??
            data.gracePeriodMinutes ??
            15,

          cancellationNoticeHours:
            data.cancellationNoticeHours ??
            24,
        });
      } catch (error) {
        console.error(
          "Failed to load studio settings:",
          error
        );

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Failed to load studio settings."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // ======================================================
  // SAVE SETTINGS
  // ======================================================

  const handleSaveSettings = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    // --------------------------------------------------
    // BASIC VALIDATION
    // --------------------------------------------------

    if (!studioInfo.name.trim()) {
      setErrorMessage(
        "Studio name is required."
      );
      return;
    }

    if (!studioInfo.email.trim()) {
      setErrorMessage(
        "Contact email is required."
      );
      return;
    }

    // --------------------------------------------------
    // PASSWORD VALIDATION
    // --------------------------------------------------

    if (
      passwords.newPassword !==
      passwords.confirmPassword
    ) {
      setErrorMessage(
        "New passwords do not match."
      );
      return;
    }

    if (
      passwords.newPassword &&
      !passwords.currentPassword
    ) {
      setErrorMessage(
        "Enter your current password to change it."
      );
      return;
    }

    if (
      passwords.currentPassword &&
      !passwords.newPassword
    ) {
      setErrorMessage(
        "Enter a new password."
      );
      return;
    }

    setSaving(true);

    try {
      // ==================================================
      // SAVE STUDIO SETTINGS
      // ==================================================

      await updateStudioSettings({
        studioName:
          studioInfo.name.trim(),

        email:
          studioInfo.email
            .trim()
            .toLowerCase(),

        phone:
          studioInfo.phone.trim(),

        address:
          studioInfo.address.trim(),

        depositPercentage:
          policies.depositPercentage,

        latenessGracePeriod:
          policies.gracePeriodMinutes,

        cancellationNoticeHours:
          policies.cancellationNoticeHours,
      });

      // ==================================================
      // CHANGE ADMIN PASSWORD
      // ==================================================

      if (
        passwords.currentPassword &&
        passwords.newPassword
      ) {
        const adminUser = getAdminUser();

        await updateAdminAccount({
          currentPassword:
            passwords.currentPassword,

          newPassword:
            passwords.newPassword,

          email:
            adminUser?.email || "",
        });
      }

      // ==================================================
      // SUCCESS
      // ==================================================

      setSuccessMessage(
        "Settings updated successfully."
      );

      // Clear password fields after successful save
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error(
        "Save settings error:",
        error
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to save settings."
      );
    } finally {
      setSaving(false);
    }
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-sm text-[#78716C]">
          Loading studio settings...
        </p>
      </div>
    );
  }

  // ======================================================
  // PAGE
  // ======================================================

  return (
    <div className="space-y-6">
      <form onSubmit={handleSaveSettings}>
        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#78716C]">
              Configuration
            </p>

            <h1 className="font-serif text-3xl font-semibold text-[#3D1E1A]">
              Settings
            </h1>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 bg-[#3D1E1A] text-white px-5 py-2.5 rounded-xl text-xs font-semibold hover:bg-[#291411] transition-colors shadow-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4" />

            <span>
              {saving
                ? "Saving Changes..."
                : "Save Settings"}
            </span>
          </button>
        </div>

        {/* ==================================================
            SUCCESS MESSAGE
        ================================================== */}

        {successMessage && (
          <div className="mb-5 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />

            <span>
              {successMessage}
            </span>
          </div>
        )}

        {/* ==================================================
            ERROR MESSAGE
        ================================================== */}

        {errorMessage && (
          <div className="mb-5 p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
            {errorMessage}
          </div>
        )}

        {/* ==================================================
            STUDIO INFORMATION
        ================================================== */}

        <section className="bg-white border border-[#E8DFD8] p-6 rounded-2xl shadow-sm space-y-4 mb-6">
          <div className="flex items-center gap-3 pb-3 border-b border-[#E8DFD8]">
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
            {/* Studio Name */}
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#78716C] mb-1">
                Studio Name
              </label>

              <input
                type="text"
                value={studioInfo.name}
                onChange={(e) =>
                  setStudioInfo({
                    ...studioInfo,
                    name: e.target.value,
                  })
                }
                className="w-full bg-[#FAF7F3] border border-[#E8DFD8] rounded-xl p-3 outline-none focus:border-[#C88A95] font-medium"
              />
            </div>

            {/* Contact Email */}
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#78716C] mb-1">
                Contact Email
              </label>

              <input
                type="email"
                value={studioInfo.email}
                onChange={(e) =>
                  setStudioInfo({
                    ...studioInfo,
                    email: e.target.value,
                  })
                }
                className="w-full bg-[#FAF7F3] border border-[#E8DFD8] rounded-xl p-3 outline-none focus:border-[#C88A95] font-medium"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#78716C] mb-1">
                Phone Number
              </label>

              <input
                type="text"
                value={studioInfo.phone}
                onChange={(e) =>
                  setStudioInfo({
                    ...studioInfo,
                    phone: e.target.value,
                  })
                }
                className="w-full bg-[#FAF7F3] border border-[#E8DFD8] rounded-xl p-3 outline-none focus:border-[#C88A95] font-medium"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#78716C] mb-1">
                Physical Address
              </label>

              <input
                type="text"
                value={studioInfo.address}
                onChange={(e) =>
                  setStudioInfo({
                    ...studioInfo,
                    address: e.target.value,
                  })
                }
                className="w-full bg-[#FAF7F3] border border-[#E8DFD8] rounded-xl p-3 outline-none focus:border-[#C88A95] font-medium"
              />
            </div>
          </div>
        </section>

        {/* ==================================================
            BOOKING POLICIES
        ================================================== */}

        <section className="bg-white border border-[#E8DFD8] p-6 rounded-2xl shadow-sm space-y-4 mb-6">
          <div className="flex items-center gap-3 pb-3 border-b border-[#E8DFD8]">
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
            {/* Deposit */}
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#78716C] mb-1">
                Deposit Requirement (%)
              </label>

              <input
                type="number"
                min="0"
                max="100"
                value={policies.depositPercentage}
                onChange={(e) =>
                  setPolicies({
                    ...policies,
                    depositPercentage:
                      Number(e.target.value),
                  })
                }
                className="w-full bg-[#FAF7F3] border border-[#E8DFD8] rounded-xl p-3 outline-none focus:border-[#C88A95] font-medium"
              />
            </div>

            {/* Grace Period */}
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#78716C] mb-1">
                Grace Period (Minutes)
              </label>

              <input
                type="number"
                min="0"
                value={policies.gracePeriodMinutes}
                onChange={(e) =>
                  setPolicies({
                    ...policies,
                    gracePeriodMinutes:
                      Number(e.target.value),
                  })
                }
                className="w-full bg-[#FAF7F3] border border-[#E8DFD8] rounded-xl p-3 outline-none focus:border-[#C88A95] font-medium"
              />
            </div>

            {/* Cancellation */}
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#78716C] mb-1">
                Cancellation Window (Hours)
              </label>

              <input
                type="number"
                min="0"
                value={
                  policies.cancellationNoticeHours
                }
                onChange={(e) =>
                  setPolicies({
                    ...policies,
                    cancellationNoticeHours:
                      Number(e.target.value),
                  })
                }
                className="w-full bg-[#FAF7F3] border border-[#E8DFD8] rounded-xl p-3 outline-none focus:border-[#C88A95] font-medium"
              />
            </div>
          </div>
        </section>

        {/* ==================================================
            ACCOUNT SECURITY
        ================================================== */}

        <section className="bg-white border border-[#E8DFD8] p-6 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-[#E8DFD8]">
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
            {/* Current Password */}
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#78716C] mb-1">
                Current Password
              </label>

              <input
                type="password"
                placeholder="••••••••"
                value={
                  passwords.currentPassword
                }
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    currentPassword:
                      e.target.value,
                  })
                }
                className="w-full bg-[#FAF7F3] border border-[#E8DFD8] rounded-xl p-3 outline-none focus:border-[#C88A95] font-medium"
              />
            </div>

            {/* New Password */}
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#78716C] mb-1">
                New Password
              </label>

              <input
                type="password"
                placeholder="••••••••"
                value={passwords.newPassword}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    newPassword:
                      e.target.value,
                  })
                }
                className="w-full bg-[#FAF7F3] border border-[#E8DFD8] rounded-xl p-3 outline-none focus:border-[#C88A95] font-medium"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#78716C] mb-1">
                Confirm New Password
              </label>

              <input
                type="password"
                placeholder="••••••••"
                value={
                  passwords.confirmPassword
                }
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    confirmPassword:
                      e.target.value,
                  })
                }
                className="w-full bg-[#FAF7F3] border border-[#E8DFD8] rounded-xl p-3 outline-none focus:border-[#C88A95] font-medium"
              />
            </div>
          </div>
        </section>
      </form>
    </div>
  );
}