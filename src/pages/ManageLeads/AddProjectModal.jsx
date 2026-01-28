import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { leadListSearch, kanbanAddProject } from '../../Reducer/AddSlice';
import AddLeadModal from './AddLeadModal';

const AddProjectModal = ({ 
  isOpen, 
  onClose, 
  onProjectAdded 
}) => {
  const dispatch = useDispatch();
  const { leadListSearchData } = useSelector((state) => state.add);

  const [projectType, setProjectType] = useState('existing');
  const [showNewLeadModal, setShowNewLeadModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [newLeadId, setNewLeadId] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm({
    defaultValues: {
      projectType: 'existing',
      leadId: '',
      orderTypes: [],
      orderAmount: '',
      expense: '',
      expectedCloseDate: ''
    }
  });

  // Watch for project type changes
  const watchedProjectType = watch('projectType');

  // Handle project type changes
  const handleProjectTypeChange = (type) => {
    setProjectType(type);
    setValue('projectType', type);
    
    // Clear selected lead and search when switching types
    setSelectedLead(null);
    setSearchTerm('');
    setValue('leadId', '');
    setShowDropdown(false);
  };

  // Trigger lead search from redux when user types
  useEffect(() => {
    if (searchTerm && searchTerm.trim().length >= 2) {
      dispatch(leadListSearch(searchTerm.trim()));
    } else {
      setFilteredLeads([]);
    }
  }, [dispatch, searchTerm]);

  // Map search results to dropdown options
  useEffect(() => {
    const list = leadListSearchData?.data || [];
    if (Array.isArray(list) && list.length > 0) {
      const mapped = list.map((lead) => ({
        id: lead.id,
        LeadName: lead.name,
        Email: lead.email
      }));
      setFilteredLeads(mapped.slice(0, 10));
    } else {
      setFilteredLeads([]);
    }
  }, [leadListSearchData]);

  // Handle search term changes - clear selected lead if search is cleared
  useEffect(() => {
    if (!searchTerm) {
      setSelectedLead(null);
      setValue('leadId', '');
    }
  }, [searchTerm, setValue]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      reset();
      setProjectType('existing');
      setSearchTerm('');
      setSelectedLead(null);
      setNewLeadId(null);
    }
  }, [isOpen, reset]);

  // Handle lead selection from dropdown
  const handleLeadSelect = (lead) => {
    setSelectedLead(lead);
    setValue('leadId', lead.id);
    setSearchTerm(lead?.LeadName || '');
    setShowDropdown(false);
  };

  // Handle new lead creation success
  const handleNewLeadCreated = (newLead) => {
    console.log("New lead created:", newLead);
    
    // Normalize lead payload keys
    const leadData = {
      id: newLead?.lead_id || newLead?.id,
      LeadName: newLead?.lead_name || newLead?.name,
      Email: newLead?.lead_email || newLead?.email
    };
    
    console.log("Processed lead data:", leadData);
    
    setNewLeadId(leadData.id);
    setSelectedLead(leadData);
    setValue('leadId', leadData.id);
    setSearchTerm(leadData.LeadName || '');
    setShowNewLeadModal(false);
    // toast.success('Lead created successfully!');
  };

  // Handle form submission
  const onSubmit = async (data) => {
    console.log('Project form data:', data);
    
    // Validate required fields
    if (!data.leadId) {
      toast.error('Please select a lead');
      return;
    }
    
    if (!data.orderTypes || data.orderTypes.length === 0) {
      toast.error('Please select at least one order type');
      return;
    }
    
    if (!data.orderAmount || data.orderAmount <= 0) {
      toast.error('Please enter a valid order amount');
      return;
    }
    if (data.expense !== '' && Number(data.expense) < 0) {
      toast.error('Expense cannot be negative');
      return;
    }

    // Prepare project data payload
    const payload = {
      lead_id: parseInt(data.leadId),
      order_type: Array.isArray(data.orderTypes) ? data.orderTypes : [data.orderTypes],
      order_origin: data.projectType === 'existing' ? 'CONVERTED_FROM_SAMPLE' : 'DIRECT_NEW_CUSTOMER',
      order_amount: parseFloat(data.orderAmount),
      expense: data.expense === '' ? 0 : parseFloat(data.expense),
      expected_close_date: data.expectedCloseDate || null
    };

    console.log('Submitting project payload:', payload);
    
    try {
      const result = await dispatch(kanbanAddProject(payload)).unwrap();
      console.log('Project added successfully:', result);
      toast.success('Project added successfully!');
      
      // Call the callback to refresh data
      if (onProjectAdded) {
        onProjectAdded(payload);
      }
      
      // Close modal
      onClose();
    } catch (error) {
      console.error('Error adding project:', error);
      toast.error('Failed to add project. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Add New Project</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Project Type Radio Buttons */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Project Type
              </label>
              <div className="flex space-x-6">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="existing"
                    {...register('projectType')}
                    className="mr-2"
                    checked={projectType === 'existing'}
                    onChange={(e) => handleProjectTypeChange(e.target.value)}
                  />
                  <span className="text-sm text-gray-700">Existing Lead</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="new"
                    {...register('projectType')}
                    className="mr-2"
                    checked={projectType === 'new'}
                    onChange={(e) => handleProjectTypeChange(e.target.value)}
                  />
                  <span className="text-sm text-gray-700">New Lead</span>
                </label>
              </div>
            </div>

            {/* Lead Selection */}
            {projectType === 'existing' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Lead <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by lead name or email..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  
                  {/* Dropdown */}
                  {showDropdown && filteredLeads.length > 0 && (
                    <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {filteredLeads.map((lead) => (
                        <div
                          key={lead.id}
                          onClick={() => handleLeadSelect(lead)}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100"
                        >
                          <div className="font-medium text-sm">{lead?.LeadName}</div>
                          <div className="text-xs text-gray-500">{lead.Email}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {errors.leadId && (
                  <p className="text-red-500 text-xs mt-1">Please select a lead</p>
                )}
              </div>
            )}

            {/* New Lead Button */}
            {projectType === 'new' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Create New Lead
                </label>
                <button
                  type="button"
                  onClick={() => setShowNewLeadModal(true)}
                  className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-gray-400 hover:text-gray-700"
                >
                  + Click to Add New Lead
                </button>
                {selectedLead && (
                  <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-sm text-green-700">
                      Selected: {selectedLead?.LeadName} ({selectedLead?.Email})
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Order Types */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order Types <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {['HEADWEAR', 'SCREENPRINT', 'EMBROIDERY', 'PROMO'].map((type) => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      value={type}
                      {...register('orderTypes')}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">{type}</span>
                  </label>
                ))}
              </div>
              {errors.orderTypes && (
                <p className="text-red-500 text-xs mt-1">Please select at least one order type</p>
              )}
            </div>

            {/* Order Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order Amount <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                {...register('orderAmount', { 
                  required: 'Order amount is required',
                  min: { value: 0.01, message: 'Order amount must be greater than 0' }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter order amount"
              />
              {errors.orderAmount && (
                <p className="text-red-500 text-xs mt-1">{errors.orderAmount.message}</p>
              )}
            </div>

            {/* Expense */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expense
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                {...register('expense')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter expense"
              />
            </div>

            {/* Expected Close Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expected Close Date (Optional)
              </label>
              <input
                type="date"
                {...register('expectedCloseDate')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
              >
                Add Project
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* New Lead Modal */}
      {showNewLeadModal && (
        <AddLeadModal
          openAddLeadModal={showNewLeadModal}
          setOpenAddLeadModal={setShowNewLeadModal}
          onLeadAdded={handleNewLeadCreated}
        />
      )}
    </>
  );
};

export default AddProjectModal;
