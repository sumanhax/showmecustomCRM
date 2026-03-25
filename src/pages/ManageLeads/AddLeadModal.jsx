// import { useState, useEffect, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { toast } from "react-toastify";
// import { getHatList, saveLead, uploadLeadImage } from "../../Reducer/LeadSlice";

// // ─── Step 1: Industry options ─────────────────────────────────────────────────
// const INDUSTRY_OPTIONS = [
//   { label: "Construction/Trade", value: "construction" },
//   { label: "Hospitality", value: "hospitality" },
//   { label: "Professional Services", value: "professional_services" },
//   { label: "School/Sports Team", value: "school_sports" },
//   { label: "Agriculture", value: "agriculture" },
//   { label: "Outdoor (Hunting/Fishing)", value: "outdoor" },
//   { label: "Gym/Fitness", value: "gym_fitness" },
//   { label: "Nonprofit", value: "nonprofit" },
//   { label: "Church", value: "church" },
//   { label: "Event/Festival", value: "event_festival" },
//   { label: "Retail/Ecommerce", value: "retail_ecommerce" },
//   { label: "Manufacturing/Industrial", value: "manufacturing" },
//   { label: "Corporate Office", value: "corporate" },
//   { label: "Other", value: "other" },
// ];

// const PRIMARY_USE_OPTIONS = [
//   { label: "Employee / Staff Uniforms", value: "uniforms" },
//   { label: "Merchandise to Sell", value: "merchandise" },
//   { label: "Promotional Giveaways", value: "giveaways" },
//   { label: "Client / Customer Gifts", value: "gifts" },
//   { label: "Event or Trade Show Use", value: "events" },
//   { label: "Team / Company Branding", value: "branding" },
//   { label: "Fundraiser", value: "fundraiser" },
//   { label: "Not Sure Yet", value: "not_sure" },
// ];

// const TEAM_SIZE_OPTIONS = [
//   { label: "1-5", value: "1-5" },
//   { label: "6-15", value: "6-15" },
//   { label: "16-25", value: "16-25" },
//   { label: "26-50", value: "26-50" },
//   { label: "50+", value: "50+" },
// ];

// const FRUSTRATION_OPTIONS = [
//   { label: "Quality never matches expectations", value: "quality" },
//   { label: "Logo accuracy issues", value: "logo_accuracy" },
//   { label: "Lead times too long", value: "lead_times" },
//   { label: "Pricing inconsistent", value: "pricing" },
//   { label: "Supplier communication issues", value: "supplier_comm" },
//   { label: "Minimum order quantities too high", value: "moq" },
//   { label: "Never ordered before", value: "never_ordered" },
//   { label: "No major issues", value: "no_issues" },
// ];

// const WHY_SAMPLES_OPTIONS = [
//   { label: "Preparing for season/event", value: "season_event" },
//   { label: "Restocking merch program", value: "restocking" },
//   { label: "Expanding merch program", value: "expanding" },
//   { label: "Trying headwear for first time", value: "first_time" },
//   { label: "Switching supplier", value: "switching" },
//   { label: "Comparing vendors", value: "comparing" },
//   { label: "Checking quality before bulk order", value: "quality_check" },
//   { label: "Preparing for order this quarter", value: "this_quarter" },
// ];

// const DELIVERY_OPTIONS = [
//   { label: "Within 2 weeks", value: "2_weeks" },
//   { label: "2-6 weeks", value: "2_6_weeks" },
//   { label: "2-3 months", value: "2_3_months" },
//   { label: "Just exploring options", value: "exploring" },
// ];

// const FREQUENCY_OPTIONS = [
//   { label: "First time", value: "first_time" },
//   { label: "1-2 times per year", value: "1-2" },
//   { label: "3-5 times per year", value: "3-5" },
//   { label: "6+ times per year", value: "6+" },
// ];

// const BUDGET_OPTIONS = [
//   { label: "Budget confirmed", value: "confirmed" },
//   { label: "Budget pending approval", value: "pending" },
//   { label: "Still planning", value: "planning" },
//   { label: "Just exploring options", value: "exploring" },
// ];

// const BRAND_OPTIONS = [
//   { label: "We invest in premium pieces", value: "premium" },
//   { label: "Quality over quantity", value: "quality_over_quantity" },
//   { label: "Solid quality at fair price", value: "fair_price" },
//   { label: "Fast turnaround most important", value: "fast_turnaround" },
//   { label: "Lowest cost focus", value: "lowest_cost" },
// ];

// // ─── Checkmark SVG ────────────────────────────────────────────────────────────
// const Check = () => (
//   <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
//     <path d="M2 6.5l3.5 3.5 5.5-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//   </svg>
// );

// // ─── Option button (single or multi) ─────────────────────────────────────────
// const Opt = ({ label, selected, onClick }) => (
//   <button
//     type="button"
//     onClick={onClick}
//     style={{
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "space-between",
//       padding: "17px 20px",
//       border: selected ? "2px solid #dc2626" : "1.5px solid #d1d5db",
//       borderRadius: "10px",
//       background: selected ? "#fef2f2" : "#fff",
//       cursor: "pointer",
//       textAlign: "left",
//       width: "100%",
//       transition: "border-color 0.12s, background 0.12s",
//       outline: "none",
//       boxSizing: "border-box",
//     }}
//   >
//     <span style={{
//       fontSize: "15px",
//       fontWeight: selected ? 600 : 400,
//       color: "#111827",
//       lineHeight: 1.3,
//       flex: 1,
//     }}>
//       {label}
//     </span>
//     {selected && (
//       <span style={{ fontSize: "18px", marginLeft: "10px", flexShrink: 0 }}>✅</span>
//     )}
//   </button>
// );

// // ─── Label style ──────────────────────────────────────────────────────────────
// const lbl = { display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "7px" };

// // ─── Input style ──────────────────────────────────────────────────────────────
// const inp = {
//   width: "100%", padding: "13px 16px",
//   border: "1.5px solid #d1d5db", borderRadius: "8px",
//   fontSize: "15px", outline: "none",
//   boxSizing: "border-box", color: "#111827",
//   background: "#f9fafb", fontFamily: "inherit",
// };

// // ═══════════════════════════════════════════════════════════════════════════════
// const AddLeadModal = ({ openAddLeadModal, setOpenAddLeadModal, onLeadAdded, isOpen, onClose, onSuccess }) => {
//   const dispatch = useDispatch();
//   const { hatListData, hatListLoading, saveLeadLoading } = useSelector((s) => s.lead);

//   const [step, setStep] = useState(1);
//   const [colorIdx, setColorIdx] = useState(0);
//   const [logoUploading, setLogoUploading] = useState(false);
//   const fileRef = useRef();

//   const [form, setForm] = useState({
//     industry: "", industryOther: "",
//     primaryUse: [], teamSize: "",
//     frustrations: [], whySamples: [],
//     deliveryTiming: "", orderingFrequency: "",
//     budgetApproval: "", brandApproach: [],
//     website: "",
//     firstName: "", lastName: "", email: "", phone: "", company: "",
//     address: "", address2: "", city: "", state: "", zip: "", country: "United States",
//     logo: null,
//     selectedHats: [], hatColors: {}, hatSizes: {},
//   });

//   const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
//   const toggle = (k, v) => set(k, form[k].includes(v) ? form[k].filter((x) => x !== v) : [...form[k], v]);

//   const hats = Array.isArray(hatListData?.data) ? hatListData.data
//     : Array.isArray(hatListData?.hats) ? hatListData.hats
//       : Array.isArray(hatListData) ? hatListData : [];

//   useEffect(() => {
//     if (open) { dispatch(getHatList()); setStep(1); setColorIdx(0); }
//   }, [isOpen]);

//   const open = openAddLeadModal ?? isOpen;
//   const handleClose = () => { if (setOpenAddLeadModal) setOpenAddLeadModal(false); if (onClose) handleClose(); };
//   const handleSuccess = () => { if (onLeadAdded) onLeadAdded(); if (onSuccess) onSuccess(); };
//   if (!open) return null;

//   // color steps are step 15, 16, ... for each selected hat
//   // size step is after all color steps
//   const colorStepsCount = form.selectedHats.length;
//   const sizeStepNum = 15 + colorStepsCount;
//   const totalSteps = sizeStepNum;

//   // progress %
//   const getPct = () => {
//     if (step <= 14) return (step / totalSteps) * 100;
//     if (step === 15) return ((14 + colorIdx + 1) / totalSteps) * 100;
//     return 100;
//   };

//   const curHatId = form.selectedHats[colorIdx];
//   const curHat = hats.find((h) => (h.id || h.sku || h.hat_id) === curHatId);

//   const goNext = () => {
//     if (step === 14) {
//       if (!form.selectedHats.length) { toast.warning("Please select at least 1 hat"); return; }
//       setColorIdx(0); setStep(15);
//     } else if (step === 15) {
//       if (colorIdx < form.selectedHats.length - 1) setColorIdx((p) => p + 1);
//       else setStep(sizeStepNum);
//     } else if (step === sizeStepNum) {
//       handleSubmit();
//     } else {
//       setStep((p) => p + 1);
//     }
//   };

//   const goBack = () => {
//     if (step === 1) { handleClose(); return; }
//     if (step === 15) {
//       if (colorIdx > 0) setColorIdx((p) => p - 1);
//       else setStep(14);
//       return;
//     }
//     if (step === sizeStepNum) {
//       setColorIdx(form.selectedHats.length - 1); setStep(15); return;
//     }
//     setStep((p) => p - 1);
//   };

//   const handleLogoFile = async (file) => {
//     if (!file) return;
//     setLogoUploading(true);
//     const fd = new FormData();
//     fd.append("file", file);
//     try {
//       const res = await dispatch(uploadLeadImage(fd)).unwrap();
//       set("logo", { url: res?.data?.url || res?.url || "" });
//       toast.success("Logo uploaded!");
//     } catch { toast.error("Logo upload failed"); }
//     finally { setLogoUploading(false); }
//   };

//   const toggleHat = (id) => {
//     if (form.selectedHats.includes(id)) {
//       set("selectedHats", form.selectedHats.filter((h) => h !== id));
//     } else {
//       if (form.selectedHats.length >= 4) { toast.warning("Max 4 hats"); return; }
//       set("selectedHats", [...form.selectedHats, id]);
//     }
//   };

//   const handleSubmit = async () => {
//     try {
//       await dispatch(saveLead({
//         industry: form.industry, industryOther: form.industryOther,
//         primaryUse: form.primaryUse, teamSize: form.teamSize,
//         frustrations: form.frustrations, whySamples: form.whySamples,
//         deliveryTiming: form.deliveryTiming, orderingFrequency: form.orderingFrequency,
//         budgetApproval: form.budgetApproval, brandApproach: form.brandApproach,
//         website: form.website,
//         contact: { firstName: form.firstName, lastName: form.lastName, email: form.email, phone: form.phone, company: form.company },
//         address: { address: form.address, address2: form.address2, city: form.city, state: form.state, zip: form.zip, country: form.country },
//         logo: form.logo || {},
//         selectedHats: form.selectedHats,
//         hatColors: form.hatColors,
//         hatSizes: form.hatSizes,
//       })).unwrap();
//       toast.success("Sample pack request submitted!");
//       handleSuccess?.(); handleClose();
//     } catch { toast.error("Submission failed. Please try again."); }
//   };

//   const isLast = step === sizeStepNum;

//   // 2-col grid wrapper
//   const Grid2 = ({ children }) => (
//     <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>{children}</div>
//   );

//   return (
//     <div style={{
//       position: "fixed", inset: 0, zIndex: 9999,
//       background: "rgba(0,0,0,0.35)",
//       display: "flex", alignItems: "center", justifyContent: "center",
//       padding: "16px",
//       fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
//     }}>
//       <div style={{
//         background: "#fff", borderRadius: "12px",
//         width: "100%", maxWidth: "660px", maxHeight: "92vh",
//         display: "flex", flexDirection: "column", overflow: "hidden",
//         boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
//       }}>

//         {/* Red progress bar */}
//         <div style={{ height: "6px", background: "#f1f5f9", flexShrink: 0 }}>
//           <div style={{ height: "100%", width: `${getPct()}%`, background: "#dc2626", transition: "width 0.3s", borderRadius: "0 3px 3px 0" }} />
//         </div>

//         {/* Scrollable body */}
//         <div style={{ flex: 1, overflowY: "auto", padding: "40px 44px 28px" }}>

//           {/* ── 1: Industry ── */}
//           {step === 1 && <>
//             <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#111827", margin: "0 0 24px" }}>
//               What industry best describes your organization?
//             </h2>
//             <Grid2>
//               {INDUSTRY_OPTIONS.map((o) => (
//                 <Opt key={o.value} label={o.label} selected={form.industry === o.value} onClick={() => set("industry", o.value)} />
//               ))}
//             </Grid2>
//             {form.industry === "other" && (
//               <input type="text" placeholder="Please specify..." value={form.industryOther}
//                 onChange={(e) => set("industryOther", e.target.value)}
//                 style={{ ...inp, marginTop: "10px" }} />
//             )}
//           </>}

//           {/* ── 2: Primary Use ── */}
//           {step === 2 && <>
//             <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#111827", margin: "0 0 2px" }}>
//               What will you primarily use these hats for?
//             </h2>
//             <p style={{ fontSize: "14px", color: "#6b7280", margin: "0 0 20px" }}>Select all that apply</p>
//             <Grid2>
//               {PRIMARY_USE_OPTIONS.map((o) => (
//                 <Opt key={o.value} label={o.label} selected={form.primaryUse.includes(o.value)} onClick={() => toggle("primaryUse", o.value)} />
//               ))}
//             </Grid2>
//           </>}

//           {/* ── 3: Team Size ── */}
//           {step === 3 && <>
//             <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#111827", margin: "0 0 24px" }}>
//               How many people are on your team?
//             </h2>
//             <Grid2>
//               {TEAM_SIZE_OPTIONS.map((o) => (
//                 <Opt key={o.value} label={o.label} selected={form.teamSize === o.value} onClick={() => set("teamSize", o.value)} />
//               ))}
//             </Grid2>
//           </>}

//           {/* ── 4: Frustrations ── */}
//           {step === 4 && <>
//             <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#111827", margin: "0 0 2px" }}>
//               What's your biggest frustration with branded headwear so far?
//             </h2>
//             <p style={{ fontSize: "14px", color: "#6b7280", margin: "0 0 20px" }}>Select all that apply</p>
//             <Grid2>
//               {FRUSTRATION_OPTIONS.map((o) => (
//                 <Opt key={o.value} label={o.label} selected={form.frustrations.includes(o.value)} onClick={() => toggle("frustrations", o.value)} />
//               ))}
//             </Grid2>
//           </>}

//           {/* ── 5: Why Samples ── */}
//           {step === 5 && <>
//             <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#111827", margin: "0 0 2px" }}>
//               What prompted you to request samples?
//             </h2>
//             <p style={{ fontSize: "14px", color: "#6b7280", margin: "0 0 20px" }}>Select all that apply</p>
//             <Grid2>
//               {WHY_SAMPLES_OPTIONS.map((o) => (
//                 <Opt key={o.value} label={o.label} selected={form.whySamples.includes(o.value)} onClick={() => toggle("whySamples", o.value)} />
//               ))}
//             </Grid2>
//           </>}

//           {/* ── 6: Delivery Timing ── */}
//           {step === 6 && <>
//             <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#111827", margin: "0 0 24px" }}>
//               When would you ideally like your first bulk order delivered?
//             </h2>
//             <Grid2>
//               {DELIVERY_OPTIONS.map((o) => (
//                 <Opt key={o.value} label={o.label} selected={form.deliveryTiming === o.value} onClick={() => set("deliveryTiming", o.value)} />
//               ))}
//             </Grid2>
//           </>}

//           {/* ── 7: Frequency ── */}
//           {step === 7 && <>
//             <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#111827", margin: "0 0 24px" }}>
//               How often do you order branded apparel?
//             </h2>
//             <Grid2>
//               {FREQUENCY_OPTIONS.map((o) => (
//                 <Opt key={o.value} label={o.label} selected={form.orderingFrequency === o.value} onClick={() => set("orderingFrequency", o.value)} />
//               ))}
//             </Grid2>
//           </>}

//           {/* ── 8: Budget ── */}
//           {step === 8 && <>
//             <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#111827", margin: "0 0 24px" }}>
//               Do you have budget approved for branded headwear this year?
//             </h2>
//             <Grid2>
//               {BUDGET_OPTIONS.map((o) => (
//                 <Opt key={o.value} label={o.label} selected={form.budgetApproval === o.value} onClick={() => set("budgetApproval", o.value)} />
//               ))}
//             </Grid2>
//           </>}

//           {/* ── 9: Brand Approach ── */}
//           {step === 9 && <>
//             <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#111827", margin: "0 0 2px" }}>
//               Which statement best describes your approach to branded apparel?
//             </h2>
//             <p style={{ fontSize: "14px", color: "#6b7280", margin: "0 0 20px" }}>Select all that apply</p>
//             <Grid2>
//               {BRAND_OPTIONS.map((o) => (
//                 <Opt key={o.value} label={o.label} selected={form.brandApproach.includes(o.value)} onClick={() => toggle("brandApproach", o.value)} />
//               ))}
//             </Grid2>
//           </>}

//           {/* ── 10: Website ── */}
//           {step === 10 && <>
//             <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#111827", margin: "0 0 24px" }}>
//               Company website or social media page
//             </h2>
//             <input type="text" placeholder="https://" value={form.website} onChange={(e) => set("website", e.target.value)} style={inp} />
//           </>}

//           {/* ── 11: Contact ── */}
//           {step === 11 && <>
//             <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#111827", margin: "0 0 24px" }}>
//               Contact Information
//             </h2>
//             <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
//               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
//                 <div>
//                   <label style={lbl}>First Name <span style={{ color: "#dc2626" }}>*</span></label>
//                   <input type="text" value={form.firstName} onChange={(e) => set("firstName", e.target.value)} style={inp} />
//                 </div>
//                 <div>
//                   <label style={lbl}>Last Name</label>
//                   <input type="text" value={form.lastName} onChange={(e) => set("lastName", e.target.value)} style={inp} />
//                 </div>
//               </div>
//               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
//                 <div>
//                   <label style={lbl}>Email <span style={{ color: "#dc2626" }}>*</span></label>
//                   <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} style={inp} />
//                 </div>
//                 <div>
//                   <label style={lbl}>Phone Number</label>
//                   <input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} style={inp} />
//                 </div>
//               </div>
//               <div>
//                 <label style={lbl}>Company Name <span style={{ color: "#dc2626" }}>*</span></label>
//                 <input type="text" value={form.company} onChange={(e) => set("company", e.target.value)} style={inp} />
//               </div>
//             </div>
//           </>}

//           {/* ── 12: Address ── */}
//           {step === 12 && <>
//             <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#111827", margin: "0 0 24px" }}>
//               Where should we send your sample pack?
//             </h2>
//             <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
//               <div>
//                 <label style={lbl}>Address</label>
//                 <input type="text" placeholder="123 Main Street" value={form.address} onChange={(e) => set("address", e.target.value)} style={inp} />
//               </div>
//               <div>
//                 <label style={lbl}>Address Line 2</label>
//                 <input type="text" placeholder="Suite 100" value={form.address2} onChange={(e) => set("address2", e.target.value)} style={inp} />
//               </div>
//               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
//                 <div>
//                   <label style={lbl}>City</label>
//                   <input type="text" placeholder="Los Angeles" value={form.city} onChange={(e) => set("city", e.target.value)} style={inp} />
//                 </div>
//                 <div>
//                   <label style={lbl}>State / Province</label>
//                   <input type="text" placeholder="CA" value={form.state} onChange={(e) => set("state", e.target.value)} style={inp} />
//                 </div>
//               </div>
//               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
//                 <div>
//                   <label style={lbl}>ZIP Code</label>
//                   <input type="text" placeholder="90001" value={form.zip} onChange={(e) => set("zip", e.target.value)} style={inp} />
//                 </div>
//                 <div>
//                   <label style={lbl}>Country</label>
//                   <input type="text" value={form.country} onChange={(e) => set("country", e.target.value)} style={inp} />
//                 </div>
//               </div>
//             </div>
//           </>}

//           {/* ── 13: Logo Upload ── */}
//           {step === 13 && <>
//             <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#111827", margin: "0 0 24px" }}>
//               Upload the logo you want embroidered on your sample hats
//             </h2>
//             <input ref={fileRef} type="file" accept=".png,.jpg,.jpeg,.svg,.ai,.pdf" style={{ display: "none" }}
//               onChange={(e) => handleLogoFile(e.target.files[0])} />
//             <div
//               onClick={() => !logoUploading && fileRef.current?.click()}
//               onDragOver={(e) => e.preventDefault()}
//               onDrop={(e) => { e.preventDefault(); handleLogoFile(e.dataTransfer.files[0]); }}
//               style={{
//                 border: `2px dashed ${form.logo ? "#22c55e" : "#d1d5db"}`,
//                 borderRadius: "12px", padding: "60px 24px", textAlign: "center",
//                 cursor: logoUploading ? "wait" : "pointer",
//                 background: form.logo ? "#f0fdf4" : "#fafafa", transition: "all 0.2s",
//               }}
//             >
//               {logoUploading ? (
//                 <div style={{ color: "#6b7280", fontSize: "15px" }}>Uploading...</div>
//               ) : form.logo?.url ? (
//                 <>
//                   <div style={{ fontSize: "30px", marginBottom: "8px" }}>✅</div>
//                   <div style={{ fontWeight: 600, color: "#16a34a", fontSize: "15px", marginBottom: "4px" }}>Logo uploaded successfully</div>
//                   <div style={{ fontSize: "12px", color: "#6b7280" }}>Click to replace</div>
//                 </>
//               ) : (
//                 <>
//                   <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
//                     <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
//                       <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
//                         <path d="M12 4v13M7 9l5-5 5 5" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                         <path d="M5 21h14" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
//                       </svg>
//                     </div>
//                   </div>
//                   <div style={{ fontWeight: 600, color: "#374151", fontSize: "15px", marginBottom: "4px" }}>Click to upload or drag and drop</div>
//                   <div style={{ fontSize: "13px", color: "#9ca3af" }}>PNG, JPG, SVG, AI, or PDF (max. 10MB)</div>
//                 </>
//               )}
//             </div>
//           </>}

//           {/* ── 14: Hat Selection ── */}
//           {step === 14 && <>
//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
//               <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#111827", margin: 0 }}>
//                 Choose up to 4 hats for your free samples
//               </h2>
//               <span style={{ fontSize: "13px", fontWeight: 700, color: form.selectedHats.length > 0 ? "#dc2626" : "#9ca3af", whiteSpace: "nowrap", marginLeft: "16px", paddingTop: "4px" }}>
//                 Selected {form.selectedHats.length} / 4
//               </span>
//             </div>
//             <p style={{ fontSize: "14px", color: "#6b7280", margin: "4px 0 20px" }}>Select your favorite styles</p>
//             {hatListLoading ? (
//               <div style={{ textAlign: "center", padding: "48px", color: "#9ca3af" }}>Loading hats...</div>
//             ) : (
//               <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
//                 {hats.map((hat) => {
//                   const id = hat.id || hat.sku || hat.hat_id;
//                   const sel = form.selectedHats.includes(id);
//                   const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
//                   const defaultImg = hat.images?.find((img) => img.hatColorId === 0)?.imageUrl || "";
//                   const img = defaultImg ? `${BASE_URL}/${defaultImg}` : "";
//                   return (
//                     <div key={id} onClick={() => toggleHat(id)} style={{
//                       border: sel ? "2px solid #dc2626" : "1.5px solid #e2e8f0",
//                       borderRadius: "10px", overflow: "hidden", cursor: "pointer",
//                       background: sel ? "#fef2f2" : "#fff", position: "relative", transition: "all 0.15s",
//                     }}>
//                       {sel && (
//                         <div style={{ position: "absolute", top: "8px", right: "8px", width: "22px", height: "22px", borderRadius: "50%", background: "#dc2626", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1 }}>
//                           <Check />
//                         </div>
//                       )}
//                       {img
//                         ? <img src={img} alt={id} style={{ width: "100%", aspectRatio: "1", objectFit: "contain", padding: "10px", display: "block" }} />
//                         : <div style={{ width: "100%", aspectRatio: "1", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", color: "#d1d5db", fontSize: "11px" }}>No img</div>
//                       }
//                       <div style={{ textAlign: "center", padding: "4px 6px 10px", fontSize: "12px", fontWeight: 600, color: "#374151" }}>{hat.name || id}</div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </>}

//           {/* ── 15: Color per hat ── */}
//           {step === 15 && <>
//             <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#111827", margin: "0 0 20px" }}>
//               Which color would you like for {curHatId}?
//             </h2>
//             {/* Big preview of currently selected color */}
//             {form.hatColors[curHatId] && curHat && (() => {
//               const cols = curHat.colors || curHat.colour_options || [];
//               const found = cols.find((c) => (c.name || c.color_name) === form.hatColors[curHatId]);
//               const prev = found?.image_url || found?.image || curHat?.image_url || curHat?.image;
//               return prev ? (
//                 <div style={{ textAlign: "center", marginBottom: "20px" }}>
//                   <img src={prev} alt="preview" style={{ width: "120px", height: "120px", objectFit: "contain" }} />
//                 </div>
//               ) : null;
//             })()}
//             {!curHat ? (
//               <p style={{ color: "#9ca3af", fontSize: "14px" }}>No color data for {curHatId}</p>
//             ) : (
//               <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
//                 {(curHat.colors || curHat.colour_options || []).map((c) => {
//                   const name = c.name || c.color_name;
//                   const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
//                   const colorImg = curHat.images?.find((img) => img.hatColorId === c.id)?.imageUrl || "";
//                   const img = colorImg ? `${BASE_URL}/${colorImg}` : "";
//                   const sel = form.hatColors[curHatId] === name;
//                   return (
//                     <div key={name} onClick={() => set("hatColors", { ...form.hatColors, [curHatId]: name })}
//                       style={{
//                         border: sel ? "2px solid #dc2626" : "1.5px solid #e2e8f0",
//                         borderRadius: "10px", overflow: "hidden", cursor: "pointer",
//                         background: sel ? "#fef2f2" : "#fff", position: "relative",
//                         transition: "all 0.15s", paddingBottom: "8px",
//                       }}>
//                       {sel && (
//                         <div style={{ position: "absolute", top: "8px", right: "8px", width: "22px", height: "22px", borderRadius: "50%", background: "#dc2626", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1 }}>
//                           <Check />
//                         </div>
//                       )}
//                       {img && <img src={img} alt={name} style={{ width: "100%", aspectRatio: "1", objectFit: "contain", padding: "8px", display: "block" }} />}
//                       <div style={{ textAlign: "center", fontSize: "12px", fontWeight: 600, color: "#374151", padding: "0 6px" }}>{name}</div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </>}

//           {/* ── Size step ── */}
//           {step === sizeStepNum && <>
//             <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#111827", margin: "0 0 24px" }}>
//               Which size would you like for each hat?
//             </h2>
//             <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
//               {form.selectedHats.map((hatId) => {
//                 const hat = hats.find((h) => (h.id || h.sku || h.hat_id) === hatId);
//                 const selectedColorName = form.hatColors[hatId];
//                 const colorObj = hat?.colors?.find((c) => c.name === selectedColorName);
//                 const sizes = colorObj?.variants?.map((v) => v.sizeLabel) ||
//                   hat?.colors?.[0]?.variants?.map((v) => v.sizeLabel) || [];

//                 const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
//                 // Get image for selected color
//                 const selectedColor = hat?.colors?.find((c) => c.name === selectedColorName);
//                 const colorImgUrl = selectedColor
//                   ? hat?.images?.find((img) => img.hatColorId === selectedColor.id)?.imageUrl
//                   : hat?.images?.find((img) => img.hatColorId === 0)?.imageUrl;
//                 const displayImg = colorImgUrl ? `${BASE_URL}/${colorImgUrl}` : "";

//                 return (
//                   <div key={hatId} style={{
//                     border: "1.5px solid #e2e8f0",
//                     borderRadius: "12px",
//                     overflow: "hidden",
//                     background: "#fff",
//                   }}>
//                     {/* Hat header with image + name */}
//                     <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 16px", borderBottom: "1px solid #f1f5f9" }}>
//                       {displayImg ? (
//                         <img src={displayImg} alt={hat?.name || hatId}
//                           style={{ width: "60px", height: "60px", objectFit: "contain", borderRadius: "8px", background: "#f8fafc", padding: "4px", flexShrink: 0 }} />
//                       ) : (
//                         <div style={{ width: "60px", height: "60px", background: "#f1f5f9", borderRadius: "8px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: "11px" }}>No img</div>
//                       )}
//                       <div>
//                         <div style={{ fontWeight: 700, fontSize: "15px", color: "#111827" }}>{hat?.name || hatId}</div>
//                         {selectedColorName && (
//                           <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "2px" }}>Color: {selectedColorName}</div>
//                         )}
//                       </div>
//                     </div>

//                     {/* Size buttons */}
//                     <div style={{ padding: "14px 16px" }}>
//                       <div style={{ fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "10px" }}>Select Size</div>
//                       <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
//                         {sizes.length > 0 ? sizes.map((s) => {
//                           const sz = typeof s === "string" ? s : (s.name || s.size_name);
//                           const sel = form.hatSizes[hatId] === sz;
//                           return (
//                             <button key={sz} type="button"
//                               onClick={() => set("hatSizes", { ...form.hatSizes, [hatId]: sz })}
//                               style={{
//                                 display: "flex", alignItems: "center", gap: "6px",
//                                 padding: "9px 18px",
//                                 border: sel ? "2px solid #dc2626" : "1.5px solid #d1d5db",
//                                 borderRadius: "8px",
//                                 background: sel ? "#dc2626" : "#fff",
//                                 color: sel ? "#fff" : "#374151",
//                                 fontWeight: sel ? 700 : 500,
//                                 fontSize: "14px",
//                                 cursor: "pointer",
//                                 transition: "all 0.15s",
//                                 outline: "none",
//                               }}>
//                               {sel && (
//                                 <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
//                                   <path d="M2 6.5l3.5 3.5 5.5-6" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
//                                 </svg>
//                               )}
//                               {sz}
//                             </button>
//                           );
//                         }) : (
//                           <input type="text" placeholder="e.g. OSFM"
//                             value={form.hatSizes[hatId] || ""}
//                             onChange={(e) => set("hatSizes", { ...form.hatSizes, [hatId]: e.target.value })}
//                             style={{ ...inp, width: "200px" }} />
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </>}

//         </div>{/* end scroll body */}

//         {/* Footer: Back / Next */}
//         <div style={{
//           padding: "16px 44px 24px", display: "flex",
//           justifyContent: "space-between", alignItems: "center",
//           borderTop: "1px solid #f3f4f6", flexShrink: 0,
//         }}>
//           <button type="button" onClick={goBack} style={{
//             display: "flex", alignItems: "center", gap: "5px",
//             background: "none", border: "none", cursor: "pointer",
//             fontSize: "15px", fontWeight: 500, color: "#6b7280", padding: "8px 0",
//           }}>
//             <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
//               <path d="M11 14L6 9l5-5" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//             </svg>
//             Back
//           </button>
//           <button type="button" onClick={goNext} disabled={saveLeadLoading} style={{
//             display: "flex", alignItems: "center", gap: "8px",
//             padding: "12px 30px",
//             background: saveLeadLoading ? "#e5e7eb" : "#dc2626",
//             color: saveLeadLoading ? "#9ca3af" : "white",
//             border: "none", borderRadius: "8px",
//             fontSize: "15px", fontWeight: 700,
//             cursor: saveLeadLoading ? "not-allowed" : "pointer",
//             transition: "all 0.15s", outline: "none",
//           }}>
//             {isLast ? (saveLeadLoading ? "Submitting..." : "Submit") : "Next"}
//             {!isLast && (
//               <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
//                 <path d="M7 4l5 5-5 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//               </svg>
//             )}
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default AddLeadModal;



import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { saveLead } from "../../Reducer/LeadSlice";

const AddLeadModal = ({ openAddLeadModal, setOpenAddLeadModal, onLeadAdded,  }) => {
  const { register, handleSubmit, reset, formState: { errors }, watch } = useForm();
  const dispatch = useDispatch();
const { saveLeadLoading } = useSelector((state) => state.lead);
  
  // Multi-select state
  const [hatsUsage, setHatsUsage] = useState([]);
  const [pastHeadwearIssues, setPastHeadwearIssues] = useState([]);
  const [whatMostImportant, setWhatMostImportant] = useState([]);
  const [sameAddress, setSameAddress] = useState(false);

  // Options for multi-select fields
  const hatsUsageOptions = [
    "Crew uniforms on the job",
    "Everyday wear around town",
    "Customer-facing meetings or estimates",
    "Company events or trade shows",
    "Gifts or giveaways for customers",
    "Other"
  ];

  const pastHeadwearIssuesOptions = [
    "Hats didn't match our brand or logo properly",
    "Quality was inconsistent or felt cheap",
    "Lead times were slow or unpredictable",
    "Vendor communication was difficult",
    "Crew didn't like the fit or wouldn't wear them",
    "Pricing didn't match the value"
  ];

  const whatMostImportantOptions = [
    "Quick turnaround times",
    "Tailored solutions for our needs",
    "Consistent, premium quality",
    "Comfort and fit for the crew",
    "Easy to reorder",
    "Logo and color accuracy"
  ];

  // Toggle functions for multi-select
  const toggleHatsUsage = (value) => {
    setHatsUsage(prev => 
      prev.includes(value) 
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };

  const togglePastHeadwearIssues = (value) => {
    setPastHeadwearIssues(prev => 
      prev.includes(value) 
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };

  const toggleWhatMostImportant = (value) => {
    setWhatMostImportant(prev => 
      prev.includes(value) 
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };

  const onSubmit = (data) => {
  // saveLead payload format
  const payload = {
    // contact info
    contact: {
      firstName: data.name?.split(" ")[0] || data.name || "",
      lastName:  data.name?.split(" ").slice(1).join(" ") || "",
      email:     data.email,
      phone:     data.phone,
      company:   data.company_name,
    },
    // address
    address: {
      address:  data.primary_line1 || "",
      address2: data.primary_line2 || "",
      city:     data.primary_city  || "",
      state:    data.primary_state || "",
      zip:      data.primary_postal_code || "",
      country:  data.primary_country || "",
    },
    // multi-select fields
    industry:         data.industry || "",
    notes:            data.notes    || "",
    marketing_consent: data.marketing_consent || false,
    region_tag:       data.region_tag || "",
    role_in_company:  data.role_in_company || "",
    annual_merchandise_spend: data.annual_merchandise_spend || "",
    hats_usage:           hatsUsage.map(item => ({ hats_usage: item })),
    past_headwear_issues: pastHeadwearIssues.map(item => ({ past_headwear_issues: item })),
    what_most_important:  whatMostImportant.map(item => ({ what_most_important: item })),
    // logo and hat fields (empty defaults)
    logo:          {},
    selectedHats:  [],
    hatColors:     {},
    hatSizes:      {},
  };

  dispatch(saveLead(payload))
    .unwrap() 
    .then((res) => {
      console.log('res',res)
      toast.success("Lead added successfully!");
      reset();
      setHatsUsage([]);
      setPastHeadwearIssues([]);
      setWhatMostImportant([]);
      setSameAddress(false);
      setOpenAddLeadModal(false);
      
      if (onLeadAdded) onLeadAdded(res?.data || res);
    })
    .catch((err) => {
      toast.error(err || "Failed to add lead. Please try again.");
    });
};

  if (!openAddLeadModal) return null;

  const MultiSelectCheckbox = ({ options, selectedValues, onToggle, label, fieldName }) => (
    <div>
      <label style={{
        display: 'block',
        fontSize: '14px',
        fontWeight: '600',
        color: '#374151',
        marginBottom: '8px'
      }}>
        {label}
      </label>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        padding: '12px',
        border: '1px solid #d1d5db',
        borderRadius: '6px',
        backgroundColor: '#f9fafb',
        minHeight: '80px',
        maxHeight: '200px',
        overflowY: 'auto'
      }}>
        {options.map((option) => (
          <label
            key={option}
            style={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              padding: '6px 12px',
              borderRadius: '16px',
              backgroundColor: selectedValues.includes(option) ? '#3B82F6' : '#ffffff',
              color: selectedValues.includes(option) ? '#ffffff' : '#374151',
              border: selectedValues.includes(option) ? '1px solid #3B82F6' : '1px solid #d1d5db',
              fontSize: '13px',
              fontWeight: selectedValues.includes(option) ? '600' : '400',
              transition: 'all 0.2s',
              userSelect: 'none'
            }}
          >
            <input
              type="checkbox"
              checked={selectedValues.includes(option)}
              onChange={() => onToggle(option)}
              style={{
                marginRight: '6px',
                cursor: 'pointer',
                display: 'none'
              }}
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        width: '90%',
        maxWidth: '700px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          onClick={() => {
            setOpenAddLeadModal(false);
            reset();
            setHatsUsage([]);
            setPastHeadwearIssues([]);
            setWhatMostImportant([]);
            setSameAddress(false);
          }}
          disabled={saveLeadLoading}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: saveLeadLoading  ? 'not-allowed' : 'pointer',
            color: '#6b7280',
            padding: '4px',
            opacity: saveLeadLoading  ? 0.5 : 1
          }}
        >
          ×
        </button>

        {/* Modal Header */}
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '700',
            color: '#1f2937',
            margin: 0
          }}>
            Add New Lead
          </h2>
          <p style={{
            fontSize: '14px',
            color: '#6b7280',
            margin: '4px 0 0 0'
          }}>
            Add a new lead to the system
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Name Field */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '6px'
            }}>
              Name *
            </label>
            <input
              type="text"
              {...register('name', { required: 'Name is required' })}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: errors.name ? '1px solid #ef4444' : '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
            />
            {errors.name && (
              <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Company Name Field */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '6px'
            }}>
              Company Name *
            </label>
            <input
              type="text"
              {...register('company_name', { required: 'Company name is required' })}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: errors.company_name ? '1px solid #ef4444' : '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
            />
            {errors.company_name && (
              <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                {errors.company_name.message}
              </p>
            )}
          </div>

          {/* Role in Company Field */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '6px'
            }}>
              Role in Company *
            </label>
            <input
              type="text"
              {...register('role_in_company', { required: 'Role in company is required' })}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: errors.role_in_company ? '1px solid #ef4444' : '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
            />
            {errors.role_in_company && (
              <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                {errors.role_in_company.message}
              </p>
            )}
          </div>

          {/* Hats Usage - Multi Select */}
          <MultiSelectCheckbox
            options={hatsUsageOptions}
            selectedValues={hatsUsage}
            onToggle={toggleHatsUsage}
            label="Hats Usage"
          />

          {/* Past Headwear Issues - Multi Select */}
          <MultiSelectCheckbox
            options={pastHeadwearIssuesOptions}
            selectedValues={pastHeadwearIssues}
            onToggle={togglePastHeadwearIssues}
            label="Past Headwear Issues"
          />

          {/* What Most Important - Multi Select */}
          <MultiSelectCheckbox
            options={whatMostImportantOptions}
            selectedValues={whatMostImportant}
            onToggle={toggleWhatMostImportant}
            label="What's Most Important"
          />

          {/* Annual Merchandise Spend Field */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '6px'
            }}>
              Annual Merchandise Spend
            </label>
            <input
              type="text"
              {...register('annual_merchandise_spend')}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
            />
          </div>

          {/* Email Field */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '6px'
            }}>
              Email *
            </label>
            <input
              type="email"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: errors.email ? '1px solid #ef4444' : '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
            />
            {errors.email && (
              <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone Field */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '6px'
            }}>
              Phone *
            </label>
            <input
              type="tel"
              {...register('phone', { required: 'Phone number is required' })}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: errors.phone ? '1px solid #ef4444' : '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
            />
            {errors.phone && (
              <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Industry Field */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '6px'
            }}>
              Industry
            </label>
            <input
              type="text"
              {...register('industry')}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
            />
          </div>

          {/* Region Tag Field */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '6px'
            }}>
              Region Tag
            </label>
            <input
              type="text"
              {...register('region_tag')}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
            />
          </div>

          {/* Primary Address Section */}
          <div style={{
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '16px',
            backgroundColor: '#f9fafb'
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '16px'
            }}>
              Primary Address
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Primary Address Line 1 */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '6px'
                }}>
                  Address Line 1
                </label>
                <input
                  type="text"
                  {...register('primary_line1')}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                />
              </div>

              {/* Primary Address Line 2 */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '6px'
                }}>
                  Address Line 2
                </label>
                <input
                  type="text"
                  {...register('primary_line2')}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                />
              </div>

              {/* Primary City, State, Postal Code */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    City
                  </label>
                  <input
                    type="text"
                    {...register('primary_city')}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                  />
                </div>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    State
                  </label>
                  <input
                    type="text"
                    {...register('primary_state')}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                  />
                </div>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    Postal Code
                  </label>
                  <input
                    type="text"
                    {...register('primary_postal_code')}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                  />
                </div>
              </div>

              {/* Primary Country */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '6px'
                }}>
                  Country
                </label>
                <input
                  type="text"
                  {...register('primary_country')}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Same Address Checkbox */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={sameAddress}
              onChange={(e) => setSameAddress(e.target.checked)}
              style={{
                width: '18px',
                height: '18px',
                cursor: 'pointer'
              }}
            />
            <label style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              cursor: 'pointer'
            }}>
              Shipping address is same as primary address
            </label>
          </div>

          {/* Shipping Address Section */}
          {!sameAddress && (
            <div style={{
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '16px',
              backgroundColor: '#f9fafb'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '16px'
              }}>
                Shipping Address
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Shipping Address Line 1 */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    Address Line 1
                  </label>
                  <input
                    type="text"
                    {...register('shipping_line1')}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                  />
                </div>

                {/* Shipping Address Line 2 */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    {...register('shipping_line2')}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                  />
                </div>

                {/* Shipping City, State, Postal Code */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      City
                    </label>
                    <input
                      type="text"
                      {...register('shipping_city')}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      State
                    </label>
                    <input
                      type="text"
                      {...register('shipping_state')}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      Postal Code
                    </label>
                    <input
                      type="text"
                      {...register('shipping_postal_code')}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                    />
                  </div>
                </div>

                {/* Shipping Country */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    Country
                  </label>
                  <input
                    type="text"
                    {...register('shipping_country')}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Notes Field */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '6px'
            }}>
              Notes
            </label>
            <textarea
              {...register('notes')}
              rows={3}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                resize: 'vertical',
                transition: 'border-color 0.2s'
              }}
            />
          </div>

          {/* Marketing Consent Field */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              {...register('marketing_consent')}
              style={{
                width: '18px',
                height: '18px',
                cursor: 'pointer'
              }}
            />
            <label style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              cursor: 'pointer'
            }}>
              Marketing Consent
            </label>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end',
            marginTop: '8px'
          }}>
            <button
              type="button"
              onClick={() => {
                setOpenAddLeadModal(false);
                reset();
                setHatsUsage([]);
                setPastHeadwearIssues([]);
                setWhatMostImportant([]);
                setSameAddress(false);
              }}
              disabled={saveLeadLoading }
              style={{
                padding: '10px 20px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                background: 'white',
                cursor: saveLeadLoading  ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                opacity: saveLeadLoading  ? 0.5 : 1
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saveLeadLoading }
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                color: 'white',
                background: saveLeadLoading  
                  ? '#9ca3af' 
                  : 'linear-gradient(135deg, #f20c32 0%, #dc2626 100%)',
                cursor: saveLeadLoading  ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                opacity: saveLeadLoading  ? 0.7 : 1
              }}
            >
              {saveLeadLoading  ? 'Processing...' : 'Add Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLeadModal;
