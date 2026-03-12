import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createCoupon,
  getCouponList,
  getCouponByCode,
  resetCreateCoupon,
  resetCouponDetail,
  toggleCouponStatus,
} from "../../Reducer/NewCouponSlice";
import {
  FiPlus, FiTag, FiX, FiChevronRight, FiPercent,
  FiDollarSign, FiCalendar, FiUsers, FiSearch,
  FiClock, FiCheckCircle, FiXCircle, FiAlertCircle
} from "react-icons/fi";

// ─── Field Component — Modal এর বাইরে ────────────────────────────────────────
const Field = ({ label, name, required, children, hint, fieldErrors, duplicateCodeError }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
      {label} {required && <span className="text-[#f20c32]">*</span>}
    </label>
    {children}
    {fieldErrors?.[name] && (
      <p className="mt-1 text-xs text-[#f20c32] flex items-center gap-1">
        <FiAlertCircle size={11} /> {fieldErrors[name]}
      </p>
    )}
    {name === "code" && duplicateCodeError && !fieldErrors?.[name] && (
      <p className="mt-1 text-xs text-amber-600 flex items-center gap-1">
        <FiAlertCircle size={11} /> {duplicateCodeError}
      </p>
    )}
    {hint && !fieldErrors?.[name] && (
      <p className="mt-1 text-xs text-gray-400">{hint}</p>
    )}
  </div>
);

// ─── inputCls helper — বাইরে ──────────────────────────────────────────────────
const getInputCls = (name, fieldErrors, duplicateCodeError) =>
  `w-full rounded-xl border px-3 py-2.5 text-sm text-gray-800 focus:outline-none transition placeholder-gray-400 bg-gray-50 focus:bg-white ${
    fieldErrors?.[name]
      ? "border-red-300 focus:border-[#f20c32]"
      : name === "code" && duplicateCodeError
      ? "border-amber-300 focus:border-amber-400"
      : "border-gray-200 focus:border-[#f20c32]"
  }`;

// ─── Add Coupon Modal ─────────────────────────────────────────────────────────
const AddCouponModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const { createCouponLoading, createCouponError, createCouponData } =
    useSelector((s) => s.newCoupons);

  const [form, setForm] = useState({
    code: "", title: "", description: "",
    discountType: "PERCENTAGE", discountValue: "",
    appliesTo: "ONLINE", usageLimit: "",
    minOrderAmount: "", maxDiscountAmount: "",
    startsAt: "", expiresAt: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (fieldErrors[name]) setFieldErrors((p) => ({ ...p, [name]: null }));
  };

  const duplicateCodeError =
    createCouponError &&
    typeof createCouponError === "string" &&
    createCouponError.toLowerCase().includes("already exists")
      ? createCouponError
      : createCouponError?.message?.toLowerCase().includes("already exists")
      ? createCouponError.message
      : null;

  const validate = () => {
    const errs = {};
    if (!form.code.trim())      errs.code          = "Coupon code is required";
    if (!form.title.trim())     errs.title         = "Title is required";
    if (!form.discountValue)    errs.discountValue  = "Discount value is required";
    if (!form.usageLimit)       errs.usageLimit     = "Usage limit is required";
    if (!form.startsAt)         errs.startsAt       = "Start date is required";
    if (!form.expiresAt)        errs.expiresAt      = "Expiry date is required";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    dispatch(createCoupon({
      ...form,
      discountValue:    parseFloat(form.discountValue),
      usageLimit:       parseInt(form.usageLimit),
      minOrderAmount:   form.minOrderAmount    ? parseFloat(form.minOrderAmount)    : undefined,
      maxDiscountAmount:form.maxDiscountAmount ? parseFloat(form.maxDiscountAmount) : undefined,
      isActive: 1,
    }));
  };

  useEffect(() => {
    if (createCouponData) {
      const t = setTimeout(() => { dispatch(resetCreateCoupon()); onClose(); }, 1500);
      return () => clearTimeout(t);
    }
  }, [createCouponData]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)" }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#fff0f2,#ffe4e8)" }}>
              <FiTag size={17} color="#f20c32" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-800">Create New Coupon</h2>
              <p className="text-xs text-gray-400">
                Fields marked <span className="text-[#f20c32]">*</span> are required
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition">
            <FiX size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5">
          <form onSubmit={handleSubmit} id="coupon-form" className="space-y-5">

            {/* Code + Title */}
            <div className="grid grid-cols-2 gap-4">
              <Field label="Coupon Code" name="code" required
                fieldErrors={fieldErrors} duplicateCodeError={duplicateCodeError}>
                <input
                  name="code" value={form.code} onChange={handleChange}
                  placeholder="e.g. SUMMER20"
                  className={getInputCls("code", fieldErrors, duplicateCodeError)}
                  style={{ textTransform: "uppercase", fontFamily: "monospace", letterSpacing: "0.05em", fontWeight: 700 }}
                />
              </Field>
              <Field label="Title" name="title" required
                fieldErrors={fieldErrors} duplicateCodeError={duplicateCodeError}>
                <input
                  name="title" value={form.title} onChange={handleChange}
                  placeholder="Coupon title"
                  className={getInputCls("title", fieldErrors, duplicateCodeError)}
                />
              </Field>
            </div>

            {/* Description */}
            <Field label="Description" name="description"
              fieldErrors={fieldErrors} duplicateCodeError={duplicateCodeError}>
              <textarea
                name="description" value={form.description} onChange={handleChange}
                rows={2} placeholder="Brief description of this coupon..."
                className={getInputCls("description", fieldErrors, duplicateCodeError) + " resize-none"}
              />
            </Field>

            {/* Discount Configuration */}
            <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/60 space-y-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Discount Configuration</p>
              <div className="grid grid-cols-3 gap-4">
                <Field label="Discount Type" name="discountType" required
                  fieldErrors={fieldErrors} duplicateCodeError={duplicateCodeError}>
                  <select name="discountType" value={form.discountType} onChange={handleChange}
                    className={getInputCls("discountType", fieldErrors, duplicateCodeError)}>
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount ($)</option>
                  </select>
                </Field>
                <Field label="Discount Value" name="discountValue" required
                  fieldErrors={fieldErrors} duplicateCodeError={duplicateCodeError}>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold">
                      {form.discountType === "PERCENTAGE" ? "%" : "$"}
                    </span>
                    <input
                      name="discountValue" value={form.discountValue} onChange={handleChange}
                      type="number" min="0" step="0.01" placeholder="0.00"
                      className={getInputCls("discountValue", fieldErrors, duplicateCodeError) + " pl-7"}
                    />
                  </div>
                </Field>
                <Field label="Applies To" name="appliesTo" required
                  fieldErrors={fieldErrors} duplicateCodeError={duplicateCodeError}>
                  <select name="appliesTo" value={form.appliesTo} onChange={handleChange}
                    className={getInputCls("appliesTo", fieldErrors, duplicateCodeError)}>
                    <option value="ONLINE">Online</option>
                    <option value="OFFLINE">Offline</option>
                    <option value="BOTH">Both</option>
                  </select>
                </Field>
              </div>
            </div>

            {/* Limits & Amounts */}
            <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/60 space-y-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Limits & Amounts</p>
              <div className="grid grid-cols-3 gap-4">
                <Field label="Usage Limit" name="usageLimit" required
                  hint="Max times coupon can be used"
                  fieldErrors={fieldErrors} duplicateCodeError={duplicateCodeError}>
                  <input
                    name="usageLimit" value={form.usageLimit} onChange={handleChange}
                    type="number" min="1" placeholder="100"
                    className={getInputCls("usageLimit", fieldErrors, duplicateCodeError)}
                  />
                </Field>
                <Field label="Min Order Amount" name="minOrderAmount"
                  hint="Optional"
                  fieldErrors={fieldErrors} duplicateCodeError={duplicateCodeError}>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <input
                      name="minOrderAmount" value={form.minOrderAmount} onChange={handleChange}
                      type="number" min="0" step="0.01" placeholder="0.00"
                      className={getInputCls("minOrderAmount", fieldErrors, duplicateCodeError) + " pl-6"}
                    />
                  </div>
                </Field>
                <Field label="Max Discount Amount" name="maxDiscountAmount"
                  hint="Optional cap"
                  fieldErrors={fieldErrors} duplicateCodeError={duplicateCodeError}>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <input
                      name="maxDiscountAmount" value={form.maxDiscountAmount} onChange={handleChange}
                      type="number" min="0" step="0.01" placeholder="0.00"
                      className={getInputCls("maxDiscountAmount", fieldErrors, duplicateCodeError) + " pl-6"}
                    />
                  </div>
                </Field>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <Field label="Starts At" name="startsAt" required
                fieldErrors={fieldErrors} duplicateCodeError={duplicateCodeError}>
                <input
                  name="startsAt" value={form.startsAt} onChange={handleChange}
                  type="date"
                  className={getInputCls("startsAt", fieldErrors, duplicateCodeError)}
                />
              </Field>
              <Field label="Expires At" name="expiresAt" required
                fieldErrors={fieldErrors} duplicateCodeError={duplicateCodeError}>
                <input
                  name="expiresAt" value={form.expiresAt} onChange={handleChange}
                  type="date"
                  className={getInputCls("expiresAt", fieldErrors, duplicateCodeError)}
                />
              </Field>
            </div>

            {/* General error */}
            {createCouponError && !duplicateCodeError && (
              <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-100">
                <FiAlertCircle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600">
                  {typeof createCouponError === "string" ? createCouponError : "Something went wrong."}
                </p>
              </div>
            )}

            {/* Success */}
            {createCouponData && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-green-50 border border-green-100">
                <FiCheckCircle size={15} className="text-green-500" />
                <p className="text-sm text-green-600 font-medium">Coupon created successfully!</p>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100 flex-shrink-0">
          <button type="button" onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">
            Cancel
          </button>
          <button type="submit" form="coupon-form" disabled={createCouponLoading}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition flex items-center justify-center gap-2"
            style={!createCouponLoading ? { backgroundColor: "#f20c32" } : { backgroundColor: "#f9a8b0" }}>
            {createCouponLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Creating...
              </>
            ) : "Create Coupon"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Coupon Detail Modal ──────────────────────────────────────────────────────
const CouponDetailModal = ({ coupon, loading, onClose }) => {
  const isExpired = coupon?.expiresAt && new Date(coupon.expiresAt) < new Date();

  const InfoRow = ({ icon, label, value }) => (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
      <span className="flex items-center gap-2 text-xs text-gray-400 font-medium uppercase tracking-wide">
        {icon}<span>{label}</span>
      </span>
      <span className="text-sm font-semibold text-gray-700">{value ?? "—"}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)" }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {loading ? (
          <>
            <div className="relative px-6 pt-6 pb-5"
              style={{ background: "linear-gradient(135deg,#f20c32,#ff6b6b)" }}>
              <button type="button" onClick={onClose}
                className="absolute top-4 right-4 z-10 w-7 h-7 rounded-full bg-white bg-opacity-20 flex items-center justify-center hover:bg-opacity-40 transition">
                <FiX size={14} color="white" />
              </button>
              <div className="flex items-center justify-center h-16">
                <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              </div>
            </div>
            <div className="px-6 py-6 text-center">
              <p className="text-sm text-gray-400 font-medium">Loading coupon details...</p>
            </div>
            <div className="px-6 pb-5">
              <button type="button" onClick={onClose}
                className="w-full py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">
                Close
              </button>
            </div>
          </>
        ) : coupon ? (
          <>
            <div className="relative px-6 pt-6 pb-5 overflow-hidden"
              style={{ background: isExpired ? "linear-gradient(135deg,#6b7280,#9ca3af)" : "linear-gradient(135deg,#f20c32,#ff6b6b)" }}>
              <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white opacity-[0.06]" />
              <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-white opacity-[0.06]" />
              <button type="button" onClick={onClose}
                className="absolute top-4 right-4 z-10 w-7 h-7 rounded-full bg-white bg-opacity-20 flex items-center justify-center hover:bg-opacity-40 transition">
                <FiX size={14} color="white" />
              </button>
              <div className="flex items-center gap-3 relative">
                <div className="w-12 h-12 rounded-xl bg-white bg-opacity-20 flex items-center justify-center">
                  <FiTag size={22} color="white" />
                </div>
                <div>
                  <p className="text-white text-opacity-70 text-xs font-medium uppercase tracking-widest">Coupon Code</p>
                  <h2 className="text-white text-2xl font-black tracking-widest" style={{ fontFamily: "monospace" }}>
                    {coupon.code}
                  </h2>
                </div>
              </div>
              <p className="mt-3 text-white text-opacity-90 text-sm font-semibold relative">{coupon.title}</p>
              {coupon.description && (
                <p className="mt-1 text-white text-opacity-60 text-xs relative">{coupon.description}</p>
              )}
              <div className="mt-3 flex gap-2 relative flex-wrap">
                {isExpired
                  ? <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-white bg-opacity-20 text-white"><FiClock size={11} /> Expired</span>
                  : coupon.isActive
                    ? <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-white bg-opacity-20 text-white"><FiCheckCircle size={11} /> Active</span>
                    : <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-white bg-opacity-20 text-white"><FiXCircle size={11} /> Inactive</span>
                }
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-white bg-opacity-20 text-white">{coupon.discountType}</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-white bg-opacity-20 text-white">{coupon.appliesTo}</span>
              </div>
            </div>
            <div className="px-6 py-4">
              <InfoRow icon={<FiPercent size={12} />} label="Discount Value"
                value={coupon.discountType === "PERCENTAGE" ? `${coupon.discountValue}%` : `$${coupon.discountValue}`} />
              <InfoRow icon={<FiDollarSign size={12} />} label="Min Order Amount"
                value={coupon.minOrderAmount ? `$${coupon.minOrderAmount}` : null} />
              <InfoRow icon={<FiDollarSign size={12} />} label="Max Discount"
                value={coupon.maxDiscountAmount ? `$${coupon.maxDiscountAmount}` : null} />
              <InfoRow icon={<FiUsers size={12} />} label="Usage Limit" value={coupon.usageLimit} />
              <InfoRow icon={<FiCalendar size={12} />} label="Starts At" value={coupon.startsAt} />
              <InfoRow icon={<FiCalendar size={12} />} label="Expires At" value={coupon.expiresAt} />
            </div>
            <div className="px-6 pb-5">
              <button type="button" onClick={onClose}
                className="w-full py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">
                Close
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

// ─── Toggle Switch ────────────────────────────────────────────────────────────
const ToggleSwitch = ({ isActive, isExpired, loading, onChange }) => {
  if (isExpired) return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-400 border border-gray-200 select-none">
      <FiClock size={11} /> Expired
    </span>
  );
  return (
    <button
      type="button"
      disabled={loading}
      onClick={(e) => { e.stopPropagation(); onChange(); }}
      className={`inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full text-xs font-bold border transition-all duration-200 select-none
        ${loading ? "opacity-60 cursor-not-allowed" : "cursor-pointer active:scale-95"}
        ${isActive
          ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
          : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200"
        }`}
    >
      <span className={`relative inline-flex w-8 h-4 rounded-full transition-colors duration-300 flex-shrink-0
        ${isActive ? "bg-green-500" : "bg-gray-300"}`}>
        <span className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white shadow-sm transition-transform duration-300
          ${isActive ? "translate-x-4" : "translate-x-0"}`} />
      </span>
      {loading
        ? <svg className="animate-spin h-3 w-3 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        : <span>{isActive ? "Active" : "Inactive"}</span>
      }
    </button>
  );
};

// ─── Coupon Card ──────────────────────────────────────────────────────────────
const CouponCard = ({ coupon, onClick, onToggleStatus, toggleLoading }) => {
  const isExpired = coupon.expiresAt && new Date(coupon.expiresAt) < new Date();
  const isActive = !!coupon.isActive && !isExpired;
  const days = coupon.expiresAt
    ? Math.ceil((new Date(coupon.expiresAt) - new Date()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div onClick={onClick}
      className={`group relative bg-white rounded-2xl border cursor-pointer transition-all duration-200 overflow-hidden
        ${isExpired ? "border-gray-200 opacity-70" : "border-gray-100 hover:border-gray-300 hover:shadow-lg hover:-translate-y-0.5"}`}>
      <div className={`absolute left-0 top-0 bottom-0 w-1
        ${isExpired ? "bg-gray-300" : isActive ? "bg-gradient-to-b from-[#f20c32] to-[#ff6b6b]" : "bg-gray-300"}`} />
      <div className="pl-5 pr-4 py-4 flex items-center gap-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0
          ${isExpired ? "bg-gray-100" : isActive ? "bg-red-50" : "bg-gray-100"}`}>
          {isExpired
            ? <FiClock size={19} className="text-gray-400" />
            : <FiTag size={19} color={isActive ? "#f20c32" : "#9ca3af"} />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <span className="font-black text-sm text-gray-800 tracking-wider" style={{ fontFamily: "monospace" }}>
              {coupon.code}
            </span>
            <span className={`text-lg font-extrabold ${isExpired ? "text-gray-400" : "text-[#f20c32]"}`}>
              {coupon.discountType === "PERCENTAGE" ? `${coupon.discountValue}%` : `$${coupon.discountValue}`}
              <span className="text-xs font-semibold ml-0.5 text-gray-400"> OFF</span>
            </span>
          </div>
          <p className="text-xs text-gray-500 truncate mb-2">{coupon.title}</p>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 text-xs text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">
              <FiUsers size={10} /> {coupon.usageLimit ?? "∞"}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">
              {coupon.appliesTo}
            </span>
            {coupon.expiresAt && (
              <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium
                ${isExpired ? "bg-red-50 text-red-400 border-red-100"
                  : days <= 7 ? "bg-amber-50 text-amber-600 border-amber-100"
                  : "bg-gray-50 text-gray-400 border-gray-100"}`}>
                <FiCalendar size={10} />
                {isExpired ? "Expired" : days <= 7 ? `${days}d left` : coupon.expiresAt}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2.5 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          <ToggleSwitch
            isActive={isActive} isExpired={isExpired}
            loading={toggleLoading} onChange={() => onToggleStatus(coupon)}
          />
          <button type="button" onClick={(e) => { e.stopPropagation(); onClick(); }}
            className="text-xs text-gray-400 flex items-center gap-0.5 hover:text-[#f20c32] transition">
            Details <FiChevronRight size={13} />
          </button>
        </div>
      </div>
      {!isExpired && days !== null && days <= 7 && days > 0 && (
        <div className="px-5 pb-3 pt-0">
          <div className="h-1 bg-amber-100 rounded-full overflow-hidden">
            <div className="h-full bg-amber-400 rounded-full" style={{ width: `${(days / 7) * 100}%` }} />
          </div>
          <p className="text-xs text-amber-500 font-semibold mt-1">
            ⚠ Expires in {days} day{days !== 1 ? "s" : ""}
          </p>
        </div>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const ManageCoupon = () => {
  const dispatch = useDispatch();
  const { couponListLoading, couponListData, couponDetailData, couponDetailLoading } =
    useSelector((s) => s.newCoupons);

  const [showAddModal,    setShowAddModal]    = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [searchQuery,     setSearchQuery]     = useState("");
  const [filterStatus,    setFilterStatus]    = useState("ALL");
  const [togglingCode,    setTogglingCode]    = useState(null);

  useEffect(() => { dispatch(getCouponList()); }, [dispatch]);

  const handleCouponClick = (code) => {
    dispatch(getCouponByCode(code));
    setShowDetailModal(true);
  };

  const handleCloseDetail = () => {
    setShowDetailModal(false);
    dispatch(resetCouponDetail());
  };

  const handleCloseAdd = () => {
    setShowAddModal(false);
    dispatch(resetCreateCoupon());
    dispatch(getCouponList());
  };

  const handleToggleStatus = async (coupon) => {
    const newStatus = coupon.isActive ? 0 : 1;
    setTogglingCode(coupon.code);
    await dispatch(toggleCouponStatus({ coupon, isActive: newStatus }));
    setTogglingCode(null);
    dispatch(getCouponList());
  };

  const coupons = Array.isArray(couponListData)
    ? couponListData
    : couponListData?.data || couponListData?.coupons || [];

  const filtered = coupons.filter((c) => {
    const isExpired = c.expiresAt && new Date(c.expiresAt) < new Date();
    const matchSearch =
      c.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchFilter =
      filterStatus === "ALL"      ? true :
      filterStatus === "ACTIVE"   ? (c.isActive && !isExpired) :
      filterStatus === "INACTIVE" ? (!c.isActive && !isExpired) :
      filterStatus === "EXPIRED"  ? isExpired : true;
    return matchSearch && matchFilter;
  });

  const stats = {
    total:    coupons.length,
    active:   coupons.filter((c) =>  c.isActive && new Date(c.expiresAt) >= new Date()).length,
    inactive: coupons.filter((c) => !c.isActive && new Date(c.expiresAt) >= new Date()).length,
    expired:  coupons.filter((c) =>  new Date(c.expiresAt) < new Date()).length,
  };

  const statCards = [
    { key: "ALL",      label: "Total",    value: stats.total,    color: "text-gray-800",  bg: "bg-white",    border: "border-gray-200",  dot: "bg-gray-400"  },
    { key: "ACTIVE",   label: "Active",   value: stats.active,   color: "text-green-700", bg: "bg-green-50", border: "border-green-200", dot: "bg-green-500" },
    { key: "INACTIVE", label: "Inactive", value: stats.inactive, color: "text-gray-500",  bg: "bg-gray-50",  border: "border-gray-200",  dot: "bg-gray-400"  },
    { key: "EXPIRED",  label: "Expired",  value: stats.expired,  color: "text-red-500",   bg: "bg-red-50",   border: "border-red-200",   dot: "bg-red-400"   },
  ];

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 w-full flex flex-col"
      style={{ height: "calc(100vh - 120px)", minHeight: 0 }}>

      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <div>
          <h2 className="text-xl font-black text-gray-800">Manage Coupons</h2>
          <p className="text-xs text-gray-400 mt-0.5">Create and manage discount coupons for your store</p>
        </div>
        <button onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-md hover:opacity-90 active:scale-95 transition-all"
          style={{ background: "linear-gradient(135deg,#f20c32,#ff4d6d)", boxShadow: "0 4px 14px rgba(242,12,50,0.3)" }}>
          <FiPlus size={16} /> Add Coupon
        </button>
      </div>

      {/* Stats Tabs */}
      <div className="grid grid-cols-4 gap-3 mb-5 flex-shrink-0">
        {statCards.map((s) => (
          <button key={s.key} onClick={() => setFilterStatus(s.key)}
            className={`rounded-xl px-4 py-3 text-left border transition-all ${s.bg} ${s.border}
              ${filterStatus === s.key ? "ring-2 ring-offset-1 ring-gray-300 shadow-sm" : "hover:shadow-sm"}`}>
            <div className="flex items-center gap-1.5 mb-1">
              <span className={`w-2 h-2 rounded-full ${s.dot}`} />
              <span className="text-xs text-gray-400 font-semibold uppercase tracking-wide">{s.label}</span>
            </div>
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-4 flex-shrink-0">
        <FiSearch size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by code or title..."
          className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-gray-300 focus:bg-white transition placeholder-gray-400" />
      </div>

      {/* Count label */}
      {!couponListLoading && filtered.length > 0 && (
        <div className="mb-2 flex-shrink-0">
          <p className="text-xs text-gray-400 font-medium">
            Showing <span className="font-bold text-gray-600">{filtered.length}</span> coupon{filtered.length !== 1 ? "s" : ""}
            {filterStatus !== "ALL" && <span className="ml-1">· {filterStatus}</span>}
          </p>
        </div>
      )}

      {/* ✅ Scrollable list */}
      <div className="flex-1 overflow-y-auto min-h-0 pr-1"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#e5e7eb transparent" }}>
        <div className="space-y-3 pb-2">
          {couponListLoading ? (
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="h-[88px] rounded-2xl bg-gray-100 animate-pulse" />
            ))
          ) : filtered.length === 0 ? (
            <div className="text-center py-14">
              <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto mb-3">
                <FiTag size={26} className="text-gray-300" />
              </div>
              <p className="text-sm font-bold text-gray-400">
                {searchQuery ? "No coupons match your search" : `No ${filterStatus.toLowerCase()} coupons`}
              </p>
              {!searchQuery && filterStatus === "ALL" && (
                <p className="text-xs text-gray-300 mt-1">Click "Add Coupon" to get started</p>
              )}
            </div>
          ) : (
            filtered.map((coupon) => (
              <CouponCard
                key={coupon.code || coupon.id}
                coupon={coupon}
                onClick={() => handleCouponClick(coupon.code)}
                onToggleStatus={handleToggleStatus}
                toggleLoading={togglingCode === coupon.code}
              />
            ))
          )}
        </div>
      </div>

      {showAddModal && <AddCouponModal onClose={handleCloseAdd} />}
      {showDetailModal && (
        <CouponDetailModal
          coupon={couponDetailData}
          loading={couponDetailLoading}
          onClose={handleCloseDetail}
        />
      )}
    </div>
  );
};

export default ManageCoupon;