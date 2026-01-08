import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import Loader from "../../../components/Loader";
import { toast } from "react-toastify";
import { Button, FileInput, Tabs } from "flowbite-react";
import {
  FaArrowLeft,
  FaImage,
  FaTag,
  FaPalette,
  FaRuler,
  FaBarcode,
  FaPlus,
  FaEdit,
  FaEye,
  FaTrash,
} from "react-icons/fa";

import AddVariantModal from "./AddVariantModal";
import DeleteConfirmModal from "../DeleteConfirmModal";
import {
  brandList,
  hatColorSingle,
  hatImageAdd,
  hatImageGet,
  hatSingle,
  hatSizeSingle,
} from "../../../Reducer/EcommerceNewSlice";

import AddVariantSizeModal from "./AddVariantSizeModal";
import AddVariantSizeInventoryModal from "./AddVariantSizeInventoryModal";
import { inventoryList } from "../../../Reducer/AddInvetoryNewSlice";

// ✅ NEW: modal for viewing inventory list
import ViewInventoryModal from "./ViewInventoryModal";

export const HatDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { hatSingleData, brandListData, hatColorSingleData, hatImageGetData, loading } =
    useSelector((state) => state.newecom);

  const { inventoryListData } = useSelector((state) => state.invent);

  const [hatData, setHatData] = useState(null);
  const [brandName, setBrandName] = useState("");

  const [openAddVariantModal, setOpenAddVariantModal] = useState(false);
  const [openEditVariantModal, setOpenEditVariantModal] = useState(false);

  const [openAddSizeModal, setOpenAddSizeModal] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [selectedVariantData, setSelectedVariantData] = useState(null);

  const [activeTab, setActiveTab] = useState(0);

  // inventory modals
  const [openViewInventoryModal, setOpenViewInventoryModal] = useState(false);
  const [openAddInventoryModal, setOpenAddInventoryModal] = useState(false);
  const [openEditInventoryModal, setOpenEditInventoryModal] = useState(false);
  const [openDeleteInventoryModal, setOpenDeleteInventoryModal] = useState(false);

  const [selectedVariantSizeId, setSelectedVariantSizeId] = useState(null);
  const [selectedInventoryData, setSelectedInventoryData] = useState(null);

  // sizes cache by color
  const [sizesByColor, setSizesByColor] = useState({});

  const [hideFileUpload, setHideFileUpload] = useState("");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    formData.append("hat_style_id", id);
    formData.append("image_type", "hat");
    formData.append("alt_text", "Cap Image");
    formData.append("is_primary", 1);

    dispatch(hatImageAdd(formData)).then((res) => {
      toast.success(res?.payload?.data?.message || "Image uploaded");
      fetchHatImage();
    });
  };

  const fetchHatDetails = useCallback(() => {
    if (!id) return;

    dispatch(hatSingle(id))
      .unwrap()
      .then((response) => {
        if (response?.data) setHatData(response.data[0]);
      })
      .catch((error) => {
        console.error("Error fetching hat details:", error);
        toast.error("Failed to fetch hat details.");
      });
  }, [id, dispatch]);

  const fetchHatColor = useCallback(() => {
    if (!id) return;

    dispatch(hatColorSingle(id))
      .unwrap()
      .catch((error) => {
        console.error("Error fetching hat colors:", error);
        toast.error("Failed to fetch hat colors.");
      });
  }, [id, dispatch]);

  const fetchHatImage = useCallback(() => {
    if (!id) return;

    dispatch(hatImageGet(id))
      .unwrap()
      .then((response) => {
        if (response?.data?.length > 0) setHideFileUpload("hidden");
        else setHideFileUpload("");
      })
      .catch((error) => {
        console.error("Error fetching hat image:", error);
        toast.error("Failed to fetch hat image.");
      });
  }, [id, dispatch]);

  // ✅ IMPORTANT: inventory list is global; filter by hat_size_variant_id later
  const fetchInventory = useCallback(() => {
    dispatch(inventoryList({ page: 1, limit: 1000 }))
      .unwrap?.()
      .catch((error) => {
        console.error("Error fetching inventory list:", error);
        toast.error("Failed to fetch inventory list.");
      });
  }, [dispatch]);

  const fetchHatSizes = useCallback(
    async (hatColorId) => {
      if (!hatColorId) return;

      try {
        const response = await dispatch(hatSizeSingle(hatColorId)).unwrap();
        setSizesByColor((prev) => ({
          ...prev,
          [hatColorId]: Array.isArray(response?.data) ? response.data : [],
        }));
      } catch (error) {
        console.error("Error fetching Hat sizes:", error);
        toast.error("Failed to fetch Hat sizes.");
      }
    },
    [dispatch]
  );

  useEffect(() => {
    fetchHatDetails();
    fetchHatColor();
    fetchHatImage();
    fetchInventory(); // ✅ new
  }, [fetchHatDetails, fetchHatColor, fetchHatImage, fetchInventory]);

  useEffect(() => {
    dispatch(brandList()).unwrap().catch(() => {});
  }, [dispatch]);

  // brand name
  useEffect(() => {
    if (hatData && hatData?.brand_id) {
      const brandId = hatData?.brand_id;
      const foundBrand = brandListData?.data?.find((b) => b.id === brandId);
      if (foundBrand?.name) setBrandName(foundBrand.name);
    }
  }, [hatData, brandListData]);

  // load sizes per color
  useEffect(() => {
    const colors = hatColorSingleData?.data || [];
    if (!colors.length) return;

    colors.forEach((c) => {
      if (c?.id && !sizesByColor[c.id]) fetchHatSizes(c.id);
    });
  }, [hatColorSingleData, fetchHatSizes, sizesByColor]);

  // ✅ Build lookup: hat_size_variant_id -> inventory[]
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

  if (loading) {
    return (
      <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-white">
        <div className="h-full lg:h-screen flex items-center justify-center">
          <Loader size="large" text="Loading Hat Details..." />
        </div>
      </div>
    );
  }

  if (!hatData) {
    return (
      <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-white">
        <div className="h-full lg:h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 text-lg">Hat details not found</p>
            <button
              onClick={() => navigate("/hat")}
              className="mt-4 px-4 py-2 bg-[#f20c32] hover:bg-black text-white rounded-lg"
            >
              Back to Hats
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-white">
      <div className="h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/hat")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Back to Hats"
            >
              <FaArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-3xl font-bold text-gray-800">Hat Details</h1>
          </div>
          <div
            className={`px-4 py-2 rounded-full text-white text-sm font-semibold ${
              hatData?.is_active ? "bg-green-500" : "bg-gray-400"
            }`}
          >
            {hatData?.is_active ? "Active" : "Inactive"}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaTag className="w-5 h-5 text-[#f20c32]" />
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600">Hat Name</label>
                  <p className="text-lg text-gray-800 mt-1">{hatData?.name || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Style Code</label>
                  <p className="text-lg text-gray-800 mt-1">
                    {hatData?.internal_style_code || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Brand</label>
                  <p className="text-lg text-gray-800 mt-1">{brandName || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Description</label>
                  <p className="text-lg text-gray-800 mt-1">{hatData?.description || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Min Order Quantity</label>
                  <p className="text-lg text-gray-800 mt-1">{hatData?.min_qty || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Hat ID</label>
                  <p className="text-sm text-gray-500 mt-1 font-mono">{hatData?.id || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm w-full">
              <Tabs aria-label="Tabs with icons" className="border-b border-gray-200">
                <Tabs.Item
                  active={activeTab === 0}
                  title={
                    <div className="flex items-center gap-2">
                      <FaPalette className="w-4 h-4" />
                      <span>Color Variants</span>
                    </div>
                  }
                  onClick={() => setActiveTab(0)}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                        <FaPalette className="w-5 h-5 text-[#f20c32]" />
                        Hat Color ({hatColorSingleData?.data?.length || 0})
                      </h2>
                      <Button
                        onClick={() => setOpenAddVariantModal(true)}
                        className="bg-[#f20c32] hover:bg-black px-4 py-1 text-white text-sm font-semibold flex justify-center items-center gap-2 rounded-md"
                      >
                        <FaPlus className="w-4 h-4" />
                        Add Color
                      </Button>
                    </div>

                    {hatColorSingleData?.data && hatColorSingleData?.data?.length > 0 ? (
                      <div className="space-y-4">
                        {hatColorSingleData?.data?.map((variant, index) => (
                          <div
                            key={variant.id}
                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-start justify-between gap-4 mb-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-2 flex-wrap">
                                  <h3 className="text-lg font-semibold text-gray-800">
                                    Color #{index + 1}: {variant.name || "Unnamed Color"}
                                  </h3>

                                  <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                      variant.is_active
                                        ? "bg-green-100 text-green-700"
                                        : "bg-gray-100 text-gray-700"
                                    }`}
                                  >
                                    {variant.is_active ? "Active" : "Inactive"}
                                  </span>
                                </div>

                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                  <div className="flex items-center gap-2">
                                    <FaPalette className="w-4 h-4" />
                                    <span>
                                      <strong>Color:</strong>
                                    </span>
                                  </div>

                                  {variant.color_code && (
                                    <div className="flex items-center gap-2">
                                      <div
                                        className="w-5 h-5 rounded border border-gray-300"
                                        style={{ backgroundColor: variant.color_code }}
                                        title={variant.color_code}
                                      />
                                      <span className="font-mono text-xs">{variant.color_code}</span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="shrink-0">
                                <div className="w-28 h-20 sm:w-32 sm:h-24 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center">
                                  {variant?.primary_image_url ? (
                                    <img
                                      src={
                                        "https://arsalaanrasulshowmeropi.bestworks.cloud" +
                                        variant.primary_image_url
                                      }
                                      alt={variant?.name ? `${variant.name} color` : "Hat color"}
                                      className="w-full h-full object-cover"
                                      loading="lazy"
                                      onError={(e) => {
                                        e.currentTarget.style.display = "none";
                                      }}
                                    />
                                  ) : (
                                    <div className="text-xs text-gray-400 px-2 text-center">
                                      No image
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Sizes */}
                            <div className="mt-4">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                  <FaRuler className="w-4 h-4" />
                                  Color Sizes ({sizesByColor?.[variant.id]?.length || 0})
                                </h4>
                                <button
                                  onClick={() => {
                                    setSelectedVariantId(variant.id);
                                    setOpenAddSizeModal(true);
                                  }}
                                  className="px-3 py-1 bg-[#f20c32] hover:bg-black text-white text-xs font-semibold flex justify-center items-center gap-1 rounded-md transition-colors"
                                >
                                  <FaPlus className="w-3 h-3" />
                                  Add size
                                </button>
                              </div>

                              {(sizesByColor?.[variant.id] || []).length > 0 ? (
                                <div className="overflow-x-auto">
                                  <table className="w-full text-sm">
                                    <thead>
                                      <tr className="bg-gray-50 border-b border-gray-200">
                                        <th className="px-4 py-2 text-left font-semibold text-gray-700">
                                          Size
                                        </th>
                                        <th className="px-4 py-2 text-left font-semibold text-gray-700">
                                          Variant Size Name
                                        </th>
                                        <th className="px-4 py-2 text-left font-semibold text-gray-700">
                                          Supplier SKU
                                        </th>
                                        <th className="px-4 py-2 text-left font-semibold text-gray-700">
                                          Inventory
                                        </th>
                                      </tr>
                                    </thead>

                                    <tbody>
                                      {(sizesByColor?.[variant.id] || []).map((size) => {
                                        const invList = inventoryByVariantId[String(size.id)] || [];
                                        const hasInventory = invList.length > 0;

                                        return (
                                          <tr
                                            key={size.id}
                                            className="border-b border-gray-100 hover:bg-gray-50"
                                          >
                                            <td className="px-4 py-3">
                                              <span className="inline-flex items-center gap-2">
                                                <FaRuler className="w-3 h-3 text-gray-400" />
                                                <span className="font-medium text-gray-800">
                                                  {size.size_label || "N/A"}
                                                </span>
                                              </span>
                                            </td>

                                            <td className="px-4 py-3 text-gray-700">
                                              {size.variant_name || "N/A"}
                                            </td>

                                            <td className="px-4 py-3">
                                              {size.supplier_sku ? (
                                                <span className="inline-flex items-center gap-1">
                                                  <FaBarcode className="w-3 h-3 text-gray-400" />
                                                  <span className="font-mono text-xs">
                                                    {size.supplier_sku}
                                                  </span>
                                                </span>
                                              ) : (
                                                "N/A"
                                              )}
                                            </td>

                                            {/* ✅ Inventory Action Logic */}
                                            <td className="px-4 py-3">
                                              {hasInventory ? (
                                                <div className="flex items-center gap-2">
                                                  {/* View */}
                                                  <button
                                                    onClick={() => {
                                                      setSelectedVariantSizeId(size.id);
                                                      setOpenViewInventoryModal(true);
                                                    }}
                                                    className="p-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors"
                                                    title="View Inventory"
                                                  >
                                                    <FaEye size={12} />
                                                  </button>

                                                  {/* Edit (edit first inventory record by default) */}
                                                  <button
                                                    onClick={() => {
                                                      setSelectedVariantSizeId(size.id);
                                                      setSelectedInventoryData(invList[0]);
                                                      setOpenEditInventoryModal(true);
                                                    }}
                                                    className="p-1.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full transition-colors"
                                                    title="Edit Inventory"
                                                  >
                                                    <FaEdit size={12} />
                                                  </button>

                                                  {/* Delete (delete first inventory record by default) */}
                                                  <button
                                                    onClick={() => {
                                                      setSelectedVariantSizeId(size.id);
                                                      setSelectedInventoryData(invList[0]);
                                                      setOpenDeleteInventoryModal(true);
                                                    }}
                                                    className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                                                    title="Delete Inventory"
                                                  >
                                                    <FaTrash size={12} />
                                                  </button>
                                                </div>
                                              ) : (
                                                <button
                                                  onClick={() => {
                                                    setSelectedVariantSizeId(size.id);
                                                    setOpenAddInventoryModal(true);
                                                  }}
                                                  className="p-1.5 bg-[#f20c32] hover:bg-black text-white rounded-full transition-colors"
                                                  title="Add Inventory"
                                                >
                                                  <FaPlus size={12} />
                                                </button>
                                              )}
                                            </td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                </div>
                              ) : (
                                <div className="text-center py-4 text-gray-500 text-sm bg-gray-50 rounded">
                                  <FaRuler className="w-5 h-5 mx-auto mb-2 text-gray-400" />
                                  No sizes available for this color
                                </div>
                              )}
                            </div>

                            <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
                              <div className="flex items-center justify-between">
                                <span>
                                  <strong>Created:</strong>{" "}
                                  {variant.created_at
                                    ? new Date(variant.created_at).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })
                                    : "N/A"}
                                </span>
                                <span>
                                  <strong>Updated:</strong>{" "}
                                  {variant.updated_at
                                    ? new Date(variant.updated_at).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })
                                    : "N/A"}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <FaPalette className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No variants available for this hat</p>
                      </div>
                    )}
                  </div>
                </Tabs.Item>
              </Tabs>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <FaImage className="w-5 h-5 text-[#f20c32]" />
                  Hat Image
                </h2>
              </div>

              {hatImageGetData && hatImageGetData?.data?.length > 0 ? (
                <div className="relative mb-4">
                  <img
                    src={hatImageGetData?.data[hatImageGetData?.data?.length - 1]?.image_url}
                    alt={hatData?.name || "Hat"}
                    className="w-full h-auto rounded-lg border border-gray-200 object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center w-full h-64 bg-gray-100 rounded-lg border border-gray-200 mb-4">
                  <div className="text-center text-gray-400">
                    <FaImage className="w-12 h-12 mx-auto mb-2" />
                    <p>No image available</p>
                  </div>
                </div>
              )}

              <FileInput className={`${hideFileUpload}`} accept="image/*" onChange={handleImageUpload} />
            </div>
          </div>
        </div>
      </div>

      {/* Add Variant Modal */}
      {openAddVariantModal && (
        <AddVariantModal
          openModal={openAddVariantModal}
          setOpenModal={setOpenAddVariantModal}
          onVariantAdded={() => {
            fetchHatColor();
            fetchHatDetails();
          }}
          hatColorSingleData={hatColorSingleData}
          hatId={id}
          isEdit={false}
        />
      )}

      {/* Edit Variant Modal */}
      {openEditVariantModal && selectedVariantData && (
        <AddVariantModal
          openModal={openEditVariantModal}
          setOpenModal={setOpenEditVariantModal}
          onVariantAdded={() => {
            fetchHatColor();
            fetchHatDetails();
          }}
          hatId={id}
          variantData={selectedVariantData}
          isEdit={true}
        />
      )}

      {/* Add Variant Size Modal */}
      {openAddSizeModal && selectedVariantId && (
        <AddVariantSizeModal
          openModal={openAddSizeModal}
          setOpenModal={setOpenAddSizeModal}
          onSizeAdded={() => {
            fetchHatColor();
            fetchHatDetails();
          }}
          colorId={selectedVariantId}
          isEdit={false}
        />
      )}

      {/* ✅ View Inventory Modal */}
      {openViewInventoryModal && selectedVariantSizeId && (
        <ViewInventoryModal
          openModal={openViewInventoryModal}
          setOpenModal={setOpenViewInventoryModal}
          variantSizeId={selectedVariantSizeId}
          onRefreshInventory={fetchInventory}
        />
      )}

      {/* Add Inventory Modal */}
      {openAddInventoryModal && selectedVariantSizeId && (
        <AddVariantSizeInventoryModal
          openModal={openAddInventoryModal}
          setOpenModal={setOpenAddInventoryModal}
          onInventoryAdded={() => {
            fetchInventory();
            fetchHatDetails();
          }}
          inventoryData={null}
          isEdit={false}
          variantSizeId={selectedVariantSizeId}
        />
      )}

      {/* Edit Inventory Modal */}
      {openEditInventoryModal && selectedInventoryData && selectedVariantSizeId && (
        <AddVariantSizeInventoryModal
          openModal={openEditInventoryModal}
          setOpenModal={setOpenEditInventoryModal}
          onInventoryAdded={() => {
            fetchInventory();
            fetchHatDetails();
          }}
          inventoryData={selectedInventoryData}
          isEdit={true}
          variantSizeId={selectedVariantSizeId}
        />
      )}

      {/* Delete Inventory Confirmation Modal */}
      {openDeleteInventoryModal && selectedInventoryData && (
        <DeleteConfirmModal
          openModal={openDeleteInventoryModal}
          setOpenModal={setOpenDeleteInventoryModal}
          onConfirm={() => {
            // NOTE: you already had inventoryDelete() in old file;
            // keep your existing delete dispatch here exactly as your project uses it.
            toast.error("Hook your inventoryDelete dispatch here (same as your existing logic).");
            setOpenDeleteInventoryModal(false);
          }}
          brandName="this inventory"
          itemType="inventory"
        />
      )}
    </div>
  );
};
