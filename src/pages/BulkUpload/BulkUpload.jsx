import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { bulkUpload, resetBulkUploadState } from "../../Reducer/BulkUploadSlice";
import { FiDownload } from "react-icons/fi";


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
    <div className="bg-white border rounded-lg p-5 w-full">
      <h2 className="text-lg font-semibold mb-4">Bulk Upload</h2>

      {/* Sub text */}
      <p className="text-xs text-gray-500 mb-2">
        Upload CSV/XLS file using the provided format.
      </p>

      {/* Sample CSV Download */}
      <a
        href="https://showmecustomheadwear.bestworks.cloud/exp.csv"
        download
        target="_blank"
        rel="noopener noreferrer"
        className="
        mb-4 inline-flex items-center gap-2
        px-3 py-2
        text-sm font-medium
        text-blue-600
        border border-blue-200
        rounded-md
        hover:bg-blue-50 hover:border-blue-300
        transition
      "
      >
        <FiDownload size={16} />
        Download Sample CSV
      </a>

      {/* <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={handleFileChange}
        className="mb-2 block w-full text-sm"
      /> */}
      <div className="mb-3">
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileChange}
          className="hidden"
          id="bulk-upload-file"
        />

        <label
          htmlFor="bulk-upload-file"
          className="
            flex cursor-pointer items-center justify-between
            rounded-md border border-gray-300
            px-3 py-2
            text-sm
            hover:border-gray-400
            transition
          "
        >
          <span className="text-gray-600">
            {file ? file.name : "Upload CSV or Excel file"}
          </span>

          <span className="ml-3 rounded bg-gray-100 px-3 py-1 text-xs text-gray-700">
            Browse
          </span>
        </label>
      </div>


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
