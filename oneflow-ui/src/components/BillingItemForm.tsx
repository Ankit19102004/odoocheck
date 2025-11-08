import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { IProject, ISalesOrder, IPurchaseOrder, IInvoice, IExpense } from '@shared';
import { FiX } from 'react-icons/fi';
import './BillingItemForm.css';

type BillingItemType = 'invoice' | 'sales-order' | 'purchase-order' | 'expense';

interface BillingItemFormProps {
  type: BillingItemType;
  item?: ISalesOrder | IPurchaseOrder | IInvoice | IExpense;
  onClose: () => void;
  onSuccess?: () => void;
}

const BillingItemForm: React.FC<BillingItemFormProps> = ({ type, item, onClose, onSuccess }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isEditing = !!item;

  const [formData, setFormData] = useState<any>({});
  const [error, setError] = useState('');

  // Fetch projects
  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await api.get('/api/projects');
      return response.data.data as IProject[];
    },
    retry: 1,
  });

  // Fetch sales orders for invoice
  const { data: salesOrders } = useQuery({
    queryKey: ['sales-orders'],
    queryFn: async () => {
      const response = await api.get('/api/sales-orders');
      return response.data.data;
    },
    enabled: type === 'invoice' && !isEditing,
    retry: 1,
  });

  // Initialize form data based on type
  useEffect(() => {
    if (isEditing && item) {
      if (type === 'invoice') {
        const inv = item as IInvoice;
        setFormData({
          project_id: inv.project_id?.toString() || '',
          sales_order_id: inv.sales_order_id?.toString() || '',
          invoice_number: inv.invoice_number || '',
          amount: inv.amount?.toString() || '',
          state: inv.state || 'draft',
        });
      } else if (type === 'sales-order') {
        const so = item as ISalesOrder;
        setFormData({
          project_id: so.project_id?.toString() || '',
          customer_name: so.customer_name || '',
          total_amount: so.total_amount?.toString() || '',
          state: so.state || 'draft',
        });
      } else if (type === 'purchase-order') {
        const po = item as IPurchaseOrder;
        setFormData({
          project_id: po.project_id?.toString() || '',
          vendor_name: po.vendor_name || '',
          total_amount: po.total_amount?.toString() || '',
          state: po.state || 'draft',
        });
      } else if (type === 'expense') {
        const exp = item as IExpense;
        setFormData({
          project_id: exp.project_id?.toString() || '',
          amount: exp.amount?.toString() || '',
          description: exp.description || '',
          billable: exp.billable || false,
          state: exp.state || 'pending',
        });
      }
    } else {
      // Default values for new items
      if (type === 'invoice') {
        setFormData({
          project_id: '',
          sales_order_id: '',
          invoice_number: '',
          amount: '',
          state: 'draft',
        });
      } else if (type === 'sales-order') {
        setFormData({
          project_id: '',
          customer_name: '',
          total_amount: '',
          state: 'draft',
        });
      } else if (type === 'purchase-order') {
        setFormData({
          project_id: '',
          vendor_name: '',
          total_amount: '',
          state: 'draft',
        });
      } else if (type === 'expense') {
        setFormData({
          project_id: '',
          amount: '',
          description: '',
          billable: false,
          state: 'pending',
        });
      }
    }
  }, [type, item, isEditing]);

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const endpoints: Record<BillingItemType, string> = {
        'invoice': '/api/invoices',
        'sales-order': '/api/sales-orders',
        'purchase-order': '/api/purchase-orders',
        'expense': '/api/expenses',
      };
      const response = await api.post(endpoints[type], data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [type === 'sales-order' ? 'sales-orders' : type === 'purchase-order' ? 'purchase-orders' : `${type}s`] });
      onSuccess?.();
      onClose();
    },
    onError: (error: any) => {
      setError(error.response?.data?.error || `Failed to create ${type}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const endpoints: Record<BillingItemType, string> = {
        'invoice': `/api/invoices/${item!.id}`,
        'sales-order': `/api/sales-orders/${item!.id}`,
        'purchase-order': `/api/purchase-orders/${item!.id}`,
        'expense': `/api/expenses/${item!.id}`,
      };
      const response = await api.put(endpoints[type], data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [type === 'sales-order' ? 'sales-orders' : type === 'purchase-order' ? 'purchase-orders' : `${type}s`] });
      onSuccess?.();
      onClose();
    },
    onError: (error: any) => {
      setError(error.response?.data?.error || `Failed to update ${type}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const endpoints: Record<BillingItemType, string> = {
        'invoice': `/api/invoices/${item!.id}`,
        'sales-order': `/api/sales-orders/${item!.id}`,
        'purchase-order': `/api/purchase-orders/${item!.id}`,
        'expense': `/api/expenses/${item!.id}`,
      };
      await api.delete(endpoints[type]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [type === 'sales-order' ? 'sales-orders' : type === 'purchase-order' ? 'purchase-orders' : `${type}s`] });
      onSuccess?.();
      onClose();
    },
    onError: (error: any) => {
      setError(error.response?.data?.error || `Failed to delete ${type}`);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type: inputType } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: inputType === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const submitData: any = { ...formData };
    
    // Convert string numbers to actual numbers
    if (submitData.project_id) submitData.project_id = parseInt(submitData.project_id);
    if (submitData.sales_order_id) submitData.sales_order_id = parseInt(submitData.sales_order_id);
    if (submitData.amount) submitData.amount = parseFloat(submitData.amount);
    if (submitData.total_amount) submitData.total_amount = parseFloat(submitData.total_amount);

    if (isEditing) {
      updateMutation.mutate(submitData);
    } else {
      createMutation.mutate(submitData);
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete this ${type}? This action cannot be undone.`)) {
      deleteMutation.mutate();
    }
  };

  const getTitle = () => {
    const titles = {
      'invoice': 'Invoice',
      'sales-order': 'Sales Order',
      'purchase-order': 'Purchase Order',
      'expense': 'Expense',
    };
    return `${isEditing ? 'Edit' : 'Create'} ${titles[type]}`;
  };

  const getStateOptions = () => {
    if (type === 'invoice') {
      return ['draft', 'sent', 'paid', 'cancelled'];
    } else if (type === 'sales-order') {
      return ['draft', 'sent', 'confirmed', 'cancelled'];
    } else if (type === 'purchase-order') {
      return ['draft', 'sent', 'confirmed', 'received', 'cancelled'];
    } else if (type === 'expense') {
      return ['pending', 'approved', 'rejected', 'paid'];
    }
    return [];
  };

  return (
    <div className="billing-item-form-modal">
      <div className="billing-item-form-content">
        <div className="billing-item-form-header">
          <h2>{getTitle()}</h2>
          <button className="close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="project_id">Project *</label>
            <select
              id="project_id"
              name="project_id"
              value={formData.project_id || ''}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a project</option>
              {projects?.map((project: IProject) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          {type === 'invoice' && !isEditing && (
            <div className="form-group">
              <label htmlFor="sales_order_id">Sales Order (Optional)</label>
              <select
                id="sales_order_id"
                name="sales_order_id"
                value={formData.sales_order_id || ''}
                onChange={handleInputChange}
              >
                <option value="">None</option>
                {salesOrders?.map((so: ISalesOrder) => (
                  <option key={so.id} value={so.id}>
                    {so.customer_name} - ₹{so.total_amount.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>
          )}

          {type === 'invoice' && (
            <div className="form-group">
              <label htmlFor="invoice_number">Invoice Number</label>
              <input
                type="text"
                id="invoice_number"
                name="invoice_number"
                value={formData.invoice_number || ''}
                onChange={handleInputChange}
                placeholder="Auto-generated if empty"
              />
            </div>
          )}

          {(type === 'sales-order' || type === 'purchase-order') && (
            <div className="form-group">
              <label htmlFor={type === 'sales-order' ? 'customer_name' : 'vendor_name'}>
                {type === 'sales-order' ? 'Customer Name' : 'Vendor Name'} *
              </label>
              <input
                type="text"
                id={type === 'sales-order' ? 'customer_name' : 'vendor_name'}
                name={type === 'sales-order' ? 'customer_name' : 'vendor_name'}
                value={formData[type === 'sales-order' ? 'customer_name' : 'vendor_name'] || ''}
                onChange={handleInputChange}
                required
                placeholder={type === 'sales-order' ? 'Enter customer name' : 'Enter vendor name'}
              />
            </div>
          )}

          {type === 'expense' && (
            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description || ''}
                onChange={handleInputChange}
                required
                rows={4}
                placeholder="Enter expense description"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor={type === 'sales-order' || type === 'purchase-order' ? 'total_amount' : 'amount'}>
              Amount (₹) *
            </label>
            <input
              type="number"
              id={type === 'sales-order' || type === 'purchase-order' ? 'total_amount' : 'amount'}
              name={type === 'sales-order' || type === 'purchase-order' ? 'total_amount' : 'amount'}
              value={formData[type === 'sales-order' || type === 'purchase-order' ? 'total_amount' : 'amount'] || ''}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
              placeholder="0.00"
            />
          </div>

          {type === 'expense' && (
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="billable"
                  checked={formData.billable || false}
                  onChange={handleInputChange}
                />
                Billable to client
              </label>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="state">Status</label>
            <select
              id="state"
              name="state"
              value={formData.state || ''}
              onChange={handleInputChange}
            >
              {getStateOptions().map((state) => (
                <option key={state} value={state}>
                  {state.charAt(0).toUpperCase() + state.slice(1).replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            {isEditing && (
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            )}
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '1rem' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {isEditing ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BillingItemForm;

