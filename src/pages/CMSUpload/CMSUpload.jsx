import { useState, useRef, useCallback } from 'react';
import { MdCloudUpload, MdDelete, MdImage, MdCheckCircle, MdRotateRight, MdRotateLeft, MdCrop } from 'react-icons/md';
import { FiUploadCloud } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { bannerUpload, createLogoPlacement } from '../../Reducer/DashBoardSlice';
import { toast } from 'react-toastify';

// ─── Image Editor Modal ────────────────────────────────────────
const ImageEditorModal = ({ file, onSave, onCancel }) => {
  const canvasRef = useRef(null);
  const [rotation, setRotation] = useState(0);
  const [crop, setCrop] = useState({ x: 0, y: 0, w: 100, h: 100 }); // percent
  const [imgSrc] = useState(() => URL.createObjectURL(file));
  const imgRef = useRef(null);
  const [dragging, setDragging] = useState(null);
  const [cropStart, setCropStart] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const containerRef = useRef(null);

  const rotate = (deg) => setRotation((prev) => (prev + deg + 360) % 360);

  const handleMouseDown = (e) => {
    if (!isCropping) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setCropStart({ x, y });
    setCrop({ x, y, w: 0, h: 0 });
  };

  const handleMouseMove = (e) => {
    if (!isCropping || !cropStart) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setCrop({
      x: Math.min(cropStart.x, x),
      y: Math.min(cropStart.y, y),
      w: Math.abs(x - cropStart.x),
      h: Math.abs(y - cropStart.y),
    });
  };

  const handleMouseUp = () => setCropStart(null);

  const handleSave = () => {
    const img = imgRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const naturalW = img.naturalWidth;
    const naturalH = img.naturalHeight;

    const rad = (rotation * Math.PI) / 180;
    const sin = Math.abs(Math.sin(rad));
    const cos = Math.abs(Math.cos(rad));
    const rotW = naturalW * cos + naturalH * sin;
    const rotH = naturalW * sin + naturalH * cos;

    // temp canvas for rotation
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = rotW;
    tempCanvas.height = rotH;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.translate(rotW / 2, rotH / 2);
    tempCtx.rotate(rad);
    tempCtx.drawImage(img, -naturalW / 2, -naturalH / 2);

    // crop from rotated
    const cropX = (crop.x / 100) * rotW;
    const cropY = (crop.y / 100) * rotH;
    const cropW = (crop.w / 100) * rotW || rotW;
    const cropH = (crop.h / 100) * rotH || rotH;

    canvas.width = cropW;
    canvas.height = cropH;
    ctx.drawImage(tempCanvas, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

    canvas.toBlob((blob) => {
      const editedFile = new File([blob], file.name, { type: file.type });
      onSave(editedFile, URL.createObjectURL(blob));
    }, file.type);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-bold text-gray-900">Edit Image</h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 text-xl font-bold">✕</button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2 px-6 py-3 bg-gray-50 border-b border-gray-100">
          <button
            onClick={() => rotate(-90)}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 border border-gray-200 bg-white px-3 py-1.5 rounded-full hover:border-[#ed1c24] hover:text-[#ed1c24] transition-colors"
          >
            <MdRotateLeft className="text-base" /> Rotate Left
          </button>
          <button
            onClick={() => rotate(90)}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 border border-gray-200 bg-white px-3 py-1.5 rounded-full hover:border-[#ed1c24] hover:text-[#ed1c24] transition-colors"
          >
            <MdRotateRight className="text-base" /> Rotate Right
          </button>
          <button
            onClick={() => { setIsCropping(!isCropping); if (isCropping) setCrop({ x: 0, y: 0, w: 100, h: 100 }); }}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
              isCropping
                ? 'bg-[#ed1c24] text-white border-[#ed1c24]'
                : 'text-gray-600 border-gray-200 bg-white hover:border-[#ed1c24] hover:text-[#ed1c24]'
            }`}
          >
            <MdCrop className="text-base" /> {isCropping ? 'Cropping...' : 'Crop'}
          </button>
          {isCropping && (
            <span className="text-xs text-gray-400 italic">Draw a selection on the image</span>
          )}
        </div>

        {/* Canvas / Image Area */}
        <div className="p-6">
          <div
            ref={containerRef}
            className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-100 select-none"
            style={{ height: 320, cursor: isCropping ? 'crosshair' : 'default' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <img
              ref={imgRef}
              src={imgSrc}
              alt="edit"
              className="w-full h-full object-contain transition-transform duration-200"
              style={{ transform: `rotate(${rotation}deg)` }}
              draggable={false}
            />
            {/* Crop overlay */}
            {isCropping && crop.w > 0 && crop.h > 0 && (
              <>
                {/* dark overlay */}
                <div className="absolute inset-0 bg-black/40 pointer-events-none" />
                {/* crop box */}
                <div
                  className="absolute border-2 border-white shadow-lg pointer-events-none"
                  style={{
                    left: `${crop.x}%`,
                    top: `${crop.y}%`,
                    width: `${crop.w}%`,
                    height: `${crop.h}%`,
                    background: 'transparent',
                    boxShadow: '0 0 0 9999px rgba(0,0,0,0.4)',
                  }}
                >
                  {/* rule of thirds grid */}
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
                    {[...Array(9)].map((_, i) => (
                      <div key={i} className="border border-white/20" />
                    ))}
                  </div>
                  {/* corner handles */}
                  {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos) => (
                    <div key={pos} className={`absolute w-3 h-3 bg-white rounded-sm -translate-x-0.5 -translate-y-0.5 ${pos}`} />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Rotation slider */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-gray-500">Fine Rotation</span>
              <span className="text-xs font-mono text-gray-400">{rotation}°</span>
            </div>
            <input
              type="range"
              min={0}
              max={359}
              value={rotation}
              onChange={(e) => setRotation(Number(e.target.value))}
              className="w-full accent-[#ed1c24]"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button
            onClick={onCancel}
            className="text-sm font-semibold text-gray-500 border border-gray-200 px-5 py-2.5 rounded-full hover:border-red-300 hover:text-red-500 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-[#ed1c24] hover:bg-black text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-colors"
          >
            <MdCheckCircle className="text-base" /> Apply & Use
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Reusable Single Image Upload Box ────────────────────────
const SingleImageUpload = ({ label, description, preview, onFileChange, onRemove }) => {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [editingFile, setEditingFile] = useState(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) setEditingFile(file);
  };

  const handleFileSelect = (file) => {
    if (file) setEditingFile(file);
  };

  return (
    <div className="flex flex-col gap-2">
      {label && <p className="text-sm font-semibold text-gray-700">{label}</p>}
      {description && <p className="text-xs text-gray-400 -mt-1">{description}</p>}

      {editingFile && (
        <ImageEditorModal
          file={editingFile}
          onSave={(editedFile, previewUrl) => {
            onFileChange(editedFile, previewUrl);
            setEditingFile(null);
          }}
          onCancel={() => setEditingFile(null)}
        />
      )}

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
            dragging ? 'border-[#ed1c24] bg-red-50' : 'border-gray-200 hover:border-[#ed1c24] hover:bg-red-50/30'
          }`}
          onClick={() => inputRef.current.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <FiUploadCloud className={`text-4xl mb-2 transition-colors ${dragging ? 'text-[#ed1c24]' : 'text-gray-300'}`} />
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
          if (file) handleFileSelect(file);
          e.target.value = '';
        }}
      />
    </div>
  );
};

// ─── Main CMSUpload Page ──────────────────────────────────────
const CMSUpload = () => {
  const dispatch = useDispatch();
  const { bannerLoading, logoPlacementLoading } = useSelector((state) => state.dash);

  const [bannerName, setBannerName] = useState('');
  const [bannerPreview, setBannerPreview] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);

  const [logoSlot1, setLogoSlot1] = useState({ preview: null, file: null, code: 'right' });
  const [logoSlot2, setLogoSlot2] = useState({ preview: null, file: null, code: 'center' });
  const [logoSlot3, setLogoSlot3] = useState({ preview: null, file: null, code: 'left' });

  const [activeTab, setActiveTab] = useState('banner');

  const handleBannerChange = (file, previewUrl) => {
    setBannerFile(file);
    setBannerPreview(previewUrl || URL.createObjectURL(file));
  };

  const handleLogoChange = (slot, file, previewUrl) => {
    const preview = previewUrl || URL.createObjectURL(file);
    if (slot === 1) setLogoSlot1((prev) => ({ ...prev, preview, file }));
    else if (slot === 2) setLogoSlot2((prev) => ({ ...prev, preview, file }));
    else if (slot === 3) setLogoSlot3((prev) => ({ ...prev, preview, file }));
  };

  const handleBannerSubmit = async () => {
    if (!bannerFile) return toast.error('Please select a banner image.');
    if (!bannerName.trim()) return toast.error('Please enter a banner name.');

    const formData = new FormData();
    formData.append('bannerName', bannerName);
    formData.append('file', bannerFile)

    const result = await dispatch(bannerUpload(formData));
    if (bannerUpload.fulfilled.match(result)) {
      toast.success('Banner uploaded successfully!');
      setBannerPreview(null);
      setBannerFile(null);
      setBannerName('');
    } else {
      toast.error(typeof result?.payload === 'string' ? result.payload : 'Banner upload failed.');
    }
  };

  const handleLogoSubmit = async () => {
    const slots = [logoSlot1, logoSlot2, logoSlot3];
    const filledSlots = slots.filter((s) => s.file);
    if (filledSlots.length === 0) return toast.error('Please upload at least one logo image.');

    let successCount = 0;
    for (const slot of filledSlots) {
      const formData = new FormData();
      formData.append('code', slot.code);
      formData.append('data', slot.file);
      formData.append('active', 'true');
      const result = await dispatch(createLogoPlacement(formData));
      if (createLogoPlacement.fulfilled.match(result)) successCount++;
    }

    if (successCount > 0) {
      toast.success(`${successCount} logo(s) uploaded successfully!`);
      setLogoSlot1({ preview: null, file: null, code: 'right' });
      setLogoSlot2({ preview: null, file: null, code: 'center' });
      setLogoSlot3({ preview: null, file: null, code: 'left' });
    } else {
      toast.error('Logo upload failed.');
    }
  };

  const tabs = [
    { id: 'banner', label: 'Banner Image', icon: <MdImage /> },
    { id: 'logo', label: 'Logo Placement', icon: <MdCloudUpload /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 rounded-lg">
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
            <div className="mb-5">
              <h2 className="text-base font-bold text-gray-900">Banner Image Upload</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Upload the main banner — you can crop and rotate before uploading
              </p>
            </div>

            <div className="mb-4">
              <label className="text-sm font-semibold text-gray-700 block mb-1">Banner Name</label>
              <input
                type="text"
                value={bannerName}
                onChange={(e) => setBannerName(e.target.value)}
                placeholder="Enter banner name..."
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#ed1c24] transition-colors"
              />
            </div>

            <SingleImageUpload
              preview={bannerPreview}
              onFileChange={handleBannerChange}
              onRemove={() => { setBannerPreview(null); setBannerFile(null); }}
            />

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
              <button
                onClick={() => { setBannerPreview(null); setBannerFile(null); setBannerName(''); }}
                className="flex items-center gap-2 text-sm font-semibold text-gray-500 border border-gray-200 px-5 py-2.5 rounded-full hover:border-red-300 hover:text-red-500 transition-colors"
              >
                <MdDelete className="text-base" /> Clear
              </button>
              <button
                onClick={handleBannerSubmit}
                disabled={bannerLoading}
                className="flex items-center gap-2 bg-[#ed1c24] hover:bg-black transition-colors duration-200 text-white text-sm font-semibold px-6 py-2.5 rounded-full disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <MdCloudUpload className="text-base" />
                {bannerLoading ? 'Uploading...' : 'Upload Banner'}
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
                  Upload logo images — crop and rotate each before uploading
                </p>
              </div>
              <span className="text-xs font-medium bg-gray-50 text-gray-500 border border-gray-200 px-3 py-1 rounded-full">
                {[logoSlot1, logoSlot2, logoSlot3].filter(s => s.preview).length} / 3 uploaded
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                { slot: logoSlot1, setSlot: setLogoSlot1, num: 1, label: 'Right Eye', code: 'right' },
                { slot: logoSlot2, setSlot: setLogoSlot2, num: 2, label: 'Centered', code: 'center' },
                { slot: logoSlot3, setSlot: setLogoSlot3, num: 3, label: 'Left Eye', code: 'left' },
              ].map(({ slot, setSlot, num, label, code }) => (
                <div key={code} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-[#ed1c24] text-white flex items-center justify-center text-xs font-bold shrink-0">
                      {num}
                    </div>
                    <p className="text-sm font-semibold text-gray-700">{label}</p>
                  </div>
                  <SingleImageUpload
                    description={`Crop & rotate for ${label.toLowerCase()} position`}
                    preview={slot.preview}
                    onFileChange={(file, previewUrl) => handleLogoChange(num, file, previewUrl)}
                    onRemove={() => setSlot({ preview: null, file: null, code })}
                  />
                </div>
              ))}
            </div>

            {[logoSlot1, logoSlot2, logoSlot3].some(s => s.preview) && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">Ready to Upload</p>
                <div className="flex flex-wrap gap-3">
                  {[
                    { slot: logoSlot1, name: 'Right Eye' },
                    { slot: logoSlot2, name: 'Centered' },
                    { slot: logoSlot3, name: 'Left Eye' },
                  ]
                    .filter(({ slot }) => slot.preview)
                    .map(({ slot, name }) => (
                      <div key={name} className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-full px-3 py-1.5">
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
                  setLogoSlot1({ preview: null, file: null, code: 'right' });
                  setLogoSlot2({ preview: null, file: null, code: 'center' });
                  setLogoSlot3({ preview: null, file: null, code: 'left' });
                }}
                className="flex items-center gap-2 text-sm font-semibold text-gray-500 border border-gray-200 px-5 py-2.5 rounded-full hover:border-red-300 hover:text-red-500 transition-colors"
              >
                <MdDelete className="text-base" /> Clear All
              </button>
              <button
                onClick={handleLogoSubmit}
                disabled={logoPlacementLoading}
                className="flex items-center gap-2 bg-[#ed1c24] hover:bg-black transition-colors duration-200 text-white text-sm font-semibold px-6 py-2.5 rounded-full disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <MdCloudUpload className="text-base" />
                {logoPlacementLoading ? 'Uploading...' : 'Upload Logos'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CMSUpload;