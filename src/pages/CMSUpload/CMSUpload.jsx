import { useState, useRef } from 'react';
import { MdCloudUpload, MdDelete, MdImage, MdCheckCircle } from 'react-icons/md';
import { FiUploadCloud } from 'react-icons/fi';

// ─── Reusable Single Image Upload Box ────────────────────────
const SingleImageUpload = ({ label, description, preview, onFileChange, onRemove }) => {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFileChange(file);
  };

  return (
    <div className="flex flex-col gap-2">
      {label && <p className="text-sm font-semibold text-gray-700">{label}</p>}
      {description && <p className="text-xs text-gray-400 -mt-1">{description}</p>}

      {preview ? (
        <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-sm group">
          <img src={preview} alt="preview" className="w-full h-48 object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              onClick={() => inputRef.current.click()}
              className="bg-white text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-gray-100 transition"
            >
              Change
            </button>
            <button
              onClick={onRemove}
              className="bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-red-600 transition"
            >
              Remove
            </button>
          </div>
          <div className="absolute top-2 right-2 bg-green-500 rounded-full p-0.5">
            <MdCheckCircle className="text-white text-base" />
          </div>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-xl h-48 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
            dragging
              ? 'border-[#ed1c24] bg-red-50'
              : 'border-gray-200 hover:border-[#ed1c24] hover:bg-red-50/30'
          }`}
          onClick={() => inputRef.current.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <FiUploadCloud
            className={`text-4xl mb-2 transition-colors ${dragging ? 'text-[#ed1c24]' : 'text-gray-300'}`}
          />
          <p className="text-sm font-medium text-gray-500">
            Drag & drop or <span className="text-[#ed1c24] font-semibold">browse</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG up to 5MB</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpg,image/jpeg"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) onFileChange(file);
        }}
      />
    </div>
  );
};

// ─── Main CMSUpload Page ──────────────────────────────────────
const CMSUpload = () => {
  const [bannerPreview, setBannerPreview] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);

  const [logoSlot1, setLogoSlot1] = useState({ preview: null, file: null });
  const [logoSlot2, setLogoSlot2] = useState({ preview: null, file: null });
  const [logoSlot3, setLogoSlot3] = useState({ preview: null, file: null });

  const [activeTab, setActiveTab] = useState('banner');

  const handleBannerChange = (file) => {
    setBannerFile(file);
    setBannerPreview(URL.createObjectURL(file));
  };

  const handleLogoChange = (slot, file) => {
    const preview = URL.createObjectURL(file);
    if (slot === 1) setLogoSlot1({ preview, file });
    else if (slot === 2) setLogoSlot2({ preview, file });
    else if (slot === 3) setLogoSlot3({ preview, file });
  };

  const handleSubmit = () => {
    alert('Upload successful! (Static demo)');
  };

  const tabs = [
    { id: 'banner', label: 'Banner Image', icon: <MdImage /> },
    { id: 'logo', label: 'Logo Placement', icon: <MdCloudUpload /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 rounded-lg">

      {/* Page Title */}
      <div className="max-w-5xl mx-auto px-4 lg:px-0 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">CMS Upload</h1>
      </div>

      <div className="max-w-5xl mx-auto px-4 lg:px-0 pb-20">

        {/* Tab Switcher */}
        <div className="flex gap-3 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-[#ed1c24] text-white shadow-md shadow-red-200'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-[#ed1c24] hover:text-[#ed1c24]'
              }`}
            >
              <span className="text-base">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── BANNER TAB ── */}
        {activeTab === 'banner' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-bold text-gray-900">Banner Image Upload</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Upload the main banner shown on your homepage or product listing pages
                </p>
              </div>
              {bannerPreview && (
                <span className="text-xs font-medium bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full">
                  ✓ Image Ready
                </span>
              )}
            </div>

            <SingleImageUpload
              label="Banner Image"
              description="Upload your site banner (PNG, JPG, JPEG)"
              preview={bannerPreview}
              onFileChange={handleBannerChange}
              onRemove={() => { setBannerPreview(null); setBannerFile(null); }}
            />

            {bannerPreview && (
              <div className="mt-6">
                <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Live Preview</p>
                <div className="rounded-xl overflow-hidden border border-gray-100 shadow-inner">
                  <img src={bannerPreview} alt="banner preview" className="w-full h-40 object-cover" />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
              <button
                onClick={() => { setBannerPreview(null); setBannerFile(null); }}
                className="flex items-center gap-2 text-sm font-semibold text-gray-500 border border-gray-200 px-5 py-2.5 rounded-full hover:border-red-300 hover:text-red-500 transition-colors"
              >
                <MdDelete className="text-base" /> Clear
              </button>
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 bg-[#ed1c24] hover:bg-black transition-colors duration-200 text-white text-sm font-semibold px-6 py-2.5 rounded-full"
              >
                <MdCloudUpload className="text-base" /> Upload Banner
              </button>
            </div>
          </div>
        )}

        {/* ── LOGO PLACEMENT TAB ── */}
        {activeTab === 'logo' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-bold text-gray-900">Logo Placement Images</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Upload logo images for Right Eye, Centered, and Left Eye placements
                </p>
              </div>
              <span className="text-xs font-medium bg-gray-50 text-gray-500 border border-gray-200 px-3 py-1 rounded-full">
                {[logoSlot1, logoSlot2, logoSlot3].filter(s => s.preview).length} / 3 uploaded
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

              {/* Slot 1 — Right Eye */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-[#ed1c24] text-white flex items-center justify-center text-xs font-bold shrink-0">
                    1
                  </div>
                  <p className="text-sm font-semibold text-gray-700">Right Eye</p>
                </div>
                <SingleImageUpload
                  description="Logo placed on the right eye position"
                  preview={logoSlot1.preview}
                  onFileChange={(file) => handleLogoChange(1, file)}
                  onRemove={() => setLogoSlot1({ preview: null, file: null })}
                />
              </div>

              {/* Slot 2 — Centered */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-[#ed1c24] text-white flex items-center justify-center text-xs font-bold shrink-0">
                    2
                  </div>
                  <p className="text-sm font-semibold text-gray-700">Centered</p>
                </div>
                <SingleImageUpload
                  description="Logo placed at the center position"
                  preview={logoSlot2.preview}
                  onFileChange={(file) => handleLogoChange(2, file)}
                  onRemove={() => setLogoSlot2({ preview: null, file: null })}
                />
              </div>

              {/* Slot 3 — Left Eye */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-[#ed1c24] text-white flex items-center justify-center text-xs font-bold shrink-0">
                    3
                  </div>
                  <p className="text-sm font-semibold text-gray-700">Left Eye</p>
                </div>
                <SingleImageUpload
                  description="Logo placed on the left eye position"
                  preview={logoSlot3.preview}
                  onFileChange={(file) => handleLogoChange(3, file)}
                  onRemove={() => setLogoSlot3({ preview: null, file: null })}
                />
              </div>

            </div>

            {/* Uploaded badges */}
            {[logoSlot1, logoSlot2, logoSlot3].some(s => s.preview) && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">Uploaded</p>
                <div className="flex flex-wrap gap-3">
                  {[
                    { slot: logoSlot1, name: 'Right Eye' },
                    { slot: logoSlot2, name: 'Centered' },
                    { slot: logoSlot3, name: 'Left Eye' },
                  ]
                    .filter(({ slot }) => slot.preview)
                    .map(({ slot, name }) => (
                      <div
                        key={name}
                        className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-full px-3 py-1.5"
                      >
                        <img src={slot.preview} alt={name} className="w-5 h-5 rounded-full object-cover" />
                        <span className="text-xs font-medium text-green-700">{name}</span>
                        <MdCheckCircle className="text-green-500 text-base" />
                      </div>
                    ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
              <button
                onClick={() => {
                  setLogoSlot1({ preview: null, file: null });
                  setLogoSlot2({ preview: null, file: null });
                  setLogoSlot3({ preview: null, file: null });
                }}
                className="flex items-center gap-2 text-sm font-semibold text-gray-500 border border-gray-200 px-5 py-2.5 rounded-full hover:border-red-300 hover:text-red-500 transition-colors"
              >
                <MdDelete className="text-base" /> Clear All
              </button>
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 bg-[#ed1c24] hover:bg-black transition-colors duration-200 text-white text-sm font-semibold px-6 py-2.5 rounded-full"
              >
                <MdCloudUpload className="text-base" /> Upload Logos
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CMSUpload;