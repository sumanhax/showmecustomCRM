import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { addLead } from "../../Reducer/AddSlice";

const AddLeadModal = ({ openAddLeadModal, setOpenAddLeadModal, onLeadAdded,  }) => {
  const { register, handleSubmit, reset, formState: { errors }, watch } = useForm();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.add);
  
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
    // Build primary address object
    const primaryAddress = {
      line1: data.primary_line1 || "",
      line2: data.primary_line2 || "",
      city: data.primary_city || "",
      state: data.primary_state || "",
      postal_code: data.primary_postal_code || "",
      country: data.primary_country || ""
    };

    // Build shipping address object
    const shippingAddress = sameAddress ? primaryAddress : {
      line1: data.shipping_line1 || "",
      line2: data.shipping_line2 || "",
      city: data.shipping_city || "",
      state: data.shipping_state || "",
      postal_code: data.shipping_postal_code || "",
      country: data.shipping_country || ""
    };

    // Transform data to match payload structure
    const payload = {
      name: data.name,
      company_name: data.company_name,
      role_in_company: data.role_in_company,
      hats_usage: hatsUsage.map(item => ({ hats_usage: item })),
      past_headwear_issues: pastHeadwearIssues.map(item => ({ past_headwear_issues: item })),
      what_most_important: whatMostImportant.map(item => ({ what_most_important: item })),
      annual_merchandise_spend: data.annual_merchandise_spend,
      email: data.email,
      phone: data.phone,
      industry: data.industry,
      notes: data.notes || "",
      marketing_consent: data.marketing_consent || false,
      region_tag: data.region_tag || "",
      primary_address: primaryAddress
    };

    // Only include shipping_address if it's different from primary
    if (!sameAddress) {
      payload.shipping_address = shippingAddress;
    }

    dispatch(addLead(payload))
      .then((res) => {
        console.log("res", res);
        if (res.payload?.status_code === 200 || res.payload?.status_code === 201) {
          toast.success(res?.payload?.message || "Lead added successfully!");
          reset();
          setHatsUsage([]);
          setPastHeadwearIssues([]);
          setWhatMostImportant([]);
          setSameAddress(false);
          setOpenAddLeadModal(false);
          // Call the callback to refresh the leads list
          if (onLeadAdded) {
            onLeadAdded(res?.payload?.data);
          }
        } else {
          toast.error(res?.payload?.message || "Failed to add lead");
        }
      })
      .catch((err) => {
        console.log("err", err);
        toast.error(err?.message || "Failed to add lead. Please try again.");
      });
  };

  if (!openAddLeadModal) return null;

  // Multi-select checkbox component
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
          disabled={loading}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: loading ? 'not-allowed' : 'pointer',
            color: '#6b7280',
            padding: '4px',
            opacity: loading ? 0.5 : 1
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
              disabled={loading}
              style={{
                padding: '10px 20px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                background: 'white',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                opacity: loading ? 0.5 : 1
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                color: 'white',
                background: loading 
                  ? '#9ca3af' 
                  : 'linear-gradient(135deg, #f20c32 0%, #dc2626 100%)',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Processing...' : 'Add Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLeadModal;
