import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import { useEffect } from "react";

const UpdateRepModal = ({ openUpdateRepModal, setOpenUpdateRepModal, repData, onRepUpdated }) => {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  // Pre-fill form when repData changes
  useEffect(() => {
    if (repData && openUpdateRepModal) {
      // Set basic fields
      setValue('rep_name', repData['Rep Name'] || '');
      setValue('email', repData['Email Address'] || '');
      setValue('phone', repData['Phone Number'] || '');
    }
  }, [repData, openUpdateRepModal, setValue]);

  const onSubmit = async (data) => {
    try {
      const updateData = {
        ...data,
        id: repData.id
      };

      const response = await axios.post(
        "https://n8nnode.bestworks.cloud/webhook/update-rep",
        updateData
      );
      
      console.log("Rep updated successfully:", response.data);
      toast.success("Rep updated successfully!");
      reset();
      setOpenUpdateRepModal(false);
      
      // Call the callback to refresh the reps list
      if (onRepUpdated) {
        onRepUpdated();
      }
    } catch (error) {
      console.error("Error updating rep:", error);
      toast.error("Failed to update rep. Please try again.");
    }
  };

  if (!openUpdateRepModal || !repData) return null;

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
        maxWidth: '500px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          onClick={() => {
            setOpenUpdateRepModal(false);
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
            Update Rep
          </h2>
          <p style={{
            fontSize: '14px',
            color: '#6b7280',
            margin: '4px 0 0 0'
          }}>
            Update rep information
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Rep Name Field */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '6px'
            }}>
              Rep Name *
            </label>
            <input
              type="text"
              {...register('rep_name', { required: 'Rep name is required' })}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: errors.rep_name ? '1px solid #ef4444' : '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
            />
            {errors.rep_name && (
              <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                {errors.rep_name.message}
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
              Email Address *
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
              Phone Number *
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
                setOpenUpdateRepModal(false);
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
              Update Rep
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateRepModal;
