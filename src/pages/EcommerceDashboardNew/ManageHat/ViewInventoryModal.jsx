import { useEffect, useMemo } from "react";
import { Modal } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { FaWarehouse, FaBox, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { toast } from "react-toastify";

import { inventoryList } from "../../../Reducer/AddInvetoryNewSlice";

const ViewInventoryModal = ({ openModal, setOpenModal, variantSizeId, onRefreshInventory }) => {
  const dispatch = useDispatch();
  const { inventoryListData, loading } = useSelector((state) => state.invent);

  useEffect(() => {
    if (!openModal) return;

    dispatch(inventoryList({ page: 1, limit: 1000 }))
      .unwrap?.()
      .catch((err) => {
        console.error("inventoryList error:", err);
        toast.error("Failed to load inventory list");
      });
  }, [openModal, dispatch]);

  const rows = useMemo(() => {
    const list = inventoryListData?.data;
    if (!Array.isArray(list)) return [];
    return list.filter((x) => String(x?.hat_size_variant_id) === String(variantSizeId));
  }, [inventoryListData, variantSizeId]);

  return (
    <Modal
      show={openModal}
      onClose={() => setOpenModal(false)}
      size="4xl"
    >
      <Modal.Header>Inventory Details</Modal.Header>

      <Modal.Body>
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-600">
            Variant Size ID: <span className="font-mono">{variantSizeId}</span>
          </div>

          <button
            onClick={() => {
              onRefreshInventory?.();
              dispatch(inventoryList({ page: 1, limit: 1000 }));
            }}
            className="px-3 py-2 rounded-lg text-sm font-semibold bg-gray-100 hover:bg-gray-200"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="py-10 text-center text-gray-500">Loading...</div>
        ) : rows.length === 0 ? (
          <div className="py-10 text-center text-gray-500">
            No inventory found for this hat_size_variant_id
          </div>
        ) : (
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Status</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Warehouse</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Supplier SKU</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">On Hand</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Reserved</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Available</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Source</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((inv) => {
                  const active = inv?.status === "ACTIVE" || inv?.is_active === 1 || inv?.is_active === true;

                  return (
                    <tr key={inv?.id} className="border-b last:border-b-0 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
                            active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {active ? <FaCheckCircle /> : <FaTimesCircle />}
                          {inv?.status || (active ? "ACTIVE" : "INACTIVE")}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-2">
                          <FaWarehouse className="text-gray-400" />
                          <span className="font-mono text-xs">{inv?.warehouse_id || "—"}</span>
                        </span>
                      </td>

                      <td className="px-4 py-3 font-mono text-xs">{inv?.supplier_sku || "—"}</td>

                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-2">
                          <FaBox className="text-gray-400" />
                          <span className="font-semibold">{inv?.qty_on_hand ?? 0}</span>
                        </span>
                      </td>

                      <td className="px-4 py-3 font-semibold">{inv?.qty_reserved ?? 0}</td>
                      <td className="px-4 py-3 font-bold">{inv?.qty_available ?? 0}</td>
                      <td className="px-4 py-3">{inv?.source || "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ViewInventoryModal;
