import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import { useState } from "react";

const AddLeadModal = ({ openAddLeadModal, setOpenAddLeadModal, onLeadAdded }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        "https://n8n.bestworks.cloud/webhook/add-new-lead",
        data
      );
      
      console.log("Lead added successfully:", response.data);
      toast.success("Lead added successfully!");
      // toast.success(response.data.message);
      reset();
      setOpenAddLeadModal(false);
      
      // Call the callback to refresh the leads list
      if (onLeadAdded) {
        console.log("Calling onLeadAdded callback with lead data");
        // Pass the lead data to the callback
        const leadData = response.data[0]; // Get the first (and only) lead from response
        onLeadAdded(leadData);
      } else {
        console.log("onLeadAdded callback not provided");
      }
    } catch (error) {
      console.error("Error adding lead:", error);
      toast.error("Failed to add lead. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!openAddLeadModal) return null;

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
            setOpenAddLeadModal(false);
            reset();
          }}
          disabled={isSubmitting}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            color: '#6b7280',
            padding: '4px',
            opacity: isSubmitting ? 0.5 : 1
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
        
  {/* First Name Field */}
  <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '6px'
            }}>
              First Name *
            </label>
            <input
              type="text"
              {...register('First Name', { required: 'First name is required' })}
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
              Last Name *
            </label>
            <input
              type="text"
              {...register('Last Name', { required: 'Last name is required' })}
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
              Address *
            </label>
            <input
              type="text"
              {...register('Address', { required: 'Address is required' })}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: errors['Address'] ? '1px solid #ef4444' : '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
            />
             {errors['Address'] && (
              <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                {errors['Address'].message}
              </p>
            )}
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
              City *
            </label>
            <input
              type="text"
              {...register('City', { required: 'City is required' })}
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
              State *
            </label>
            <input
              type="text"
              {...register('State', { required: 'State is required' })}
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
              Zip Code *
            </label>
            <input
              type="text"
              {...register('Zip Code', { required: 'Zip Code is required' })}
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
  {/* Country Field */}
  <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '6px'
            }}>
              Country *
            </label>
            <input
              type="text"
              {...register('Country', { required: 'Country is required' })}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: errors['Country'] ? '1px solid #ef4444' : '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
            />
            {errors['Country'] && (
              <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                {errors['Country'].message}
              </p>
            )}
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
              }}
              disabled={isSubmitting}
              style={{
                padding: '10px 20px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                background: 'white',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                opacity: isSubmitting ? 0.5 : 1
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                color: 'white',
                background: isSubmitting 
                  ? '#9ca3af' 
                  : 'linear-gradient(135deg, #f20c32 0%, #dc2626 100%)',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                opacity: isSubmitting ? 0.7 : 1
              }}
            >
              {isSubmitting ? 'Processing...' : 'Add Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLeadModal;
