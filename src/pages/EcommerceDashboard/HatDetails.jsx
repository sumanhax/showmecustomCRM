import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { hatDetails, supplierList } from "../../Reducer/EcommerceSlice";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import { Button } from "flowbite-react";
import { FaArrowLeft, FaImage, FaTag, FaCheckCircle, FaTimesCircle, FaPalette, FaRuler, FaBarcode, FaBox, FaPlus, FaEdit } from "react-icons/fa";
import AddVariantModal from "./AddVariantModal";
import AddVariantSizeModal from "./AddVariantSizeModal";

export const HatDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { hatDetailsData, loading, supplierListData } = useSelector((state) => state.ecom);
  
  const [hatData, setHatData] = useState(null);
  const [supplierName, setSupplierName] = useState("");
  const [openAddVariantModal, setOpenAddVariantModal] = useState(false);
  const [openEditVariantModal, setOpenEditVariantModal] = useState(false);
  const [openAddSizeModal, setOpenAddSizeModal] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [selectedVariantData, setSelectedVariantData] = useState(null);

  // Function to fetch hat details
  const fetchHatDetails = useCallback(() => {
    if (id) {
      dispatch(hatDetails(id))
        .unwrap()
        .then((response) => {
          console.log("Hat details:", response);
          if (response?.data) {
            setHatData(response.data);
          }
        })
        .catch((error) => {
          console.error("Error fetching hat details:", error);
          toast.error("Failed to fetch hat details.");
        });
    }
  }, [id, dispatch]);

  useEffect(() => {
    fetchHatDetails();
  }, [fetchHatDetails]);

  // Fetch suppliers to get supplier name
  useEffect(() => {
    dispatch(supplierList())
      .unwrap()
      .catch((error) => {
        console.error("Error fetching suppliers:", error);
      });
  }, [dispatch]);

  // Get supplier name from supplierListData
  useEffect(() => {
    if (hatData?.supplier && hatData.supplier.length > 0 && supplierListData?.data) {
      const supplierId = hatData.supplier[0];
      const foundSupplier = supplierListData.data.find(
        (supp) => supp.id === supplierId
      );
      if (foundSupplier?.fields?.["Supplier Name"]) {
        setSupplierName(foundSupplier.fields["Supplier Name"]);
      }
    }
  }, [hatData, supplierListData]);

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
          <div className={`px-4 py-2 rounded-full text-white text-sm font-semibold ${
            hatData.active ? "bg-green-500" : "bg-gray-400"
          }`}>
            {hatData.active ? "Active" : "Inactive"}
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
                  <p className="text-lg text-gray-800 mt-1">{hatData.hatName || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Supplier Style Code</label>
                  <p className="text-lg text-gray-800 mt-1">{hatData.supplierStyleCode || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Supplier</label>
                  <p className="text-lg text-gray-800 mt-1">{supplierName || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Base Price</label>
                  <p className="text-lg text-gray-800 mt-1">{hatData.basePrice || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Min Order Quantity</label>
                  <p className="text-lg text-gray-800 mt-1">{hatData.minOrderQty || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Hat ID</label>
                  <p className="text-sm text-gray-500 mt-1 font-mono">{hatData.id || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Product Variants Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <FaPalette className="w-5 h-5 text-[#f20c32]" />
                  Product Variants ({hatData.productVariants?.length || 0})
                </h2>
                <Button
                  onClick={() => setOpenAddVariantModal(true)}
                  className="bg-[#f20c32] hover:bg-black px-4 py-1 text-white text-sm font-semibold flex justify-center items-center gap-2 rounded-md"
                >
                  <FaPlus className="w-4 h-4" />
                  Add Variants
                </Button>
              </div>
              
              {hatData.productVariants && hatData.productVariants.length > 0 ? (
                <div className="space-y-4">
                  {hatData.productVariants.map((variant, index) => (
                    <div
                      key={variant.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      {/* Variant Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-800">
                              Variant #{index + 1}: {variant.variantName || "Unnamed Variant"}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              variant.active
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                            }`}>
                              {variant.active ? "Active" : "Inactive"}
                            </span>
                            <button
                              onClick={() => {
                                setSelectedVariantData(variant);
                                setOpenEditVariantModal(true);
                              }}
                              className="p-1.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full transition-colors"
                              title="Edit Variant"
                            >
                              <FaEdit size={12} />
                            </button>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <FaPalette className="w-4 h-4" />
                              <span>
                                <strong>Color:</strong> {variant.color || "N/A"}
                              </span>
                            </div>
                            {variant.colorCode && (
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-5 h-5 rounded border border-gray-300"
                                  style={{ backgroundColor: variant.colorCode }}
                                  title={variant.colorCode}
                                />
                                <span className="font-mono text-xs">{variant.colorCode}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Variant Sizes */}
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <FaRuler className="w-4 h-4" />
                            Variant Sizes ({variant.variantSizes?.length || 0})
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
                        
                        {variant.variantSizes && variant.variantSizes.length > 0 ? (
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Size</th>
                                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Variant Size Name</th>
                                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Supplier SKU</th>
                                  <th className="px-4 py-2 text-left font-semibold text-gray-700">UPC</th>
                                </tr>
                              </thead>
                              <tbody>
                                {variant.variantSizes.map((size) => (
                                  <tr
                                    key={size.id}
                                    className="border-b border-gray-100 hover:bg-gray-50"
                                  >
                                    <td className="px-4 py-3">
                                      <span className="inline-flex items-center gap-2">
                                        <FaRuler className="w-3 h-3 text-gray-400" />
                                        <span className="font-medium text-gray-800">{size.size || "N/A"}</span>
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-700">{size.variantSize || "N/A"}</td>
                                    <td className="px-4 py-3">
                                      {size.supplierSku ? (
                                        <span className="inline-flex items-center gap-1">
                                          <FaBarcode className="w-3 h-3 text-gray-400" />
                                          <span className="font-mono text-xs">{size.supplierSku}</span>
                                        </span>
                                      ) : (
                                        "N/A"
                                      )}
                                    </td>
                                    <td className="px-4 py-3">
                                      {size.upc ? (
                                        <span className="inline-flex items-center gap-1">
                                          <FaBox className="w-3 h-3 text-gray-400" />
                                          <span className="font-mono text-xs">{size.upc}</span>
                                        </span>
                                      ) : (
                                        "N/A"
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
                            No sizes available for this variant
                          </div>
                        )}
                      </div>

                      {/* Variant Metadata */}
                      <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
                        <div className="flex items-center justify-between">
                          <span>
                            <strong>Created:</strong>{" "}
                            {variant.createdAt
                              ? new Date(variant.createdAt).toLocaleDateString("en-US", {
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
                            {variant.updatedAt
                              ? new Date(variant.updatedAt).toLocaleDateString("en-US", {
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
          </div>

          {/* Right Column - Image */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm sticky top-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaImage className="w-5 h-5 text-[#f20c32]" />
                Hat Image
              </h2>
              {hatData.images ? (
                <div className="relative">
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
                <div className="flex items-center justify-center w-full h-64 bg-gray-100 rounded-lg border border-gray-200">
                  <div className="text-center text-gray-400">
                    <FaImage className="w-12 h-12 mx-auto mb-2" />
                    <p>No image available</p>
                  </div>
                </div>
              )}
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
          variantId={selectedVariantId}
        />
      )}
    </div>
  );
};
