import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { bulkUpload, resetBulkUploadState } from "../../Reducer/BulkUploadSlice";

const BulkUpload = () => {
  const dispatch = useDispatch();
  const { loading, success, error, bulkUploadData } = useSelector(
    (state) => state.bulkUpload
  );

  const [file, setFile] = useState(null);
  const [localError, setLocalError] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setLocalError("");
  };

  const handleUpload = () => {
    if (!file) {
      setLocalError("Please select a file before uploading");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    dispatch(bulkUpload(formData));
  };

  useEffect(() => {
    if (success || error) {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setFile(null);

      const timer = setTimeout(() => {
        dispatch(resetBulkUploadState());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [success, error, dispatch]);

  return (
    <div className="bg-white border rounded-lg p-5 w-full max-w-md">
      <h2 className="text-lg font-semibold mb-4">Bulk Upload</h2>

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={handleFileChange}
        className="mb-2 block w-full text-sm"
      />

      {localError && (
        <p className="text-red-600 text-sm mb-2">{localError}</p>
      )}

      {error && (
        <p className="text-red-600 text-sm mb-2">
          {error?.message || "Bulk upload failed"}
        </p>
      )}

      {success && (
        <p className="text-green-600 text-sm mb-2">
          {bulkUploadData?.message || "Bulk upload successful"}
        </p>
      )}

      <button
        onClick={handleUpload}
        disabled={loading}
        style={!loading ? { backgroundColor: "#f20c32" } : {}}
        className={`px-4 py-2 rounded text-white text-sm
          ${loading ? "bg-gray-400 cursor-not-allowed" : "hover:bg-[#d10a2a]"}
        `}
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
};

export default BulkUpload;
