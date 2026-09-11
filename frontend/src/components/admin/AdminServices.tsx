import { useEffect, useState } from "react";
import {
  fetchAdminServices,
  createService,
  updateService,
  toggleServiceStatus,
  ServiceItem,
} from "../../services/serviceApi";

const CATEGORIES = ["Lashes", "Nails", "Brows", "Waxing"] as const;

export default function AdminServices() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  const [formData, setFormData] = useState<Omit<ServiceItem, "_id">>({
    name: "",
    category: "Lashes",
    description: "",
    price: 0,
    duration: 30,
    image: "",
    isActive: true,
  });

  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await fetchAdminServices();
      setServices(data);
    } catch (err) {
      console.error("Failed to load services:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleOpenModal = (service?: ServiceItem) => {
    if (service) {
      setEditingService(service);
      setFormData({
        name: service.name,
        category: service.category,
        description: service.description,
        price: service.price,
        duration: service.duration,
        image: service.image,
        isActive: service.isActive ?? true,
      });
    } else {
      setEditingService(null);
      setFormData({
        name: "",
        category: "Lashes",
        description: "",
        price: 0,
        duration: 30,
        image: "",
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleToggle = async (item: ServiceItem) => {
    if (!item._id) return;
    try {
      await toggleServiceStatus(item._id, !!item.isActive);
      loadServices();
    } catch (err) {
      console.error("Failed to toggle service status:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingService?._id) {
        await updateService(editingService._id, formData);
      } else {
        await createService(formData);
      }
      setIsModalOpen(false);
      loadServices();
    } catch (err) {
      console.error("Failed to save service:", err);
    }
  };

  return (
    <div className="p-6 text-[#FDFBF7] max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h1 className="font-serif text-2xl tracking-wide">Service Catalog</h1>
          <p className="text-xs text-[#D4C3B5] mt-1">
            Manage pricing, durations, and active service offerings
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded text-xs uppercase tracking-widest transition-all"
        >
          + Add Service
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-[#D4C3B5]">Loading services...</p>
      ) : (
        <div className="overflow-x-auto border border-white/10 rounded-lg bg-white/5">
          <table className="w-full text-left text-sm text-[#FDFBF7]">
            <thead className="border-b border-white/10 text-xs uppercase tracking-wider text-[#D4C3B5] bg-white/5">
              <tr>
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {services.map((item) => (
                <tr key={item._id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 font-medium">{item.name}</td>
                  <td className="py-3 px-4 text-[#D4C3B5]">{item.category}</td>
                  <td className="py-3 px-4">₦{item.price.toLocaleString()}</td>
                  <td className="py-3 px-4 text-[#D4C3B5]">{item.duration} mins</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleToggle(item)}
                      className={`text-[10px] uppercase px-2 py-0.5 rounded border ${
                        item.isActive
                          ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                          : "bg-rose-500/10 text-rose-300 border-rose-500/20"
                      }`}
                    >
                      {item.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right space-x-3 text-xs">
                    <button
                      onClick={() => handleOpenModal(item)}
                      className="text-[#D4C3B5] hover:text-white underline"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#1A1817] border border-white/10 rounded-xl max-w-lg w-full p-6 space-y-4">
            <h2 className="font-serif text-xl tracking-wide">
              {editingService ? "Edit Service" : "Add New Service"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase tracking-wider mb-1 text-[#D4C3B5]">
                  Service Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded p-2 text-sm focus:outline-none focus:border-white/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider mb-1 text-[#D4C3B5]">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as ServiceItem["category"],
                      })
                    }
                    className="w-full bg-[#1A1817] border border-white/10 rounded p-2 text-sm focus:outline-none focus:border-white/30 text-[#FDFBF7]"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block uppercase tracking-wider mb-1 text-[#D4C3B5]">
                    Price (₦)
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: Number(e.target.value) })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded p-2 text-sm focus:outline-none focus:border-white/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider mb-1 text-[#D4C3B5]">
                    Duration (Mins)
                  </label>
                  <input
                    type="number"
                    required
                    min={15}
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: Number(e.target.value) })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded p-2 text-sm focus:outline-none focus:border-white/30"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider mb-1 text-[#D4C3B5]">
                    Image URL
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded p-2 text-sm focus:outline-none focus:border-white/30"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider mb-1 text-[#D4C3B5]">
                  Description
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded p-2 text-sm focus:outline-none focus:border-white/30"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-white/10 rounded hover:bg-white/5 uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded uppercase tracking-wider"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}