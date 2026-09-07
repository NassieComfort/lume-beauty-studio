import { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, Save, CalendarDays } from "lucide-react";
import {
  getAdminAvailability,
  updateAdminAvailability,
} from "../../services/adminApi";

interface Availability {
  dayOfWeek: number;
  isOpen: boolean;
  openingTime?: string;
  closingTime?: string;
}

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const defaultHours = { openingTime: "09:00", closingTime: "18:00" };

export default function AdminAvailability() {
  const [availability, setAvailability] = useState<Availability[]>(
    days.map((_, dayOfWeek) => ({ dayOfWeek, isOpen: true, ...defaultHours }))
  );
  const [loading, setLoading] = useState(true);
  const [savingDay, setSavingDay] = useState<number | null>(null);
  const [savingAll, setSavingAll] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getAdminAvailability()
      .then((response) => {
        const saved = response.data || [];
        setAvailability(
          days.map((_, dayOfWeek) =>
            saved.find((item: Availability) => item.dayOfWeek === dayOfWeek) || {
              dayOfWeek,
              isOpen: true,
              ...defaultHours,
            }
          )
        );
      })
      .catch((loadError) =>
        setError(loadError instanceof Error ? loadError.message : "Unable to load availability.")
      )
      .finally(() => setLoading(false));
  }, []);

  const updateDay = (dayOfWeek: number, changes: Partial<Availability>) => {
    setAvailability((current) =>
      current.map((item) => (item.dayOfWeek === dayOfWeek ? { ...item, ...changes } : item))
    );
  };

  const saveDay = async (item: Availability) => {
    setSavingDay(item.dayOfWeek);
    setMessage("");
    setError("");
    try {
      await updateAdminAvailability(item);
      setMessage(`${days[item.dayOfWeek]} hours updated successfully.`);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save availability.");
    } finally {
      setSavingDay(null);
    }
  };

  const saveAllDays = async () => {
    setSavingAll(true);
    setMessage("");
    setError("");
    try {
      await Promise.all(availability.map((item) => updateAdminAvailability(item)));
      setMessage("All schedule changes saved successfully.");
    } catch (saveError) {
      setError("Failed to save schedule settings.");
    } finally {
      setSavingAll(false);
    }
  };

  return (
    <div className="p-6 lg:p-10 space-y-8 bg-[#FAF7F3] min-h-screen text-[#292524]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#78716C] mb-1">
            Management
          </p>
          <h1 className="font-serif text-3xl font-semibold text-[#3D1E1A]">
            Working Hours & Availability
          </h1>
          <p className="text-xs text-[#78716C] mt-1">
            Set your operating hours and open slots for client bookings.
          </p>
        </div>

        <button
          type="button"
          onClick={saveAllDays}
          disabled={savingAll || loading}
          className="inline-flex items-center justify-center space-x-2 bg-[#3D1E1A] text-white px-5 py-2.5 rounded-xl text-xs font-semibold hover:bg-[#291411] transition-colors disabled:opacity-50 shadow-sm"
        >
          <Save className="w-4 h-4" />
          <span>{savingAll ? "Saving All..." : "Save All Schedule"}</span>
        </button>
      </div>

      {/* Notifications */}
      {message && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Working Hours Rows */}
      {loading ? (
        <div className="p-12 flex justify-center items-center text-[#78716C] text-xs">
          <div className="w-4 h-4 border-2 border-[#C88A95] border-t-transparent rounded-full animate-spin mr-2"></div>
          Loading studio availability...
        </div>
      ) : (
        <div className="bg-white border border-[#E8DFD8] rounded-2xl shadow-sm overflow-hidden divide-y divide-[#E8DFD8]">
          {availability.map((item) => {
            const isSaving = savingDay === item.dayOfWeek;

            return (
              <div
                key={item.dayOfWeek}
                className={`p-5 grid gap-4 sm:grid-cols-[1.5fr_1fr_2fr_auto] sm:items-center transition-colors ${
                  item.isOpen ? "bg-white" : "bg-[#FAF7F3]/60"
                }`}
              >
                {/* Day Info */}
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-xl ${item.isOpen ? "bg-[#FAF7F3] text-[#3D1E1A]" : "bg-gray-100 text-gray-400"}`}>
                    <CalendarDays className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-xs text-[#292524]">{days[item.dayOfWeek]}</p>
                    <p className="text-[11px] text-[#78716C]">
                      {item.isOpen ? "Open for bookings" : "Closed"}
                    </p>
                  </div>
                </div>

                {/* Status Toggle Switch */}
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => updateDay(item.dayOfWeek, { isOpen: !item.isOpen })}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      item.isOpen ? "bg-[#3D1E1A]" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        item.isOpen ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                  <span className="ml-2 text-xs text-[#292524] font-medium">
                    {item.isOpen ? "Active" : "Closed"}
                  </span>
                </div>

                {/* Time Selectors */}
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <input
                      type="time"
                      disabled={!item.isOpen}
                      value={item.openingTime || "09:00"}
                      onChange={(e) => updateDay(item.dayOfWeek, { openingTime: e.target.value })}
                      className="w-full bg-[#FAF7F3] border border-[#E8DFD8] rounded-xl px-3 py-2 text-xs text-[#292524] font-medium outline-none focus:border-[#C88A95] disabled:opacity-40 disabled:cursor-not-allowed"
                    />
                  </div>
                  <span className="text-xs text-[#78716C]">to</span>
                  <div className="relative flex-1">
                    <input
                      type="time"
                      disabled={!item.isOpen}
                      value={item.closingTime || "18:00"}
                      onChange={(e) => updateDay(item.dayOfWeek, { closingTime: e.target.value })}
                      className="w-full bg-[#FAF7F3] border border-[#E8DFD8] rounded-xl px-3 py-2 text-xs text-[#292524] font-medium outline-none focus:border-[#C88A95] disabled:opacity-40 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Individual Row Action */}
                <div>
                  <button
                    type="button"
                    onClick={() => saveDay(item)}
                    disabled={isSaving}
                    className="w-full sm:w-auto px-4 py-2 bg-[#FAF7F3] border border-[#E8DFD8] hover:bg-[#E8DFD8]/50 text-[#292524] font-semibold text-xs rounded-xl transition-colors disabled:opacity-50"
                  >
                    {isSaving ? "Saving..." : "Save Row"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}