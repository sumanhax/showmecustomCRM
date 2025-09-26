import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import { useEffect } from "react";

const UpdateLeadModal = ({ openUpdateLeadModal, setOpenUpdateLeadModal, leadData, onLeadUpdated }) => {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  // Pre-fill form when leadData changes
  useEffect(() => {
    if (leadData && openUpdateLeadModal) {
      // Set basic fields
      setValue('Lead Name', leadData['Lead Name'] || '');
      setValue('Email', leadData['Email'] || '');
      setValue('Phone', leadData['Phone'] || '');
      setValue('Company Name', leadData['Company Name'] || '');
      setValue('Address', leadData['Address'] || '');
      setValue('First Name', leadData['First Name'] || '');
      setValue('Last Name', leadData['Last Name'] || '');
      setValue('Phone Number', leadData['Phone Number'] || '');
      setValue('City', leadData['City'] || '');
      setValue('State', leadData['State'] || '');
      setValue('Zip Code', leadData['Zip Code'] || '');
    }
  }, [leadData, openUpdateLeadModal, setValue]);

  const onSubmit = async (data) => {
    try {
      const updateData = {
        ...data,
        id: leadData.id
      };

      const response = await axios.put(
        "https://n8nnode.bestworks.cloud/webhook/update-lead",
        updateData
      );
      
      console.log("Lead updated successfully:", response.data);
      toast.success("Lead updated successfully!");
      reset();
      setOpenUpdateLeadModal(false);
      
      // Call the callback to refresh the leads list
      if (onLeadUpdated) {
        onLeadUpdated();
      }
    } catch (error) {
      console.error("Error updating lead:", error);
      toast.error("Failed to update lead. Please try again.");
    }
  };

  if (!openUpdateLeadModal || !leadData) return null;

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
        maxWidth: '600px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          onClick={() => {
            setOpenUpdateLeadModal(false);
            reset();
          }}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#6b7280',
            padding: '4px'
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
            Update Lead
          </h2>
          <p style={{
            fontSize: '14px',
            color: '#6b7280',
            margin: '4px 0 0 0'
          }}>
            Update lead information
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Lead Name Field */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '6px'
            }}>
              Lead Name *
            </label>
            <input
              type="text"
              {...register('Lead Name', { required: 'Lead name is required' })}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: errors['Lead Name'] ? '1px solid #ef4444' : '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
            />
            {errors['Lead Name'] && (
              <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                {errors['Lead Name'].message}
              </p>
            )}
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
              {...register('Email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: errors.Email ? '1px solid #ef4444' : '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
            />
            {errors.Email && (
              <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                {errors.Email.message}
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
              {...register('Phone', { required: 'Phone number is required' })}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: errors.Phone ? '1px solid #ef4444' : '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
            />
            {errors.Phone && (
              <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                {errors.Phone.message}
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
              {...register('Company Name', { required: 'Company name is required' })}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: errors['Company Name'] ? '1px solid #ef4444' : '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
            />
            {errors['Company Name'] && (
              <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                {errors['Company Name'].message}
              </p>
            )}
          </div>

          {/* Address Field */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '6px'
            }}>
              Address
            </label>
            <textarea
              {...register('Address')}
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

          {/* First Name Field */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '6px'
            }}>
              First Name
            </label>
            <input
              type="text"
              {...register('First Name')}
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

          {/* Last Name Field */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '6px'
            }}>
              Last Name
            </label>
            <input
              type="text"
              {...register('Last Name')}
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

          {/* Phone Number Field (alternative) */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '6px'
            }}>
              Phone Number (Alternative)
            </label>
            <input
              type="tel"
              {...register('Phone Number')}
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

          {/* City Field */}
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
              {...register('City')}
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

          {/* State Field */}
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
              {...register('State')}
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

          {/* Zip Code Field */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '6px'
            }}>
              Zip Code
            </label>
            <input
              type="text"
              {...register('Zip Code')}
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
                setOpenUpdateLeadModal(false);
                reset();
              }}
              style={{
                padding: '10px 20px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                background: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                color: 'white',
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Update Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateLeadModal;
