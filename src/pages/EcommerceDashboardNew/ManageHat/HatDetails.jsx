import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
// import { hatDetails, supplierList, pricetierList, pricetierStatusChange, inventorySingle, inventoryDelete, hatMultiImageDelete } from "../../Reducer/EcommerceSlice";
// import AddHatImagesModal from "./AddHatImagesModal";
// import EditHatImageModal from "./EditHatImageModal";
import Loader from "../../../components/Loader";
import { toast } from "react-toastify";
import { Button, FileInput, Tabs } from "flowbite-react";
import { FaArrowLeft, FaImage, FaTag, FaCheckCircle, FaTimesCircle, FaPalette, FaRuler, FaBarcode, FaBox, FaPlus, FaEdit, FaDollarSign, FaEye, FaTrash } from "react-icons/fa";
import AddVariantModal from "./AddVariantModal";
// import AddVariantSizeModal from "./AddVariantSizeModal";
// import AddPriceTierModal from "./AddPriceTierModal";
// import AddVariantSizeInventoryModal from "./AddVariantSizeInventoryModal";
// import ViewInventoryModal from "./ViewInventoryModal";
import DeleteConfirmModal from "../DeleteConfirmModal";
// import { hatList } from "../../Reducer/EcommerceNewSlice";
import { brandList, hatColorList, hatColorSingle, hatImageAdd, hatSingle, hatSizeSingle } from "../../../Reducer/EcommerceNewSlice";
import AddVariantSizeModal from "./AddVariantSizeModal";
import AddVariantSizeInventoryModal from "./AddVariantSizeInventoryModal";

export const HatDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pricetierListData } = useSelector((state) => state.ecom);
  const { hatSingleData, brandListData, hatColorSingleData, hatSizeSingleData, loading } = useSelector((state) => state.newecom);

  const [hatData, setHatData] = useState(null);
  const [brandName, setBrandName] = useState("");
  const [openAddVariantModal, setOpenAddVariantModal] = useState(false);
  const [openEditVariantModal, setOpenEditVariantModal] = useState(false);
  const [openAddSizeModal, setOpenAddSizeModal] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [selectedVariantData, setSelectedVariantData] = useState(null);
  const [openAddPriceTierModal, setOpenAddPriceTierModal] = useState(false);
  const [openEditPriceTierModal, setOpenEditPriceTierModal] = useState(false);
  const [selectedPriceTierData, setSelectedPriceTierData] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [openViewInventoryModal, setOpenViewInventoryModal] = useState(false);
  const [openAddInventoryModal, setOpenAddInventoryModal] = useState(false);
  const [openEditInventoryModal, setOpenEditInventoryModal] = useState(false);
  const [openDeleteInventoryModal, setOpenDeleteInventoryModal] = useState(false);
  const [selectedVariantSizeId, setSelectedVariantSizeId] = useState(null);
  const [selectedInventoryData, setSelectedInventoryData] = useState(null);
  const [openAddHatImagesModal, setOpenAddHatImagesModal] = useState(false);
  const [openEditHatImageModal, setOpenEditHatImageModal] = useState(false);
  const [selectedImageData, setSelectedImageData] = useState(null);
  const [sizesByColor, setSizesByColor] = useState({});

const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    formData.append("hat_style_id", id);
    formData.append("hat_color_id",0)
    formData.append("image_type","png")
    formData.append("alt_text","Cap Image")
    formData.append("is_primary",1)

    dispatch(hatImageAdd(formData)).then((res)=>{
      console.log("Res",res);
      
    });
  };
  // Function to fetch hat details
  const fetchHatDetails = useCallback(() => {
    if (id) {
      dispatch(hatSingle(id))
        .unwrap()
        .then((response) => {
          console.log("Hat details:", response);
          if (response?.data) {
            setHatData(response.data[0]);
          }
        })
        .catch((error) => {
          console.error("Error fetching hat details:", error);
          toast.error("Failed to fetch hat details.");
        });
    }
  }, [id, dispatch]);

  console.log("hatData", hatData)
  // Function to fetch price tiers
  const fetchHatColor = useCallback(() => {
    if (id) {
      dispatch(hatColorSingle(id))
        .unwrap()
        .then((response) => {
          console.log("hat colors fetched:", response);
        })
        .catch((error) => {
          console.error("Error fetching hat colors:", error);
          toast.error("Failed to fetch hat colors.");
        });
    }
  }, [id, dispatch]);

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

  }, [fetchHatDetails, fetchHatColor]);

  // Fetch brand to get supplier name
  useEffect(() => {
    dispatch(brandList())
      .unwrap()
      .catch((error) => {
        console.error("Error fetching suppliers:", error);
      });
  }, [dispatch]);

  // Get brand name from brandListData
  useEffect(() => {
    if (hatData && hatData?.brand_id) {
      const brandId = hatData?.brand_id;
      const foundBrand = brandListData?.data?.find(
        (brand) => brand.id === brandId
      );
      if (foundBrand?.name) {
        setBrandName(foundBrand?.name);
      }
    }
  }, [hatData, brandListData]);

  console.log("hatSizeSingleData", hatSizeSingleData)
  // Extract and transform price tier list from response
  const priceTierData = useMemo(() => {
    if (pricetierListData?.data?.data && Array.isArray(pricetierListData.data.data)) {
      return pricetierListData.data.data.map((item) => {
        return {
          id: item.id,
          min_qty: item.fields?.["Min Qty"] || 0,
          max_qty: item.fields?.["Max Qty"] || 0,
          unit_price: item.fields?.["Unit Price"] || 0,
          notes: item.fields?.["Notes"] || "",
          active: item.fields?.["Active"] ?? false,
        };
      });
    }
    return [];
  }, [pricetierListData]);

  // Handle add price tier
  const handleAddPriceTier = () => {
    setSelectedPriceTierData(null);
    setOpenAddPriceTierModal(true);
  };
  useEffect(() => {
    const colors = hatColorSingleData?.data || [];
    if (!colors.length) return;

    colors.forEach((c) => {
      if (c?.id && !sizesByColor[c.id]) {
        fetchHatSizes(c.id);
      }
    });
  }, [hatColorSingleData, fetchHatSizes, sizesByColor]);


  // Handle edit price tier
  // const handleEditPriceTier = (priceTierId) => {
  //   const priceTier = priceTierData.find((pt) => pt.id === priceTierId);
  //   if (priceTier) {
  //     setSelectedPriceTierData(priceTier);
  //     setOpenEditPriceTierModal(true);
  //   } else {
  //     toast.error("Price tier not found");
  //   }
  // };

  // Handle active/inactive toggle for price tier
  const handleTogglePriceTierStatus = (priceTierId, currentStatus) => {
    dispatch(pricetierStatusChange(priceTierId))
      .unwrap()
      .then((response) => {
        console.log("Price tier status changed successfully:", response);
        toast.success(`Price tier ${!currentStatus ? "activated" : "deactivated"} successfully!`);
        fetchHatColor();
      })
      .catch((error) => {
        console.error("Error changing price tier status:", error);
        toast.error("Failed to change price tier status. Please try again.");
      });
  };
  // Handle edit multi image
  const handleMultiEdit = (imageId) => {
    const imageItem = hatData?.hatImages?.find((img) => img.id === imageId);
    if (imageItem) {
      setSelectedImageData(imageItem);
      setOpenEditHatImageModal(true);
    } else {
      toast.error("Image not found");
    }
  };

  // delete multi images
  const handleMultiImageDelete = (imageId) => {
    dispatch(hatMultiImageDelete(imageId))
      .unwrap()
      .then((response) => {
        console.log("Image deleted successfully:", response);
        toast.success(response?.message || "Image deleted successfully!");
        fetchHatDetails()
      })
      .catch((error) => {
        console.error("Error deleting image:", error);
        toast.error(error?.message || "Failed to delete image. Please try again.");
      });
  }

  // Custom cell renderer for Actions in price tier table
  const PriceTierActionsRenderer = (params) => {
    const priceTierId = params.data.id;

    return (
      <div className="flex gap-2 justify-center items-center">
        {/* <button
          onClick={() => handleEditPriceTier(priceTierId)}
          className="bg-yellow-500 hover:bg-yellow-600 p-2 text-white rounded-full transition-colors"
          title="Edit"
        >
          <FaEdit size={14} />
        </button> */}
      </div>
    );
  };

  // Custom cell renderer for active toggle in price tier table
  const PriceTierActiveToggleRenderer = (params) => {
    const isActive = params.value;
    const priceTierId = params.data.id;

    return (
      <button
        onClick={() => handleTogglePriceTierStatus(priceTierId, isActive)}
        className={`px-4 py-1 rounded-full text-white text-xs font-semibold transition-colors ${isActive
            ? "bg-green-500 hover:bg-green-600"
            : "bg-gray-400 hover:bg-gray-500"
          }`}
        style={{ fontSize: '12px' }}
      >
        {isActive ? "Active" : "Inactive"}
      </button>
    );
  };

  const priceTierColumnDefs = [
    {
      field: "min_qty",
      headerName: "Min Qty",
      sortable: true,
      filter: true,
      width: 120,
    },
    {
      field: "max_qty",
      headerName: "Max Qty",
      sortable: true,
      filter: true,
      width: 120,
    },
    {
      field: "unit_price",
      headerName: "Unit Price",
      sortable: true,
      filter: true,
      width: 150,
      cellRenderer: (params) => {
        return `$${params.value?.toFixed(2) || "0.00"}`;
      },
    },
    {
      field: "notes",
      headerName: "Notes",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      field: "active",
      headerName: "Status",
      sortable: true,
      filter: true,
      width: 120,
      cellRenderer: PriceTierActiveToggleRenderer,
    },
    {
      headerName: "Actions",
      cellRenderer: PriceTierActionsRenderer,
      width: 100,
      pinned: "right",
    },
  ];

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
        {/* Header with Back Button */}
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
          <div className={`px-4 py-2 rounded-full text-white text-sm font-semibold ${hatData?.is_active ? "bg-green-500" : "bg-gray-400"
            }`}>
            {hatData?.is_active ? "Active" : "Inactive"}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information Card */}
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
                  <p className="text-lg text-gray-800 mt-1">{hatData?.internal_style_code || "N/A"}</p>
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

            {/* Tabs Section - Full Width */}
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
                  {/* Product Variants Content */}
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
                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${variant.is_active
                                        ? "bg-green-100 text-green-700"
                                        : "bg-gray-100 text-gray-700"
                                      }`}
                                  >
                                    {variant.is_active ? "Active" : "Inactive"}
                                  </span>

                                  <button
                                    onClick={() => {
                                      setSelectedVariantData(variant);
                                      setOpenEditVariantModal(true);
                                    }}
                                    className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-semibold flex justify-center items-center gap-1 rounded-md transition-colors"
                                    title="Edit Variant"
                                  >
                                    <FaEdit size={12} />
                                    Edit
                                  </button>
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
                                      src={"https://arsalaanrasulshowmeropi.bestworks.cloud"+variant.primary_image_url}
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
                                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Size</th>
                                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Variant Size Name</th>
                                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Supplier SKU</th>
                                       
                                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Inventory</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {(sizesByColor?.[variant.id] || []).map((size) => (
                                        <tr
                                          key={size.id}
                                          className="border-b border-gray-100 hover:bg-gray-50"
                                        >
                                          <td className="px-4 py-3">
                                            <span className="inline-flex items-center gap-2">
                                              <FaRuler className="w-3 h-3 text-gray-400" />
                                              <span className="font-medium text-gray-800">{size.size_label || "N/A"}</span>
                                            </span>
                                          </td>
                                          <td className="px-4 py-3 text-gray-700">{size.variant_name || "N/A"}</td>
                                          <td className="px-4 py-3">
                                            {size.supplier_sku ? (
                                              <span className="inline-flex items-center gap-1">
                                                <FaBarcode className="w-3 h-3 text-gray-400" />
                                                <span className="font-mono text-xs">{size.supplier_sku}</span>
                                              </span>
                                            ) : (
                                              "N/A"
                                            )}
                                          </td>
                                     
                                          <td className="px-4 py-3">
                                            {size.inventory && size.inventory.length > 0 ? (
                                              <div className="flex items-center gap-2">
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
                                                <button
                                                  onClick={() => {
                                                    setSelectedInventoryData(size.inventory[0]);
                                                    setSelectedVariantSizeId(size.id);
                                                    setOpenEditInventoryModal(true);
                                                  }}
                                                  className="p-1.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full transition-colors"
                                                  title="Edit Inventory"
                                                >
                                                  <FaEdit size={12} />
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
                                      ))}
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
                <Tabs.Item
                  active={activeTab === 1}
                  title={
                    <div className="flex items-center gap-2">
                      <FaDollarSign className="w-4 h-4" />
                      <span>Price Tier</span>
                    </div>
                  }
                  onClick={() => setActiveTab(1)}
                >
                  {/* Price Tier Content */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                        <FaDollarSign className="w-5 h-5 text-[#f20c32]" />
                        Price Tier ({priceTierData.length})
                      </h2>
                      <Button
                        onClick={handleAddPriceTier}
                        className="bg-[#f20c32] hover:bg-black px-4 py-1 text-white text-sm font-semibold flex justify-center items-center gap-2 rounded-md"
                      >
                        <FaPlus className="w-4 h-4" />
                        Add Price Tier
                      </Button>
                    </div>

                    {/* AG Grid Table */}
                    <div
                      className="ag-theme-alpine"
                      style={{ height: 400, width: "100%" }}
                    >
                      <AgGridReact
                        rowData={priceTierData}
                        columnDefs={priceTierColumnDefs}
                        pagination={true}
                        paginationPageSize={10}
                        domLayout="autoHeight"
                        paginationPageSizeSelector={[10, 20, 50, 100]}
                        getRowHeight={() => 50}
                      />
                    </div>
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
                {/* <Button
                  onClick={() => setOpenAddHatImagesModal(true)}
                  className="bg-[#f20c32] hover:bg-black px-3 py-1 text-white text-xs font-semibold flex justify-center items-center gap-1 rounded-md"
                >
                  <FaPlus className="w-3 h-3" />
                  Add more images
                </Button> */}
             

              </div>

              {/* Primary Image */}
              {hatData.images ? (
                <div className="relative mb-4">
                  <img
                    src={hatData.images}
                    alt={hatData.hatName || "Hat"}
                    className="w-full h-auto rounded-lg border border-gray-200 object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      if (e.target.nextSibling) {
                        e.target.nextSibling.style.display = "flex";
                      }
                    }}
                  />
                  <div
                    className="hidden items-center justify-center w-full h-64 bg-gray-100 rounded-lg border border-gray-200"
                    style={{ display: "none" }}
                  >
                    <div className="text-center text-gray-400">
                      <FaImage className="w-12 h-12 mx-auto mb-2" />
                      <p>Image not available</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center w-full h-64 bg-gray-100 rounded-lg border border-gray-200 mb-4">
                  <div className="text-center text-gray-400">
                    <FaImage className="w-12 h-12 mx-auto mb-2" />
                    <p>No image available</p>
                  </div>
                </div>
              )}
                 <FileInput
                 accept="image/*"
                onChange={handleImageUpload}
                 />

              {/* Multi Images Grid */}
              {/* {hatData.hatImages && hatData.hatImages.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Additional Images ({hatData.hatImages.length})
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {hatData.hatImages.map((imageItem, index) => (
                      <div
                        key={imageItem.id || index}
                        className="relative group border border-gray-200 rounded-lg overflow-hidden aspect-square"
                      >
                     
                        <button
                          onClick={() => handleMultiEdit(imageItem.id)}
                          className="absolute top-1 right-9 bg-white p-1 rounded-full shadow"
                        >
                          <FaEdit className="text-blue-600 w-4 h-4" />
                        </button>
                       
                        <button
                          onClick={() => handleMultiImageDelete(imageItem.id)}
                          className="absolute top-1 right-1 bg-white p-1 rounded-full shadow"
                        >
                          <FaTrash className="text-red-500 w-4 h-4" />
                        </button>

                    
                        <img
                          src={imageItem.imageUrls || ""}
                          alt={`Hat image ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = "none";
                            if (e.target.nextSibling) {
                              e.target.nextSibling.style.display = "flex";
                            }
                          }}
                        />

                       
                        <div
                          className="hidden items-center justify-center w-full h-full bg-gray-100"
                          style={{ display: "none" }}
                        >
                          <FaImage className="w-6 h-6 text-gray-400" />
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )} */}
            </div>
          </div>
        </div>
      </div>

      {/* Add Variant Modal */}
      {openAddVariantModal && (
        <AddVariantModal
          openModal={openAddVariantModal}
          setOpenModal={setOpenAddVariantModal}
          onVariantAdded={fetchHatDetails}
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
          onVariantAdded={fetchHatDetails}
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
          onSizeAdded={fetchHatDetails}
          colorId={selectedVariantId}
          isEdit={false}
        />
      )}

      {/* Add Price Tier Modal */}
      {openAddPriceTierModal && (
        <AddPriceTierModal
          openModal={openAddPriceTierModal}
          setOpenModal={setOpenAddPriceTierModal}
          onPriceTierAdded={fetchHatColor}
          priceTierData={null}
          isEdit={false}
          hatId={id}
        />
      )}

      {/* Edit Price Tier Modal */}
      {openEditPriceTierModal && selectedPriceTierData && (
        <AddPriceTierModal
          openModal={openEditPriceTierModal}
          setOpenModal={setOpenEditPriceTierModal}
          onPriceTierAdded={fetchHatColor}
          priceTierData={selectedPriceTierData}
          isEdit={true}
          hatId={id}
        />
      )}

      {/* View Inventory Modal */}
      {openViewInventoryModal && selectedVariantSizeId && (
        <ViewInventoryModal
          openModal={openViewInventoryModal}
          setOpenModal={setOpenViewInventoryModal}
          variantSizeId={selectedVariantSizeId}
          onInventoryUpdated={fetchHatDetails}
        />
      )}

      {/* Add Inventory Modal */}
      {openAddInventoryModal && selectedVariantSizeId && (
        <AddVariantSizeInventoryModal
          openModal={openAddInventoryModal}
          setOpenModal={setOpenAddInventoryModal}
          onInventoryAdded={fetchHatDetails}
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
          onInventoryAdded={fetchHatDetails}
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
            const payload = {
              inventory_id: selectedInventoryData.inventoryId || selectedInventoryData.id,
            };
            dispatch(inventoryDelete(payload))
              .unwrap()
              .then((response) => {
                console.log("Inventory deleted successfully:", response);
                toast.success("Inventory deleted successfully!");
                fetchHatDetails();
                setOpenDeleteInventoryModal(false);
                setSelectedInventoryData(null);
              })
              .catch((error) => {
                console.error("Error deleting inventory:", error);
                toast.error("Failed to delete inventory. Please try again.");
              });
          }}
          brandName="this inventory"
          itemType="inventory"
        />
      )}

      {/* Add Hat Images Modal */}
      {openAddHatImagesModal && (
        <AddHatImagesModal
          openModal={openAddHatImagesModal}
          setOpenModal={setOpenAddHatImagesModal}
          hatId={id}
          onImagesAdded={fetchHatDetails}
        />
      )}

      {/* Edit Hat Image Modal */}
      {openEditHatImageModal && selectedImageData && (
        <EditHatImageModal
          openModal={openEditHatImageModal}
          setOpenModal={setOpenEditHatImageModal}
          imageData={selectedImageData}
          onImageUpdated={fetchHatDetails}
        />
      )}
    </div>
  );
};
