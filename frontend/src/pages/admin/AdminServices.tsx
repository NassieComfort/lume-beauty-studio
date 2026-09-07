import { useEffect, useState } from "react";
import { Plus, Edit2, Power, X } from "lucide-react";
import {
  getAdminServices,
  createAdminService,
  updateAdminService,
} from "../../services/adminApi";

import acrylicNails from "../../assets/public/Acrylic nails.jpeg";
import browLamination from "../../assets/public/Brow Lamination.jpeg";
import browShaping from "../../assets/public/WhatsApp Image 2026-08-25 at 01.07.18 (1).jpeg";
import browWax from "../../assets/public/Brow Waxing.jpeg";
import classicSet from "../../assets/public/classic-set - .jpg";
import gelNails from "../../assets/public/gel nails.jpeg";
import hybridSet from "../../assets/public/hybrid-set.jpg";
import halfLeg from "../../assets/public/Half leg.jpeg";
import fullLeg from "../../assets/public/Full leg.jpeg";
import megaVolumeSet from "../../assets/public/mega-volume-set.jpg";
import animeSet from "../../assets/public/Anime buttom.jpeg";
import refill from "../../assets/public/refill.jpeg";
import toeNails from "../../assets/public/Toe nail.jpeg";
import underarm from "../../assets/public/Underarm.jpeg";
import volumeSet from "../../assets/public/volume-set.jpg";

interface Service {
  _id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  duration: number;
  image?: string;
  isActive?: boolean;
}

const serviceImages: Record<string, string> = {
  "Classic Full Set": classicSet,
  "Hybrid Full Set": hybridSet,
  "Volume Full Set": volumeSet,
  "Mega Volume + Wispy Set": megaVolumeSet,
  "Anime Lash Set": animeSet,
  "Lash Infills": refill,
  "Gel Nails": gelNails,
  "Gel Toe Nails": toeNails,
  "Acrylic & Powder Set": acrylicNails,
  "Brow Lamination": browLamination,
  "Brow Shaping": browShaping,
  "Brow Wax": browWax,
  "Underarm Wax": underarm,
  "Half-Leg Wax": halfLeg,
  "Full-Leg Wax": fullLeg,
};

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    category: "Lashes",
    description: "",
    price: "",
    duration: "",
    image: "",
  });

  const loadServices = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getAdminServices();
      setServices(response.data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load services."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const openForm = (service?: Service) => {
    setEditingId(service?._id || null);
    setForm({
      name: service?.name || "",
      category: service?.category || "Lashes",
      description: service?.description || "",
      price: service ? String(service.price) : "",
      duration: service ? String(service.duration) : "",
      image: service?.image || "",
    });
    setShowForm(true);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        duration: Number(form.duration),
        image: form.image || serviceImages[form.name] || "",
      };

      if (editingId) {
        await updateAdminService(editingId, payload);
      } else {
        await createAdminService(payload);
      }

      setShowForm(false);
      await loadServices(); // Re-fetch state directly without browser reload
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to save service."
      );
    }
  };

  const handleToggleStatus = async (service: Service) => {
    try {
      const nextState = service.isActive === false;
      await updateAdminService(service._id, { isActive: nextState });
      setServices((prev) =>
        prev.map((s) => (s._id === service._id ? { ...s, isActive: nextState } : s))
      );
    } catch (err) {
      setError("Failed to update status.");
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
            Services
          </h1>
        </div>

        <button
          type="button"
          onClick={() => openForm()}
          className="inline-flex items-center justify-center space-x-2 bg-[#3D1E1A] text-white px-5 py-2.5 rounded-xl text-xs font-medium hover:bg-[#291411] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Service</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
          {error}
        </div>
      )}

      {/* Services Grid */}
      {loading ? (
        <div className="p-12 flex justify-center items-center text-[#78716C] text-xs">
          <div className="w-4 h-4 border-2 border-[#C88A95] border-t-transparent rounded-full animate-spin mr-2"></div>
          Loading services...
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {services.map((service) => {
            const displayImg = serviceImages[service.name] || service.image;
            const isInactive = service.isActive === false;

            return (
              <div
                key={service._id}
                className={`bg-white border border-[#E8DFD8] rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between transition-opacity ${
                  isInactive ? "opacity-60" : "opacity-100"
                }`}
              >
                <div>
                  {displayImg && (
                    <div className="relative aspect-[4/3] bg-[#FAF7F3]">
                      <img
                        src={displayImg}
                        alt={service.name}
                        className="w-full h-full object-cover"
                      />
                      {isInactive && (
                        <span className="absolute top-3 right-3 bg-[#292524]/80 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm">
                          Inactive
                        </span>
                      )}
                    </div>
                  )}

                  <div className="p-6">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#C88A95] mb-1">
                      {service.category}
                    </p>

                    <h2 className="font-serif text-xl font-semibold text-[#3D1E1A]">
                      {service.name}
                    </h2>

                    <p className="text-xs text-[#78716C] mt-2 line-clamp-2 leading-relaxed">
                      {service.description}
                    </p>

                    <div className="flex justify-between items-center mt-6 pt-4 border-t border-[#E8DFD8] text-xs">
                      <span className="font-semibold text-[#292524] text-sm">
                        &#8358;{(service.price || 0).toLocaleString()}
                      </span>
                      <span className="text-[#78716C] font-medium">
                        {service.duration} mins
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-6 pt-0 flex gap-3">
                  <button
                    type="button"
                    onClick={() => openForm(service)}
                    className="flex-1 inline-flex items-center justify-center space-x-1.5 border border-[#E8DFD8] bg-[#FAF7F3] hover:bg-[#E8DFD8]/50 py-2 rounded-xl text-xs font-semibold text-[#292524] transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleStatus(service)}
                    className={`flex-1 inline-flex items-center justify-center space-x-1.5 border py-2 rounded-xl text-xs font-semibold transition-colors ${
                      isInactive
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        : "border-[#FCE8E8] bg-[#FCE8E8] text-[#C88A95] hover:bg-rose-100"
                    }`}
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span>{isInactive ? "Activate" : "Deactivate"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#292524]/40 backdrop-blur-sm p-4">
          <form
            onSubmit={handleSubmit}
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto bg-white border border-[#E8DFD8] rounded-2xl p-6 text-[#292524] shadow-xl space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DFD8]">
              <h2 className="font-serif text-xl font-semibold text-[#3D1E1A]">
                {editingId ? "Edit Service" : "Add New Service"}
              </h2>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="p-1 rounded-lg hover:bg-[#FAF7F3] text-[#78716C]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 text-xs">
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#78716C] mb-1">
                  Service Name
                </label>
                <input
                  required
                  placeholder="e.g. Classic Full Set"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-[#FAF7F3] border border-[#E8DFD8] rounded-xl p-3 outline-none focus:border-[#C88A95]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#78716C] mb-1">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full bg-[#FAF7F3] border border-[#E8DFD8] rounded-xl p-3 outline-none focus:border-[#C88A95]"
                >
                  <option>Lashes</option>
                  <option>Nails</option>
                  <option>Brows</option>
                  <option>Waxing</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#78716C] mb-1">
                  Price (&#8358;)
                </label>
                <input
                  required
                  type="number"
                  min="0"
                  placeholder="25000"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full bg-[#FAF7F3] border border-[#E8DFD8] rounded-xl p-3 outline-none focus:border-[#C88A95]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#78716C] mb-1">
                  Duration (Minutes)
                </label>
                <input
                  required
                  type="number"
                  min="15"
                  placeholder="90"
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                  className="w-full bg-[#FAF7F3] border border-[#E8DFD8] rounded-xl p-3 outline-none focus:border-[#C88A95]"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#78716C] mb-1">
                Description
              </label>
              <textarea
                required
                placeholder="Describe what is included in this service..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full bg-[#FAF7F3] border border-[#E8DFD8] rounded-xl p-3 min-h-[100px] outline-none focus:border-[#C88A95]"
              />
            </div>

            <div className="text-xs">
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#78716C] mb-1">
                Image URL (Optional)
              </label>
              <input
                placeholder="https://..."
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                className="w-full bg-[#FAF7F3] border border-[#E8DFD8] rounded-xl p-3 outline-none focus:border-[#C88A95]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#3D1E1A] text-white py-3 rounded-xl text-xs font-semibold hover:bg-[#291411] transition-colors mt-2"
            >
              Save Service
            </button>
          </form>
        </div>
      )}
    </div>
  );
}