import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "flowbite-react";
import { toast } from "react-toastify";
import {
  FaArrowLeft,
  FaTag,
  FaCheckCircle,
  FaTimesCircle,
  FaDollarSign,
  FaPlus,
} from "react-icons/fa";

import Loader from "../../../components/Loader";
import DecorationAddonPriceAddModal from "./DecorationAddonPriceAddModal";

// ✅ adjust import path/action names as per your project
import {
  decorationaddonSingle,
  decorationaddonPriceSingle,
} from "../../../Reducer/ManageDecorationNewSlice";

const DecorationAddonDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ store: decaddon (as you mentioned)
  const { decorationaddonSingleData, decorationaddonPriceSingleData, loading } = useSelector(
    (state) => state.decaddon
  );

  const [openAddPriceTierModal, setOpenAddPriceTierModal] = useState(false);

  const fetchAddonDetails = useCallback(() => {
    if (!id) return;

    dispatch(decorationaddonSingle(id))
      .unwrap()
      .then((res) => console.log("decorationaddonSingle:", res))
      .catch((err) => {
        console.error("decorationaddonSingle error:", err);
        toast.error("Failed to fetch decoration addon details.");
      });
  }, [dispatch, id]);

  const fetchPriceTiers = useCallback(() => {
    if (!id) return;

    // ✅ send id from params as payload (as requested)
    dispatch(decorationaddonPriceSingle(id))
      .unwrap()
      .then((res) => console.log("decorationaddonPriceSingle:", res))
      .catch((err) => {
        console.error("decorationaddonPriceSingle error:", err);
        toast.error("Failed to fetch price tiers.");
      });
  }, [dispatch, id]);

  useEffect(() => {
    fetchAddonDetails();
    fetchPriceTiers();
  }, [fetchAddonDetails, fetchPriceTiers]);

  // addon object
  const addon = useMemo(() => {
    const d = decorationaddonSingleData?.data;
    if (Array.isArray(d)) return d?.[0] || null;
    return d || null;
  }, [decorationaddonSingleData]);

  // tiers array
  const tiers = useMemo(() => {
    const d = decorationaddonPriceSingleData?.data;
    return Array.isArray(d) ? d : [];
  }, [decorationaddonPriceSingleData]);

  const handleAddPriceTier = () => setOpenAddPriceTierModal(true);

  if (loading) {
    return (
      <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-white">
        <div className="h-full lg:h-screen flex items-center justify-center">
          <Loader size="large" text="Loading Decoration Addon Details..." />
        </div>
      </div>
    );
  }

  if (!addon) {
    return (
      <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-white">
        <div className="h-full lg:h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 text-lg">Decoration addon not found</p>
            <button
              onClick={() => navigate("/decoration-addon")}
              className="mt-4 px-4 py-2 bg-[#f20c32] hover:bg-black text-white rounded-lg"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isActive = addon?.is_active === 1 || addon?.is_active === true;

  return (
    <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-white">
      <div className="h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Back"
            >
              <FaArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-3xl font-bold text-gray-800">Decoration Addon Details</h1>
          </div>

          {/* <div
            className={`px-4 py-2 rounded-full text-white text-sm font-semibold ${
              isActive ? "bg-green-500" : "bg-gray-400"
            }`}
          >
            {isActive ? "Active" : "Inactive"}
          </div> */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left - Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaTag className="w-5 h-5 text-[#f20c32]" />
                Basic Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600">Name</label>
                  <p className="text-lg text-gray-800 mt-1">{addon?.name || "N/A"}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600">Code</label>
                  <p className="text-lg text-gray-800 mt-1">{addon?.code || "N/A"}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600">Type</label>
                  <p className="text-lg text-gray-800 mt-1">{addon?.type || "N/A"}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600">Description</label>
                  <p className="text-lg text-gray-800 mt-1">{addon?.description || "—"}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600">Addon ID</label>
                  <p className="text-sm text-gray-500 mt-1 font-mono">{addon?.id || id}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600">Status</label>
                  <div className="mt-2 flex items-center gap-2">
                    {isActive ? (
                      <>
                        <FaCheckCircle className="text-green-500" />
                        <span className="text-sm font-semibold text-green-600">Active</span>
                      </>
                    ) : (
                      <>
                        <FaTimesCircle className="text-gray-500" />
                        <span className="text-sm font-semibold text-gray-600">Inactive</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Price Tier Cards Area */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm w-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <FaDollarSign className="w-5 h-5 text-[#f20c32]" />
                  Price Tier ({tiers?.length || 0})
                </h2>

                <Button
                  onClick={handleAddPriceTier}
                  className="bg-[#f20c32] hover:bg-black px-4 py-1 text-white text-sm font-semibold flex justify-center items-center gap-2 rounded-md"
                >
                  <FaPlus className="w-4 h-4" />
                  Add Price Tier
                </Button>
              </div>

              {tiers?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tiers.map((t) => {
                    const active = t?.is_active === 1 || t?.is_active === true;
                    return (
                      <div
                        key={t?.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-semibold text-gray-500">
                                Tier ID: <span className="font-mono">{t?.id}</span>
                              </span>

                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {active ? "Active" : "Inactive"}
                              </span>
                            </div>

                            {/* Highlight min/max */}
                            <div className="mt-3 flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-semibold text-gray-600">Qty Range:</span>

                              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                                Min: {t?.min_qty}
                              </span>

                              <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-100">
                                Max: {t?.max_qty}
                              </span>
                            </div>

                            <div className="mt-3">
                              <label className="text-xs font-semibold text-gray-500">Unit Price</label>
                              <p className="text-lg font-bold text-gray-900">${t?.unit_price || "0.00"}</p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
                          <div className="flex items-center justify-between">
                            <span>
                              <strong>Created:</strong>{" "}
                              {t?.created_at
                                ? new Date(t.created_at).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })
                                : "N/A"}
                            </span>
                            <span>
                              <strong>Updated:</strong>{" "}
                              {t?.updated_at
                                ? new Date(t.updated_at).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })
                                : "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded">
                  <FaDollarSign className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                  <p>No price tiers added yet</p>
                  <button
                    onClick={handleAddPriceTier}
                    className="mt-3 px-4 py-2 bg-[#f20c32] hover:bg-black text-white rounded-lg text-sm font-semibold"
                  >
                    Add your first price tier
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Quick Summary Card (similar vibe to HatDetails right side) */}
          {/* <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm sticky top-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Summary</h2>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 font-semibold">Addon</span>
                  <span className="text-sm text-gray-900 font-bold">{addon?.name || "—"}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 font-semibold">Code</span>
                  <span className="text-sm text-gray-900 font-mono">{addon?.code || "—"}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 font-semibold">Total Tiers</span>
                  <span className="text-sm text-gray-900 font-bold">{tiers?.length || 0}</span>
                </div>

                <div className="pt-3 border-t border-gray-100">
                  <button
                    onClick={handleAddPriceTier}
                    className="w-full px-4 py-2 bg-[#f20c32] hover:bg-black text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
                  >
                    <FaPlus className="w-4 h-4" />
                    Add Price Tier
                  </button>
                </div>
              </div>
            </div>
          </div> */}
        </div>

        {/* Add Price Tier Modal */}
        {openAddPriceTierModal && (
          <DecorationAddonPriceAddModal
            openModal={openAddPriceTierModal}
            setOpenModal={setOpenAddPriceTierModal}
            decorationAddonId={id}
          />
        )}
      </div>
    </div>
  );
};

export default DecorationAddonDetails;
