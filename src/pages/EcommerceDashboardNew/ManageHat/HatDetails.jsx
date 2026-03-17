import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../components/Loader";
import { toast } from "react-toastify";
import { FileInput } from "flowbite-react";
import {
  FaArrowLeft, FaImage, FaTag, FaPalette, FaRuler,
  FaBarcode, FaPlus, FaEdit, FaEye, FaTrash, FaCheck,
  FaTimes, FaCamera, FaChevronDown, FaChevronUp,
  FaBoxOpen, FaLayerGroup, FaSearch, FaHatCowboy,
  FaStar, FaCubes, FaKey, FaFileAlt, FaHashtag,
} from "react-icons/fa";

import AddVariantModal from "./AddVariantModal";
import DeleteConfirmModal from "../DeleteConfirmModal";
import {
  brandList, hatColorSingle, hatColorUpdate, hatColorDelete,
  hatImageAdd, hatImageGet, hatImageUpdate, hatSingle, hatSizeSingle,
  variantWiseUpdateStatus,
} from "../../../Reducer/EcommerceNewSlice";
import AddVariantSizeModal from "./AddVariantSizeModal";
import AddVariantSizeInventoryModal from "./AddVariantSizeInventoryModal";
import { inventoryList } from "../../../Reducer/AddInvetoryNewSlice";
import ViewInventoryModal from "./ViewInventoryModal";

const BASE_IMG = import.meta.env.VITE_API_BASE_URL || "https://adminapi.showmecustomapparel.com";

const resolveImg = (url) => {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  const clean = url.startsWith("/") ? url : `/${url}`;
  return `${BASE_IMG}${clean}`;
};

/* ─── Status Badge ───────────────────────────────── */
const StatusBadge = ({ active, size = "md" }) => (
  <span className={`inline-flex items-center gap-1.5 font-bold rounded-full border
    ${active
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : "bg-gray-100 text-gray-500 border-gray-200"}
    ${size === "lg" ? "px-4 py-1.5 text-sm" : "px-2.5 py-0.5 text-[11px]"}`}>
    <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-emerald-500" : "bg-gray-400"}`} />
    {active ? "Active" : "Inactive"}
  </span>
);

/* ─── Image Box ──────────────────────────────────── */
const ImageBox = ({ src, alt, className = "" }) => {
  const [err, setErr] = useState(false);
  if (!src || err) {
    return (
      <div className={`flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-50 border-2 border-dashed border-gray-200 rounded-xl ${className}`}>
        <FaImage className="text-gray-300 mb-2" size={28} />
        <span className="text-xs font-semibold text-gray-400">No Image</span>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className={`object-cover rounded-xl ${className}`}
      onError={() => setErr(true)}
    />
  );
};

/* ─── Edit Color Modal ───────────────────────────── */
const EditColorModal = ({ color, hatId, onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState(color?.name || "");
  const [colorCode, setColorCode] = useState(color?.color_code || "");
  const [isActive, setIsActive] = useState(color?.is_active === 1 || color?.is_active === true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(
    resolveImg(color?.primary_image_url) || resolveImg(color?.colorImages?.[0]?.image_url) || null
  );
  const [saving, setSaving] = useState(false);

  const handleImg = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!name.trim()) { toast.error("Name is required"); return; }
    setSaving(true);
    const fd = new FormData();
    fd.append("name", name);
    fd.append("colorCode", colorCode);
    fd.append("isActive", isActive ? 1 : 0);
    if (selectedImage) fd.append("imageFile", selectedImage);
    dispatch(hatColorUpdate({ hatStyleId: hatId, colorId: color.id, formData: fd }))
      .unwrap()
      .then(() => { toast.success("Color updated!"); dispatch(hatColorSingle(hatId)); onSuccess(); })
      .catch(err => toast.error(err?.message || "Update failed."))
      .finally(() => setSaving(false));
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-5 flex items-center justify-between">
          <div>
            <h3 className="text-white font-extrabold text-lg">Edit Color</h3>
            <p className="text-gray-400 text-xs mt-0.5">"{color?.name}"</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
            <FaTimes size={12} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Color Image</label>
            <label className="relative flex items-center justify-center w-full h-44 rounded-2xl border-2 border-dashed border-gray-200 hover:border-[#f20c32] cursor-pointer overflow-hidden transition-all group bg-gray-50">
              {preview ? (
                <>
                  <img src={preview} alt="preview" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                    <FaCamera className="text-white text-3xl" />
                    <span className="text-white text-xs font-bold">Change Photo</span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-2 text-gray-400 group-hover:text-[#f20c32] transition-colors">
                  <FaCamera size={28} />
                  <span className="text-sm font-semibold">Upload Image</span>
                  <span className="text-xs">JPEG, JPG, PNG · Max 5MB</span>
                </div>
              )}
              <input type="file" accept="image/jpeg,image/jpg,image/png" onChange={handleImg} className="hidden" />
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Color Name *</label>
            <input
              value={name} onChange={e => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-[#f20c32] focus:ring-4 focus:ring-red-50 text-sm font-semibold outline-none transition-all"
              placeholder="e.g. Navy Blue"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Color Code</label>
            <div className="flex gap-3">
              <input type="color" value={colorCode?.startsWith("#") ? colorCode : "#000000"} onChange={e => setColorCode(e.target.value)} className="w-12 h-12 rounded-xl border-2 border-gray-100 cursor-pointer p-1 bg-gray-50" />
              <input
                value={colorCode} onChange={e => setColorCode(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-[#f20c32] focus:ring-4 focus:ring-red-50 font-mono text-sm outline-none transition-all"
                placeholder="#000000 or color name"
              />
            </div>
          </div>

          <label className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl cursor-pointer select-none border-2 border-transparent hover:border-gray-200 transition-colors">
            <span className="text-sm font-bold text-gray-700">Mark as Active</span>
            <div className="relative">
              <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="sr-only peer" />
              <div className="w-12 h-6 bg-gray-300 peer-checked:bg-[#f20c32] rounded-full transition-colors duration-300 shadow-inner" />
              <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300 peer-checked:translate-x-6" />
            </div>
          </label>

          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="flex-1 py-3 rounded-xl bg-[#f20c32] hover:bg-black text-white text-sm font-extrabold transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2">
              {saving ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</> : <><FaCheck size={12} />Save Changes</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Delete Color Modal ─────────────────────────── */
const DeleteColorModal = ({ color, hatId, onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const [deleting, setDeleting] = useState(false);
  const handleDelete = () => {
    setDeleting(true);
    dispatch(hatColorDelete({ hatStyleId: hatId, colorId: color.id }))
      .unwrap()
      .then(() => { toast.success(`"${color.name}" deleted!`); dispatch(hatColorSingle(hatId)); onSuccess(); })
      .catch(err => toast.error(err?.message || "Delete failed."))
      .finally(() => setDeleting(false));
  };
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center">
        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4 border-4 border-red-100">
          <FaTrash className="text-red-500 text-2xl" />
        </div>
        <h3 className="font-extrabold text-gray-900 text-xl mb-1">Delete Color?</h3>
        <p className="text-gray-500 text-sm mb-2">You are about to delete</p>
        <p className="font-extrabold text-gray-900 text-base mb-4">"{color?.name}"</p>
        <p className="text-xs text-red-400 bg-red-50 rounded-xl px-4 py-2 mb-6">This action cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
          <button onClick={handleDelete} disabled={deleting} className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-extrabold transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {deleting ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Deleting...</> : <><FaTrash size={11} />Yes, Delete</>}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Color Variant Card ─────────────────────────── */
const ColorVariantCard = ({
  variant, index, sizes, inventoryMap,
  onAddSize, onEditColor, onDeleteColor,
  onAddInventory, onViewInventory,
  onEditInventory, onDeleteInventory,
  onToggleSizeStatus,
}) => {
  const [expanded, setExpanded] = useState(false);

  const imgSrc = resolveImg(variant.primary_image_url) || resolveImg(variant.colorImages?.[0]?.image_url);
  const allImages = variant.colorImages?.map(ci => resolveImg(ci.image_url)).filter(Boolean) || [];

  const colorSwatchBg = variant.color_code?.startsWith("#") ? variant.color_code : null;
  const namedColors = ["navy","red","white","black","gray","grey","blue","green","yellow","orange","purple","pink","brown","maroon","teal","olive","beige","cream","charcoal","burgundy"];
  const isNamedColor = namedColors.some(c => variant.color_code?.toLowerCase().includes(c));

  return (
    <div className={`rounded-2xl border-2 overflow-hidden transition-all duration-300 ${expanded ? "border-gray-200 shadow-lg" : "border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200"}`}>
      {/* ── Card Header ── */}
      <div className="flex items-center gap-4 px-5 py-4 bg-white">
        <div className="relative flex-shrink-0">
          <ImageBox src={imgSrc} alt={variant.name} className="w-16 h-16 border border-gray-100" />
          {(allImages.length > 1) && (
            <span className="absolute -bottom-1 -right-1 bg-gray-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
              +{allImages.length}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.15em]">#{String(index + 1).padStart(2, "0")}</span>
            <h3 className="text-base font-extrabold text-gray-900">{variant.name || "Unnamed"}</h3>
            <StatusBadge active={variant.is_active} />
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5">
              {colorSwatchBg || isNamedColor ? (
                <div className="w-4 h-4 rounded-full border border-gray-200 shadow-sm flex-shrink-0" style={{ backgroundColor: colorSwatchBg || variant.color_code }} />
              ) : (
                <FaPalette size={11} className="text-gray-400" />
              )}
              <span className="text-xs font-mono text-gray-500">{variant.color_code || "—"}</span>
            </div>
            <span className="text-gray-200 text-xs">·</span>
            <span className="text-xs text-gray-400 font-medium">
              {sizes?.length || 0} {(sizes?.length || 0) === 1 ? "size" : "sizes"}
            </span>
            {allImages.length > 0 && (
              <>
                <span className="text-gray-200 text-xs">·</span>
                <span className="text-xs text-gray-400 font-medium">{allImages.length} photo{allImages.length !== 1 ? "s" : ""}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={() => onEditColor(variant)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold transition-colors" title="Edit">
            <FaEdit size={11} /> Edit
          </button>
          <button onClick={() => onDeleteColor(variant)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 text-xs font-bold transition-colors" title="Delete">
            <FaTrash size={11} /> Delete
          </button>
          <button
            onClick={() => setExpanded(p => !p)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200
              ${expanded ? "bg-gray-900 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-600"}`}
          >
            <FaRuler size={11} />
            Sizes
            {expanded ? <FaChevronUp size={9} /> : <FaChevronDown size={9} />}
          </button>
        </div>
      </div>

      {/* Extra images strip */}
      {expanded && allImages.length > 1 && (
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">All Photos</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {allImages.map((img, i) => (
              <img key={i} src={img} alt={`${variant.name} ${i + 1}`} className="w-16 h-16 rounded-xl object-cover flex-shrink-0 border-2 border-white shadow-sm" onError={e => e.target.style.display = "none"} />
            ))}
          </div>
        </div>
      )}

      {/* ── Sizes section ── */}
      {expanded && (
        <div className="border-t border-gray-100 bg-gray-50/80">
          <div className="flex items-center justify-between px-5 py-3.5">
            <span className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
              <FaRuler size={10} /> Size Variants
              <span className="bg-gray-200 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full">{sizes?.length || 0}</span>
            </span>
            <button
              onClick={() => onAddSize(variant.id)}
              className="flex items-center gap-2 px-4 py-2 bg-[#f20c32] hover:bg-black text-white text-xs font-extrabold rounded-xl transition-all duration-200 shadow-sm"
            >
              <FaPlus size={9} /> Add Size
            </button>
          </div>

          {(sizes || []).length > 0 ? (
            <div className="px-4 pb-4">
              <div className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                      {["Size Label", "Variant Name", "Supplier SKU", "Inventory"].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-[10px] font-black text-gray-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {sizes.map((size) => {
                      const invList = inventoryMap[String(size.id)] || [];
                      const hasInv = invList.length > 0;
                      const isSizeActive = size?.is_active === 1 || size?.is_active === true;

                      return (
                        <tr key={size.id} className="hover:bg-blue-50/30 transition-colors">
                          {/* Size Label */}
                          <td className="px-4 py-3.5">
                            <span className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-lg">
                              <FaRuler size={9} className="text-gray-400" />
                              <span className="text-sm font-extrabold text-gray-800">{size.size_label || "N/A"}</span>
                            </span>
                          </td>

                          {/* Variant Name */}
                          <td className="px-4 py-3.5 text-sm text-gray-600 font-medium">{size.variant_name || "—"}</td>

                          {/* Supplier SKU */}
                          <td className="px-4 py-3.5">
                            {size.supplier_sku ? (
                              <span className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-lg">
                                <FaBarcode size={10} className="text-gray-400" />
                                <span className="font-mono text-xs text-gray-600">{size.supplier_sku}</span>
                              </span>
                            ) : <span className="text-gray-300 text-sm">—</span>}
                          </td>

                          {/* Inventory */}
                          <td className="px-4 py-3.5">
                            {hasInv ? (
                              <div className="flex items-center gap-1.5">
                                <button onClick={() => onViewInventory(size.id)} className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-[10px] font-bold rounded-lg transition-colors shadow-sm">
                                  <FaEye size={9} /> View
                                </button>
                                <button onClick={() => onEditInventory(size.id, invList[0])} className="flex items-center gap-1 px-2.5 py-1.5 bg-amber-400 hover:bg-amber-500 text-white text-[10px] font-bold rounded-lg transition-colors shadow-sm">
                                  <FaEdit size={9} /> Edit
                                </button>
                                {/* Toggle Active/Inactive — replaces delete */}
                                <button
                                  onClick={() => onToggleSizeStatus(size)}
                                  className={`flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-bold rounded-lg transition-colors shadow-sm
                                    ${isSizeActive
                                      ? "bg-emerald-500 hover:bg-gray-400 text-white"
                                      : "bg-gray-300 hover:bg-emerald-500 text-white"
                                    }`}
                                  title={isSizeActive ? "Click to Deactivate" : "Click to Activate"}
                                >
                                  {isSizeActive
                                    ? <><FaCheck size={9} /> Active</>
                                    : <><FaTimes size={9} /> Inactive</>
                                  }
                                </button>
                              </div>
                            ) : (
                              <button onClick={() => onAddInventory(size.id)} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f20c32] hover:bg-black text-white text-[10px] font-extrabold rounded-lg transition-all duration-200 shadow-sm">
                                <FaPlus size={9} /> Add Stock
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="mx-4 mb-4 py-8 flex flex-col items-center justify-center bg-white rounded-xl border-2 border-dashed border-gray-200 text-center">
              <FaRuler className="text-gray-200 text-3xl mb-2" />
              <p className="text-sm font-bold text-gray-400">No sizes added yet</p>
              <p className="text-xs text-gray-300 mt-0.5">Click "Add Size" to create size variants</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ─── MAIN PAGE ──────────────────────────────────── */
export const HatDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { hatSingleData, brandListData, hatColorSingleData, hatImageGetData, loading } =
    useSelector((state) => state.newecom);
  const { inventoryListData } = useSelector((state) => state.invent);

  const [hatData, setHatData] = useState(null);
  const [brandName, setBrandName] = useState("");
  const [isEditingImage, setIsEditingImage] = useState(false);

  const [openAddVariantModal, setOpenAddVariantModal] = useState(false);
  const [editingColor, setEditingColor] = useState(null);
  const [deletingColor, setDeletingColor] = useState(null);

  const [openAddSizeModal, setOpenAddSizeModal] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState(null);

  const [openViewInventoryModal, setOpenViewInventoryModal] = useState(false);
  const [openAddInventoryModal, setOpenAddInventoryModal] = useState(false);
  const [openEditInventoryModal, setOpenEditInventoryModal] = useState(false);
  const [openDeleteInventoryModal, setOpenDeleteInventoryModal] = useState(false);
  const [selectedVariantSizeId, setSelectedVariantSizeId] = useState(null);
  const [selectedInventoryData, setSelectedInventoryData] = useState(null);

  const [sizesByColor, setSizesByColor] = useState({});
  const [colorSearch, setColorSearch] = useState("");
  const [selectedColorFilter, setSelectedColorFilter] = useState("");

  const fetchHatDetails = useCallback(() => {
    if (!id) return;
    dispatch(hatSingle(id)).unwrap().then(r => { if (r?.data) setHatData(r.data[0]); }).catch(() => toast.error("Failed to fetch hat details."));
  }, [id, dispatch]);

  const fetchHatColor = useCallback(() => {
    if (!id) return;
    dispatch(hatColorSingle(id)).unwrap().catch(() => {});
  }, [id, dispatch]);

  const fetchHatImage = useCallback(() => {
    if (!id) return;
    dispatch(hatImageGet(id)).unwrap().then(() => setIsEditingImage(false)).catch(() => {});
  }, [id, dispatch]);

  const fetchInventory = useCallback(() => {
    dispatch(inventoryList({ page: 1, limit: 1000 })).unwrap?.().catch(() => {});
  }, [dispatch]);

  const fetchHatSizes = useCallback(async (hatColorId) => {
    if (!hatColorId) return;
    try {
      const response = await dispatch(hatSizeSingle(hatColorId)).unwrap();
      setSizesByColor(prev => ({ ...prev, [hatColorId]: Array.isArray(response?.data) ? response.data : [] }));
    } catch {}
  }, [dispatch]);

  useEffect(() => { fetchHatDetails(); fetchHatColor(); fetchHatImage(); fetchInventory(); }, [fetchHatDetails, fetchHatColor, fetchHatImage, fetchInventory]);
  useEffect(() => { dispatch(brandList()).unwrap().catch(() => {}); }, [dispatch]);
  useEffect(() => {
    if (hatData?.brand_id) {
      const found = brandListData?.data?.find(b => b.id === hatData.brand_id);
      if (found?.name) setBrandName(found.name);
    }
  }, [hatData, brandListData]);
  useEffect(() => {
    const colors = hatColorSingleData?.data || [];
    colors.forEach(c => { if (c?.id && !sizesByColor[c.id]) fetchHatSizes(c.id); });
  }, [hatColorSingleData, fetchHatSizes, sizesByColor]);

  const inventoryByVariantId = useMemo(() => {
    const list = inventoryListData?.data;
    if (!Array.isArray(list)) return {};
    return list.reduce((acc, inv) => {
      const key = String(inv?.hat_size_variant_id);
      if (!key) return acc;
      acc[key] = acc[key] || [];
      acc[key].push(inv);
      return acc;
    }, {});
  }, [inventoryListData]);

  // ── Toggle Size Active/Inactive ──
  const handleToggleSizeStatus = useCallback((size) => {
    const colorId = Object.entries(sizesByColor).find(([, arr]) =>
      arr.some((s) => s.id === size.id)
    )?.[0];

    const newStatus = size?.is_active === 1 || size?.is_active === true ? 0 : 1;

    dispatch(variantWiseUpdateStatus({
      colorId: size.id,
      userInput: { isActive: newStatus },
    }))
      .unwrap()
      .then(() => {
        toast.success(newStatus === 1 ? "Size activated!" : "Size deactivated!");
        if (colorId) fetchHatSizes(colorId);
      })
      .catch((err) => toast.error(err?.message || "Status update failed."));
  }, [dispatch, sizesByColor, fetchHatSizes]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const hasImage = hatImageGetData?.data?.length > 0;
    try {
      if (hasImage) {
        const fd = new FormData();
        fd.append("hat_style_id", id);
        fd.append("image", file);
        const res = await dispatch(hatImageUpdate(fd)).unwrap();
        toast.success(res?.message || "Image updated!");
      } else {
        const fd = new FormData();
        fd.append("image", file); fd.append("hat_style_id", id);
        fd.append("image_type", "jpg"); fd.append("alt_text", "Cap Image");
        fd.append("is_primary", 1); fd.append("hat_color_id", 0);
        const res = await dispatch(hatImageAdd(fd)).unwrap();
        toast.success(res?.message || "Image uploaded!");
      }
      setIsEditingImage(false); fetchHatImage();
    } catch { toast.error("Failed to upload image"); }
  };

  const colorList = hatColorSingleData?.data || [];
  const filteredColorList = useMemo(() => {
    if (!selectedColorFilter && !colorSearch.trim()) return colorList;
    return colorList.filter(c => {
      const matchSearch = colorSearch.trim()
        ? c.name?.toLowerCase().includes(colorSearch.toLowerCase()) ||
          c.color_code?.toLowerCase().includes(colorSearch.toLowerCase())
        : true;
      const matchFilter = selectedColorFilter ? c.id === selectedColorFilter : true;
      return matchSearch && matchFilter;
    });
  }, [colorList, colorSearch, selectedColorFilter]);

  const latestImage = hatImageGetData?.data?.[hatImageGetData.data.length - 1]?.image_url;
  const totalSizes = Object.values(sizesByColor).reduce((a, s) => a + (s?.length || 0), 0);

  if (loading && !hatData) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader size="large" text="Loading Hat Details..." />
    </div>
  );

  if (!hatData) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center bg-white rounded-3xl p-12 shadow-xl">
        <FaBoxOpen className="text-gray-200 text-6xl mx-auto mb-4" />
        <p className="text-gray-500 text-xl font-bold mb-6">Hat not found</p>
        <button onClick={() => navigate("/hat")} className="px-8 py-3 bg-[#f20c32] text-white rounded-2xl font-extrabold hover:bg-black transition-colors">Back to Hats</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* ── Top Bar ── */}
      <div className="flex items-center gap-4 mb-7">
        <button
          onClick={() => navigate("/hat")}
          className="w-11 h-11 rounded-2xl bg-white border-2 border-gray-200 shadow-sm hover:shadow-md flex items-center justify-center text-gray-600 hover:text-gray-900 hover:border-gray-300 transition-all"
        >
          <FaArrowLeft size={14} />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-black text-gray-900 truncate">{hatData?.name || "Hat Details"}</h1>
            <StatusBadge active={hatData?.is_active} size="lg" />
          </div>
          <p className="text-xs text-gray-400 font-mono mt-0.5 truncate">
            {hatData?.internal_style_code ? `Style: ${hatData.internal_style_code}` : `ID: ${hatData?.id}`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* ── LEFT ── */}
        <div className="xl:col-span-2 space-y-6">

          {/* Basic Info */}
          <div className="bg-white rounded-3xl border-2 border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
              <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center border border-orange-100">
                <FaTag className="text-orange-500" size={14} />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-gray-900">Basic Information</h2>
                <p className="text-xs text-gray-400">Hat details and specifications</p>
              </div>
            </div>
            <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: "Hat Name", value: hatData?.name, Icon: FaHatCowboy, color: "text-orange-400" },
                { label: "Style Code", value: hatData?.internal_style_code, mono: true, Icon: FaHashtag, color: "text-blue-400" },
                { label: "Brand", value: brandName, Icon: FaStar, color: "text-yellow-400" },
                { label: "Min Order Qty", value: hatData?.min_qty, Icon: FaCubes, color: "text-purple-400" },
                { label: "Hat ID", value: hatData?.id, mono: true, Icon: FaKey, color: "text-gray-400" },
                { label: "Description", value: hatData?.description, Icon: FaFileAlt, color: "text-teal-400" },
              ].map(({ label, value, mono, Icon, color }) => (
                <div key={label} className="group bg-gray-50 hover:bg-gray-100 rounded-2xl p-4 transition-colors border-2 border-transparent hover:border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className={color} size={13} />
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
                  </div>
                  <p className={`text-sm font-bold text-gray-800 break-words leading-snug ${mono ? "font-mono text-xs" : ""}`}>
                    {value || <span className="text-gray-300">Not set</span>}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Color Variants */}
          <div className="bg-white rounded-3xl border-2 border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-violet-50 flex items-center justify-center border border-violet-100">
                  <FaPalette className="text-violet-500" size={14} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-extrabold text-gray-900">Color Variants</h2>
                    <span className="text-xs font-extrabold bg-violet-100 text-violet-700 px-2.5 py-0.5 rounded-full">{colorList.length}</span>
                  </div>
                  <p className="text-xs text-gray-400">Manage hat color options</p>
                </div>
              </div>
              <button
                onClick={() => setOpenAddVariantModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#f20c32] hover:bg-black text-white text-sm font-extrabold rounded-2xl transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <FaPlus size={11} /> Add Color
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Search & Filter */}
              <div className="flex gap-3 flex-wrap">
                <div className="relative flex-1 min-w-48">
                  <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
                  <input
                    type="text"
                    value={colorSearch}
                    onChange={e => { setColorSearch(e.target.value); setSelectedColorFilter(""); }}
                    placeholder="Search colors..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-[#f20c32] focus:ring-2 focus:ring-red-50 text-sm font-medium outline-none transition-all"
                  />
                  {colorSearch && (
                    <button onClick={() => setColorSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <FaTimes size={11} />
                    </button>
                  )}
                </div>
                <select
                  value={selectedColorFilter}
                  onChange={e => { setSelectedColorFilter(e.target.value); setColorSearch(""); }}
                  className="px-4 py-2.5 rounded-xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-[#f20c32] text-sm font-semibold text-gray-700 outline-none transition-all cursor-pointer"
                >
                  <option value="">All Colors ({colorList.length})</option>
                  {colorList.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {(colorSearch || selectedColorFilter) && (
                  <button
                    onClick={() => { setColorSearch(""); setSelectedColorFilter(""); }}
                    className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold transition-colors"
                  >
                    <FaTimes size={10} /> Clear
                  </button>
                )}
              </div>

              {(colorSearch || selectedColorFilter) && (
                <p className="text-xs text-gray-400 font-semibold px-1">
                  Showing <span className="text-gray-700 font-extrabold">{filteredColorList.length}</span> of {colorList.length} colors
                </p>
              )}

              {filteredColorList.length > 0 ? filteredColorList.map((variant, i) => (
                <ColorVariantCard
                  key={variant.id}
                  variant={variant}
                  index={i}
                  sizes={sizesByColor[variant.id]}
                  inventoryMap={inventoryByVariantId}
                  onAddSize={vid => { setSelectedVariantId(vid); setOpenAddSizeModal(true); }}
                  onEditColor={c => setEditingColor(c)}
                  onDeleteColor={c => setDeletingColor(c)}
                  onAddInventory={sid => { setSelectedVariantSizeId(sid); setOpenAddInventoryModal(true); }}
                  onViewInventory={sid => { setSelectedVariantSizeId(sid); setOpenViewInventoryModal(true); }}
                  onEditInventory={(sid, inv) => { setSelectedVariantSizeId(sid); setSelectedInventoryData(inv); setOpenEditInventoryModal(true); }}
                  onDeleteInventory={(sid, inv) => { setSelectedVariantSizeId(sid); setSelectedInventoryData(inv); setOpenDeleteInventoryModal(true); }}
                  onToggleSizeStatus={handleToggleSizeStatus}
                />
              )) : colorList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-violet-50 to-purple-100 flex items-center justify-center mb-4 border-2 border-violet-100">
                    <FaPalette className="text-violet-300 text-4xl" />
                  </div>
                  <p className="text-base font-extrabold text-gray-500 mb-1">No Colors Yet</p>
                  <p className="text-sm text-gray-400 mb-5">Start by adding your first color variant</p>
                  <button
                    onClick={() => setOpenAddVariantModal(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-[#f20c32] text-white font-extrabold rounded-2xl hover:bg-black transition-all shadow-md"
                  >
                    <FaPlus size={11} /> Add First Color
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
                    <FaSearch className="text-gray-300 text-2xl" />
                  </div>
                  <p className="text-sm font-extrabold text-gray-400">No colors match your search</p>
                  <button onClick={() => { setColorSearch(""); setSelectedColorFilter(""); }} className="mt-3 text-xs text-[#f20c32] font-bold underline">Clear filter</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── RIGHT: Sidebar ── */}
        <div className="xl:col-span-1 space-y-5">
          {/* Hat Image Card */}
          <div className="bg-white rounded-3xl border-2 border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center border border-amber-100">
                <FaImage className="text-amber-500" size={14} />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-gray-900">Hat Image</h2>
                <p className="text-xs text-gray-400">Primary product photo</p>
              </div>
            </div>

            <div className="p-4">
              {latestImage ? (
                <div className="relative group rounded-2xl overflow-hidden mb-3">
                  <img
                    src={latestImage}
                    alt={hatData?.name}
                    className="w-full h-64 object-cover"
                    onError={e => e.target.style.display = "none"}
                  />
                  {!isEditingImage && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-5">
                      <button
                        onClick={() => setIsEditingImage(true)}
                        className="flex items-center gap-2 bg-white text-gray-900 rounded-2xl px-5 py-2.5 text-sm font-extrabold shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-transform"
                      >
                        <FaCamera size={12} /> Change Photo
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-64 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center mb-3 bg-gradient-to-br from-gray-50 to-gray-100 group hover:border-[#f20c32] transition-colors">
                  <FaImage className="text-gray-200 text-5xl mb-3" />
                  <p className="text-sm font-bold text-gray-400">No image uploaded</p>
                  <p className="text-xs text-gray-300 mt-1">Upload a product photo below</p>
                </div>
              )}

              {(!latestImage || isEditingImage) && (
                <div className="space-y-2">
                  <FileInput accept="image/*" onChange={handleImageUpload} className="text-sm" />
                  {isEditingImage && (
                    <button onClick={() => setIsEditingImage(false)} className="w-full text-xs text-gray-400 hover:text-gray-600 underline py-1 transition-colors">
                      Cancel
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-white rounded-3xl border-2 border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-extrabold text-gray-900">Quick Stats</h2>
            </div>
            <div className="p-4 grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-violet-50 to-purple-100 rounded-2xl p-4 text-center border border-violet-100">
                <FaPalette className="text-violet-400 mx-auto mb-2" size={20} />
                <p className="text-3xl font-black text-violet-700">{colorList.length}</p>
                <p className="text-[10px] font-black text-violet-400 uppercase tracking-wider mt-0.5">Colors</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-sky-100 rounded-2xl p-4 text-center border border-blue-100">
                <FaRuler className="text-blue-400 mx-auto mb-2" size={20} />
                <p className="text-3xl font-black text-blue-700">{totalSizes}</p>
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-wider mt-0.5">Sizes</p>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-2xl p-4 text-center border border-emerald-100 col-span-2">
                <FaLayerGroup className="text-emerald-400 mx-auto mb-2" size={20} />
                <p className="text-3xl font-black text-emerald-700">
                  {colorList.filter(c => c.is_active).length}
                </p>
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-wider mt-0.5">Active Colors</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      {openAddVariantModal && (
        <AddVariantModal
          openModal={openAddVariantModal}
          setOpenModal={setOpenAddVariantModal}
          onVariantAdded={() => { fetchHatColor(); fetchHatDetails(); }}
          hatColorListData={hatColorSingleData}
          hatId={id}
        />
      )}

      {editingColor && (
        <EditColorModal
          color={editingColor}
          hatId={id}
          onClose={() => setEditingColor(null)}
          onSuccess={() => { setEditingColor(null); fetchHatColor(); }}
        />
      )}

      {deletingColor && (
        <DeleteColorModal
          color={deletingColor}
          hatId={id}
          onClose={() => setDeletingColor(null)}
          onSuccess={() => { setDeletingColor(null); fetchHatColor(); }}
        />
      )}

      {openAddSizeModal && selectedVariantId && (
        <AddVariantSizeModal
          openModal={openAddSizeModal}
          setOpenModal={setOpenAddSizeModal}
          onSizeAdded={() => { fetchHatSizes(selectedVariantId); fetchHatColor(); }}
          colorId={selectedVariantId}
          isEdit={false}
        />
      )}

      {openViewInventoryModal && selectedVariantSizeId && (
        <ViewInventoryModal
          openModal={openViewInventoryModal}
          setOpenModal={setOpenViewInventoryModal}
          variantSizeId={selectedVariantSizeId}
          onRefreshInventory={fetchInventory}
        />
      )}

      {openAddInventoryModal && selectedVariantSizeId && (
        <AddVariantSizeInventoryModal
          openModal={openAddInventoryModal}
          setOpenModal={setOpenAddInventoryModal}
          onInventoryAdded={() => { fetchInventory(); fetchHatDetails(); }}
          inventoryData={null}
          isEdit={false}
          variantSizeId={selectedVariantSizeId}
        />
      )}

      {openEditInventoryModal && selectedInventoryData && (
        <AddVariantSizeInventoryModal
          openModal={openEditInventoryModal}
          setOpenModal={setOpenEditInventoryModal}
          onInventoryAdded={() => { fetchInventory(); fetchHatDetails(); }}
          inventoryData={selectedInventoryData}
          isEdit={true}
          variantSizeId={selectedVariantSizeId}
        />
      )}

      {openDeleteInventoryModal && selectedInventoryData && (
        <DeleteConfirmModal
          openModal={openDeleteInventoryModal}
          setOpenModal={setOpenDeleteInventoryModal}
          onConfirm={() => {
            toast.error("Hook your inventoryDelete dispatch here.");
            setOpenDeleteInventoryModal(false);
          }}
          brandName="this inventory"
          itemType="inventory"
        />
      )}
    </div>
  );
};
// import { useEffect, useState, useCallback, useMemo } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { AgGridReact } from "ag-grid-react";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";

// import Loader from "../../../components/Loader";
// import { toast } from "react-toastify";
// import { Button, FileInput, Tabs } from "flowbite-react";
// import {
//   FaArrowLeft,
//   FaImage,
//   FaTag,
//   FaPalette,
//   FaRuler,
//   FaBarcode,
//   FaPlus,
//   FaEdit,
//   FaEye,
//   FaTrash,
// } from "react-icons/fa";

// import AddVariantModal from "./AddVariantModal";
// import DeleteConfirmModal from "../DeleteConfirmModal";
// import {
//   brandList,
//   hatColorSingle,
//   hatImageAdd,
//   hatImageGet,
//   hatImageUpdate,
//   hatSingle,
//   hatSizeSingle,
// } from "../../../Reducer/EcommerceNewSlice";

// import AddVariantSizeModal from "./AddVariantSizeModal";
// import AddVariantSizeInventoryModal from "./AddVariantSizeInventoryModal";
// import { inventoryList } from "../../../Reducer/AddInvetoryNewSlice";

// // ✅ NEW: modal for viewing inventory list
// import ViewInventoryModal from "./ViewInventoryModal";

// export const HatDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const { hatSingleData, brandListData, hatColorSingleData, hatImageGetData, loading } =
//     useSelector((state) => state.newecom);

//   const { inventoryListData } = useSelector((state) => state.invent);
//   const [isEditingImage, setIsEditingImage] = useState(false);

//   const [hatData, setHatData] = useState(null);
//   const [brandName, setBrandName] = useState("");

//   const [openAddVariantModal, setOpenAddVariantModal] = useState(false);
//   const [openEditVariantModal, setOpenEditVariantModal] = useState(false);

//   const [openAddSizeModal, setOpenAddSizeModal] = useState(false);
//   const [selectedVariantId, setSelectedVariantId] = useState(null);
//   const [selectedVariantData, setSelectedVariantData] = useState(null);

//   const [activeTab, setActiveTab] = useState(0);

//   // inventory modals
//   const [openViewInventoryModal, setOpenViewInventoryModal] = useState(false);
//   const [openAddInventoryModal, setOpenAddInventoryModal] = useState(false);
//   const [openEditInventoryModal, setOpenEditInventoryModal] = useState(false);
//   const [openDeleteInventoryModal, setOpenDeleteInventoryModal] = useState(false);

//   const [selectedVariantSizeId, setSelectedVariantSizeId] = useState(null);
//   const [selectedInventoryData, setSelectedInventoryData] = useState(null);

//   // sizes cache by color
//   const [sizesByColor, setSizesByColor] = useState({});

//   const [hideFileUpload, setHideFileUpload] = useState("");

//   // const handleImageUpload = (e) => {
//   //   const file = e.target.files[0];
//   //   if (!file) return;

//   //   const formData = new FormData();
//   //   formData.append("image", file);
//   //   formData.append("hat_style_id", id);
//   //   formData.append("image_type", "jpg");
//   //   formData.append("alt_text", "Cap Image");
//   //   formData.append("is_primary", 1);
//   //   formData.append("hat_color_id",0)

//   //   dispatch(hatImageAdd(formData)).then((res) => {
//   //     toast.success(res?.payload?.data?.message || "Image uploaded");
//   //     fetchHatImage();
//   //   });
//   // };

// const handleImageUpload = async (e) => {
//   const file = e.target.files[0];
//   if (!file) return;

//   const hasImage = hatImageGetData?.data?.length > 0;

//   try {
//     if (hasImage) {
//       // ✅ UPDATE PAYLOAD (ONLY 2 FIELDS)
//       const updateFormData = new FormData();
//       updateFormData.append("hat_style_id", id);
//       updateFormData.append("image", file);

//       const res = await dispatch(hatImageUpdate(updateFormData)).unwrap();
//       toast.success(res?.message || "Image updated successfully");

//     } else {
//       // ✅ ADD PAYLOAD (OLD FULL PAYLOAD)
//       const addFormData = new FormData();
//       addFormData.append("image", file);
//       addFormData.append("hat_style_id", id);
//       addFormData.append("image_type", "jpg");
//       addFormData.append("alt_text", "Cap Image");
//       addFormData.append("is_primary", 1);
//       addFormData.append("hat_color_id",0)

//       const res = await dispatch(hatImageAdd(addFormData)).unwrap();
//       toast.success(res?.message || "Image uploaded successfully");
//     }

//     setIsEditingImage(false);
//     fetchHatImage();

//   } catch (error) {
//     console.error(error);
//     toast.error("Failed to upload image");
//   }
// };







//   const fetchHatDetails = useCallback(() => {
//     if (!id) return;

//     dispatch(hatSingle(id))
//       .unwrap()
//       .then((response) => {
//         if (response?.data) setHatData(response.data[0]);
//       })
//       .catch((error) => {
//         console.error("Error fetching hat details:", error);
//         toast.error("Failed to fetch hat details.");
//       });
//   }, [id, dispatch]);

//   const fetchHatColor = useCallback(() => {
//     if (!id) return;

//     dispatch(hatColorSingle(id))
//       .unwrap()
//       .catch((error) => {
//         console.error("Error fetching hat colors:", error);
//         toast.error("Failed to fetch hat colors.");
//       });
//   }, [id, dispatch]);

//   const fetchHatImage = useCallback(() => {
//     if (!id) return;

//     dispatch(hatImageGet(id))
//       .unwrap()
//       .then((response) => {
//         if (response?.data?.length > 0){ setHideFileUpload("hidden");
//         }
//         else{ setHideFileUpload("")
//         }
//         setIsEditingImage(false);
//       })
//       .catch((error) => {
//         console.error("Error fetching hat image:", error);
//         toast.error("Failed to fetch hat image.");
//       });
//   }, [id, dispatch]);

//   // ✅ IMPORTANT: inventory list is global; filter by hat_size_variant_id later
//   const fetchInventory = useCallback(() => {
//     dispatch(inventoryList({ page: 1, limit: 1000 }))
//       .unwrap?.()
//       .catch((error) => {
//         console.error("Error fetching inventory list:", error);
//         toast.error("Failed to fetch inventory list.");
//       });
//   }, [dispatch]);

//   const fetchHatSizes = useCallback(
//     async (hatColorId) => {
//       if (!hatColorId) return;

//       try {
//         const response = await dispatch(hatSizeSingle(hatColorId)).unwrap();
//         setSizesByColor((prev) => ({
//           ...prev,
//           [hatColorId]: Array.isArray(response?.data) ? response.data : [],
//         }));
//       } catch (error) {
//         console.error("Error fetching Hat sizes:", error);
//         toast.error("Failed to fetch Hat sizes.");
//       }
//     },
//     [dispatch]
//   );

//   useEffect(() => {
//     fetchHatDetails();
//     fetchHatColor();
//     fetchHatImage();
//     fetchInventory(); // ✅ new
//   }, [fetchHatDetails, fetchHatColor, fetchHatImage, fetchInventory]);

//   useEffect(() => {
//     dispatch(brandList()).unwrap().catch(() => {});
//   }, [dispatch]);

//   // brand name
//   useEffect(() => {
//     if (hatData && hatData?.brand_id) {
//       const brandId = hatData?.brand_id;
//       const foundBrand = brandListData?.data?.find((b) => b.id === brandId);
//       if (foundBrand?.name) setBrandName(foundBrand.name);
//     }
//   }, [hatData, brandListData]);

//   // load sizes per color
//   useEffect(() => {
//     const colors = hatColorSingleData?.data || [];
//     if (!colors.length) return;

//     colors.forEach((c) => {
//       if (c?.id && !sizesByColor[c.id]) fetchHatSizes(c.id);
//     });
//   }, [hatColorSingleData, fetchHatSizes, sizesByColor]);

//   // ✅ Build lookup: hat_size_variant_id -> inventory[]
//   const inventoryByVariantId = useMemo(() => {
//     const list = inventoryListData?.data;
//     if (!Array.isArray(list)) return {};
//     return list.reduce((acc, inv) => {
//       const key = String(inv?.hat_size_variant_id);
//       if (!key) return acc;
//       acc[key] = acc[key] || [];
//       acc[key].push(inv);
//       return acc;
//     }, {});
//   }, [inventoryListData]);

//   if (loading) {
//     return (
//       <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-white">
//         <div className="h-full lg:h-screen flex items-center justify-center">
//           <Loader size="large" text="Loading Hat Details..." />
//         </div>
//       </div>
//     );
//   }

//   if (!hatData) {
//     return (
//       <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-white">
//         <div className="h-full lg:h-screen flex items-center justify-center">
//           <div className="text-center">
//             <p className="text-gray-500 text-lg">Hat details not found</p>
//             <button
//               onClick={() => navigate("/hat")}
//               className="mt-4 px-4 py-2 bg-[#f20c32] hover:bg-black text-white rounded-lg"
//             >
//               Back to Hats
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-white">
//       <div className="h-full">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-6">
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => navigate("/hat")}
//               className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//               title="Back to Hats"
//             >
//               <FaArrowLeft className="w-5 h-5 text-gray-600" />
//             </button>
//             <h1 className="text-3xl font-bold text-gray-800">Hat Details</h1>
//           </div>
//           <div
//             className={`px-4 py-2 rounded-full text-white text-sm font-semibold ${
//               hatData?.is_active ? "bg-green-500" : "bg-gray-400"
//             }`}
//           >
//             {hatData?.is_active ? "Active" : "Inactive"}
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Left */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Basic Info */}
//             <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
//               <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
//                 <FaTag className="w-5 h-5 text-[#f20c32]" />
//                 Basic Information
//               </h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="text-sm font-semibold text-gray-600">Hat Name</label>
//                   <p className="text-lg text-gray-800 mt-1">{hatData?.name || "N/A"}</p>
//                 </div>
//                 <div>
//                   <label className="text-sm font-semibold text-gray-600">Style Code</label>
//                   <p className="text-lg text-gray-800 mt-1">
//                     {hatData?.internal_style_code || "N/A"}
//                   </p>
//                 </div>
//                 <div>
//                   <label className="text-sm font-semibold text-gray-600">Brand</label>
//                   <p className="text-lg text-gray-800 mt-1">{brandName || "N/A"}</p>
//                 </div>
//                 <div>
//                   <label className="text-sm font-semibold text-gray-600">Description</label>
//                   <p className="text-lg text-gray-800 mt-1">{hatData?.description || "N/A"}</p>
//                 </div>
//                 <div>
//                   <label className="text-sm font-semibold text-gray-600">Min Order Quantity</label>
//                   <p className="text-lg text-gray-800 mt-1">{hatData?.min_qty || "N/A"}</p>
//                 </div>
//                 <div>
//                   <label className="text-sm font-semibold text-gray-600">Hat ID</label>
//                   <p className="text-sm text-gray-500 mt-1 font-mono">{hatData?.id || "N/A"}</p>
//                 </div>
//               </div>
//             </div>

//             {/* Tabs */}
//             <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm w-full">
//               <Tabs aria-label="Tabs with icons" className="border-b border-gray-200">
//                 <Tabs.Item
//                   active={activeTab === 0}
//                   title={
//                     <div className="flex items-center gap-2">
//                       <FaPalette className="w-4 h-4" />
//                       <span>Color Variants</span>
//                     </div>
//                   }
//                   onClick={() => setActiveTab(0)}
//                 >
//                   <div>
//                     <div className="flex items-center justify-between mb-4">
//                       <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
//                         <FaPalette className="w-5 h-5 text-[#f20c32]" />
//                         Hat Color ({hatColorSingleData?.data?.length || 0})
//                       </h2>
//                       <Button
//                         onClick={() => setOpenAddVariantModal(true)}
//                         className="bg-[#f20c32] hover:bg-black px-4 py-1 text-white text-sm font-semibold flex justify-center items-center gap-2 rounded-md"
//                       >
//                         <FaPlus className="w-4 h-4" />
//                         Add Color
//                       </Button>
//                     </div>

//                     {hatColorSingleData?.data && hatColorSingleData?.data?.length > 0 ? (
//                       <div className="space-y-4">
//                         {hatColorSingleData?.data?.map((variant, index) => (
//                           <div
//                             key={variant.id}
//                             className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
//                           >
//                             <div className="flex items-start justify-between gap-4 mb-3">
//                               <div className="flex-1 min-w-0">
//                                 <div className="flex items-center gap-3 mb-2 flex-wrap">
//                                   <h3 className="text-lg font-semibold text-gray-800">
//                                     Color #{index + 1}: {variant.name || "Unnamed Color"}
//                                   </h3>

//                                   <span
//                                     className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                                       variant.is_active
//                                         ? "bg-green-100 text-green-700"
//                                         : "bg-gray-100 text-gray-700"
//                                     }`}
//                                   >
//                                     {variant.is_active ? "Active" : "Inactive"}
//                                   </span>
//                                 </div>

//                                 <div className="flex items-center gap-4 text-sm text-gray-600">
//                                   <div className="flex items-center gap-2">
//                                     <FaPalette className="w-4 h-4" />
//                                     <span>
//                                       <strong>Color:</strong>
//                                     </span>
//                                   </div>

//                                   {variant.color_code && (
//                                     <div className="flex items-center gap-2">
//                                       <div
//                                         className="w-5 h-5 rounded border border-gray-300"
//                                         style={{ backgroundColor: variant.color_code }}
//                                         title={variant.color_code}
//                                       />
//                                       <span className="font-mono text-xs">{variant.color_code}</span>
//                                     </div>
//                                   )}
//                                 </div>
//                               </div>

//                               <div className="shrink-0">
//                                 <div className="w-28 h-20 sm:w-32 sm:h-24 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center">
//                                   {variant?.primary_image_url ? (
//                                     <img
//                                       src={
//                                         "https://arsalaanrasulshowmeropi.bestworks.cloud" +
//                                         variant.primary_image_url
//                                       }
//                                       alt={variant?.name ? `${variant.name} color` : "Hat color"}
//                                       className="w-full h-full object-cover"
//                                       loading="lazy"
//                                       onError={(e) => {
//                                         e.currentTarget.style.display = "none";
//                                       }}
//                                     />
//                                   ) : (
//                                     <div className="text-xs text-gray-400 px-2 text-center">
//                                       No image
//                                     </div>
//                                   )}
//                                 </div>
//                               </div>
//                             </div>

//                             {/* Sizes */}
//                             <div className="mt-4">
//                               <div className="flex items-center justify-between mb-3">
//                                 <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
//                                   <FaRuler className="w-4 h-4" />
//                                   Color Sizes ({sizesByColor?.[variant.id]?.length || 0})
//                                 </h4>
//                                 <button
//                                   onClick={() => {
//                                     setSelectedVariantId(variant.id);
//                                     setOpenAddSizeModal(true);
//                                   }}
//                                   className="px-3 py-1 bg-[#f20c32] hover:bg-black text-white text-xs font-semibold flex justify-center items-center gap-1 rounded-md transition-colors"
//                                 >
//                                   <FaPlus className="w-3 h-3" />
//                                   Add size
//                                 </button>
//                               </div>

//                               {(sizesByColor?.[variant.id] || []).length > 0 ? (
//                                 <div className="overflow-x-auto">
//                                   <table className="w-full text-sm">
//                                     <thead>
//                                       <tr className="bg-gray-50 border-b border-gray-200">
//                                         <th className="px-4 py-2 text-left font-semibold text-gray-700">
//                                           Size
//                                         </th>
//                                         <th className="px-4 py-2 text-left font-semibold text-gray-700">
//                                           Variant Size Name
//                                         </th>
//                                         <th className="px-4 py-2 text-left font-semibold text-gray-700">
//                                           Supplier SKU
//                                         </th>
//                                         <th className="px-4 py-2 text-left font-semibold text-gray-700">
//                                           Inventory
//                                         </th>
//                                       </tr>
//                                     </thead>

//                                     <tbody>
//                                       {(sizesByColor?.[variant.id] || []).map((size) => {
//                                         const invList = inventoryByVariantId[String(size.id)] || [];
//                                         const hasInventory = invList.length > 0;

//                                         return (
//                                           <tr
//                                             key={size.id}
//                                             className="border-b border-gray-100 hover:bg-gray-50"
//                                           >
//                                             <td className="px-4 py-3">
//                                               <span className="inline-flex items-center gap-2">
//                                                 <FaRuler className="w-3 h-3 text-gray-400" />
//                                                 <span className="font-medium text-gray-800">
//                                                   {size.size_label || "N/A"}
//                                                 </span>
//                                               </span>
//                                             </td>

//                                             <td className="px-4 py-3 text-gray-700">
//                                               {size.variant_name || "N/A"}
//                                             </td>

//                                             <td className="px-4 py-3">
//                                               {size.supplier_sku ? (
//                                                 <span className="inline-flex items-center gap-1">
//                                                   <FaBarcode className="w-3 h-3 text-gray-400" />
//                                                   <span className="font-mono text-xs">
//                                                     {size.supplier_sku}
//                                                   </span>
//                                                 </span>
//                                               ) : (
//                                                 "N/A"
//                                               )}
//                                             </td>

//                                             {/* ✅ Inventory Action Logic */}
//                                             <td className="px-4 py-3">
//                                               {hasInventory ? (
//                                                 <div className="flex items-center gap-2">
//                                                   {/* View */}
//                                                   <button
//                                                     onClick={() => {
//                                                       setSelectedVariantSizeId(size.id);
//                                                       setOpenViewInventoryModal(true);
//                                                     }}
//                                                     className="p-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors"
//                                                     title="View Inventory"
//                                                   >
//                                                     <FaEye size={12} />
//                                                   </button>

//                                                   {/* Edit (edit first inventory record by default) */}
//                                                   <button
//                                                     onClick={() => {
//                                                       setSelectedVariantSizeId(size.id);
//                                                       setSelectedInventoryData(invList[0]);
//                                                       setOpenEditInventoryModal(true);
//                                                     }}
//                                                     className="p-1.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full transition-colors"
//                                                     title="Edit Inventory"
//                                                   >
//                                                     <FaEdit size={12} />
//                                                   </button>

//                                                   {/* Delete (delete first inventory record by default) */}
//                                                   <button
//                                                     onClick={() => {
//                                                       setSelectedVariantSizeId(size.id);
//                                                       setSelectedInventoryData(invList[0]);
//                                                       setOpenDeleteInventoryModal(true);
//                                                     }}
//                                                     className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
//                                                     title="Delete Inventory"
//                                                   >
//                                                     <FaTrash size={12} />
//                                                   </button>
//                                                 </div>
//                                               ) : (
//                                                 <button
//                                                   onClick={() => {
//                                                     setSelectedVariantSizeId(size.id);
//                                                     setOpenAddInventoryModal(true);
//                                                   }}
//                                                   className="p-1.5 bg-[#f20c32] hover:bg-black text-white rounded-full transition-colors"
//                                                   title="Add Inventory"
//                                                 >
//                                                   <FaPlus size={12} />
//                                                 </button>
//                                               )}
//                                             </td>
//                                           </tr>
//                                         );
//                                       })}
//                                     </tbody>
//                                   </table>
//                                 </div>
//                               ) : (
//                                 <div className="text-center py-4 text-gray-500 text-sm bg-gray-50 rounded">
//                                   <FaRuler className="w-5 h-5 mx-auto mb-2 text-gray-400" />
//                                   No sizes available for this color
//                                 </div>
//                               )}
//                             </div>

//                             <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
//                               <div className="flex items-center justify-between">
//                                 <span>
//                                   <strong>Created:</strong>{" "}
//                                   {variant.created_at
//                                     ? new Date(variant.created_at).toLocaleDateString("en-US", {
//                                         year: "numeric",
//                                         month: "short",
//                                         day: "numeric",
//                                         hour: "2-digit",
//                                         minute: "2-digit",
//                                       })
//                                     : "N/A"}
//                                 </span>
//                                 <span>
//                                   <strong>Updated:</strong>{" "}
//                                   {variant.updated_at
//                                     ? new Date(variant.updated_at).toLocaleDateString("en-US", {
//                                         year: "numeric",
//                                         month: "short",
//                                         day: "numeric",
//                                         hour: "2-digit",
//                                         minute: "2-digit",
//                                       })
//                                     : "N/A"}
//                                 </span>
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     ) : (
//                       <div className="text-center py-8 text-gray-500">
//                         <FaPalette className="w-12 h-12 mx-auto mb-3 text-gray-300" />
//                         <p>No variants available for this hat</p>
//                       </div>
//                     )}
//                   </div>
//                 </Tabs.Item>
//               </Tabs>
//             </div>
//           </div>

//           {/* Right Column - Image */}
//           <div className="lg:col-span-1">
//             <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm sticky top-6">
//               <div className="flex items-center justify-between mb-4">
//                 <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
//                   <FaImage className="w-5 h-5 text-[#f20c32]" />
//                   Hat Image
//                 </h2>
//               </div>

//               {hatImageGetData && hatImageGetData?.data?.length > 0 ? (
//                 <div className="relative mb-4">
//                   <img
//                     src={hatImageGetData?.data[hatImageGetData?.data?.length - 1]?.image_url}
//                     alt={hatData?.name || "Hat"}
//                     className="w-full h-auto rounded-lg border border-gray-200 object-cover"
//                     onError={(e) => {
//                       e.target.style.display = "none";
//                     }}
//                   />
//                     {!isEditingImage && (
//                   <button
//                     onClick={() => setIsEditingImage(true)}
//                     className="absolute top-2 right-2 bg-[#f20c32] hover:bg-black text-white p-2 rounded-full shadow-md transition-colors"
//                     title="Edit Image"
//                   >
//                     <FaEdit size={14} />
//                   </button>
//                 )}
//                 </div>
//               ) : (
//                 <div className="flex items-center justify-center w-full h-64 bg-gray-100 rounded-lg border border-gray-200 mb-4">
//                   <div className="text-center text-gray-400">
//                     <FaImage className="w-12 h-12 mx-auto mb-2" />
//                     <p>No image available</p>
//                   </div>
//                 </div>
//               )}

//               {/* <FileInput className={`${hideFileUpload}`} accept="image/*" onChange={handleImageUpload} /> */}
//               {(!hatImageGetData?.data?.length || isEditingImage) && (
//             <FileInput
//               accept="image/*"
//               onChange={handleImageUpload}
//             />
//           )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Add Variant Modal */}
//       {openAddVariantModal && (
//         <AddVariantModal
//           openModal={openAddVariantModal}
//           setOpenModal={setOpenAddVariantModal}
//           onVariantAdded={() => {
//             fetchHatColor();
//             fetchHatDetails();
//           }}
//           hatColorSingleData={hatColorSingleData}
//           hatId={id}
//           isEdit={false}
//         />
//       )}

//       {/* Edit Variant Modal */}
//       {openEditVariantModal && selectedVariantData && (
//         <AddVariantModal
//           openModal={openEditVariantModal}
//           setOpenModal={setOpenEditVariantModal}
//           onVariantAdded={() => {
//             fetchHatColor();
//             fetchHatDetails();
//           }}
//           hatId={id}
//           variantData={selectedVariantData}
//           isEdit={true}
//         />
//       )}

//       {/* Add Variant Size Modal */}
//       {openAddSizeModal && selectedVariantId && (
//         <AddVariantSizeModal
//           openModal={openAddSizeModal}
//           setOpenModal={setOpenAddSizeModal}
//           onSizeAdded={() => {
//             fetchHatColor();
//             fetchHatDetails();
//           }}
//           colorId={selectedVariantId}
//           isEdit={false}
//         />
//       )}

//       {/* ✅ View Inventory Modal */}
//       {openViewInventoryModal && selectedVariantSizeId && (
//         <ViewInventoryModal
//           openModal={openViewInventoryModal}
//           setOpenModal={setOpenViewInventoryModal}
//           variantSizeId={selectedVariantSizeId}
//           onRefreshInventory={fetchInventory}
//         />
//       )}

//       {/* Add Inventory Modal */}
//       {openAddInventoryModal && selectedVariantSizeId && (
//         <AddVariantSizeInventoryModal
//           openModal={openAddInventoryModal}
//           setOpenModal={setOpenAddInventoryModal}
//           onInventoryAdded={() => {
//             fetchInventory();
//             fetchHatDetails();
//           }}
//           inventoryData={null}
//           isEdit={false}
//           variantSizeId={selectedVariantSizeId}
//         />
//       )}

//       {/* Edit Inventory Modal */}
//       {openEditInventoryModal && selectedInventoryData && selectedVariantSizeId && (
//         <AddVariantSizeInventoryModal
//           openModal={openEditInventoryModal}
//           setOpenModal={setOpenEditInventoryModal}
//           onInventoryAdded={() => {
//             fetchInventory();
//             fetchHatDetails();
//           }}
//           inventoryData={selectedInventoryData}
//           isEdit={true}
//           variantSizeId={selectedVariantSizeId}
//         />
//       )}

//       {/* Delete Inventory Confirmation Modal */}
//       {openDeleteInventoryModal && selectedInventoryData && (
//         <DeleteConfirmModal
//           openModal={openDeleteInventoryModal}
//           setOpenModal={setOpenDeleteInventoryModal}
//           onConfirm={() => {
//             // NOTE: you already had inventoryDelete() in old file;
//             // keep your existing delete dispatch here exactly as your project uses it.
//             toast.error("Hook your inventoryDelete dispatch here (same as your existing logic).");
//             setOpenDeleteInventoryModal(false);
//           }}
//           brandName="this inventory"
//           itemType="inventory"
//         />
//       )}
//     </div>
//   );
// };
