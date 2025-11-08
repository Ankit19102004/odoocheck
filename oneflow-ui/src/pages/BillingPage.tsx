import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { FiPlus, FiDollarSign, FiFileText, FiFile, FiCreditCard, FiEdit2, FiTrash2 } from "react-icons/fi";
import BillingItemForm from "../components/BillingItemForm";
import { formatCurrency } from "../utils/currency";
import type { ISalesOrder, IPurchaseOrder, IInvoice, IExpense } from "@shared";
import "./BillingPage.css";

const BillingPage: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"invoices" | "sales-orders" | "purchase-orders" | "expenses">("invoices");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<ISalesOrder | IPurchaseOrder | IInvoice | IExpense | null>(null);
  const [formType, setFormType] = useState<"invoice" | "sales-order" | "purchase-order" | "expense">("invoice");

  const { data: invoices, isLoading: invoicesLoading } = useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      const response = await api.get("/api/invoices");
      return response.data.data;
    },
    retry: 1,
  });

  const { data: salesOrders, isLoading: salesOrdersLoading } = useQuery({
    queryKey: ["sales-orders"],
    queryFn: async () => {
      const response = await api.get("/api/sales-orders");
      return response.data.data;
    },
    enabled: user?.role === "admin" || user?.role === "sales_finance",
    retry: 1,
  });

  const { data: purchaseOrders, isLoading: purchaseOrdersLoading } = useQuery({
    queryKey: ["purchase-orders"],
    queryFn: async () => {
      const response = await api.get("/api/purchase-orders");
      return response.data.data;
    },
    enabled: user?.role === "admin" || user?.role === "sales_finance",
    retry: 1,
  });

  const { data: expenses, isLoading: expensesLoading } = useQuery({
    queryKey: ["expenses"],
    queryFn: async () => {
      const response = await api.get("/api/expenses");
      return response.data.data;
    },
    retry: 1,
  });

  // Calculate totals
  const totalRevenue = invoices?.filter((inv: any) => inv.state === "paid").reduce((sum: number, inv: any) => sum + parseFloat(inv.amount || 0), 0) || 0;
  const pendingInvoices = invoices?.filter((inv: any) => inv.state === "sent").reduce((sum: number, inv: any) => sum + parseFloat(inv.amount || 0), 0) || 0;
  const totalExpenses = expenses?.reduce((sum: number, exp: any) => sum + parseFloat(exp.amount || 0), 0) || 0;
  const netProfit = totalRevenue - totalExpenses;


  const handleNewEntry = () => {
    let formTypeValue: "invoice" | "sales-order" | "purchase-order" | "expense";
    if (activeTab === "invoices") {
      formTypeValue = "invoice";
    } else if (activeTab === "sales-orders") {
      formTypeValue = "sales-order";
    } else if (activeTab === "purchase-orders") {
      formTypeValue = "purchase-order";
    } else {
      formTypeValue = "expense";
    }
    setFormType(formTypeValue);
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEdit = (item: ISalesOrder | IPurchaseOrder | IInvoice | IExpense) => {
    setEditingItem(item);
    let formTypeValue: "invoice" | "sales-order" | "purchase-order" | "expense";
    if (activeTab === "invoices") {
      formTypeValue = "invoice";
    } else if (activeTab === "sales-orders") {
      formTypeValue = "sales-order";
    } else if (activeTab === "purchase-orders") {
      formTypeValue = "purchase-order";
    } else {
      formTypeValue = "expense";
    }
    setFormType(formTypeValue);
    setShowForm(true);
  };

  const handleDelete = async (item: ISalesOrder | IPurchaseOrder | IInvoice | IExpense, type: "invoice" | "sales-order" | "purchase-order" | "expense") => {
    if (!window.confirm(`Are you sure you want to delete this ${type}? This action cannot be undone.`)) {
      return;
    }

    try {
      const endpoints: Record<typeof type, string> = {
        'invoice': `/api/invoices/${item.id}`,
        'sales-order': `/api/sales-orders/${item.id}`,
        'purchase-order': `/api/purchase-orders/${item.id}`,
        'expense': `/api/expenses/${item.id}`,
      };
      await api.delete(endpoints[type]);
      handleSuccess();
    } catch (error: any) {
      alert(error.response?.data?.error || `Failed to delete ${type}`);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: [activeTab === "sales-orders" ? "sales-orders" : activeTab === "purchase-orders" ? "purchase-orders" : `${activeTab}`] });
    queryClient.invalidateQueries({ queryKey: ["invoices"] });
    queryClient.invalidateQueries({ queryKey: ["expenses"] });
    queryClient.invalidateQueries({ queryKey: ["sales-orders"] });
    queryClient.invalidateQueries({ queryKey: ["purchase-orders"] });
  };

  const canManageBilling = user?.role === "admin" || user?.role === "sales_finance";
  const canCreateInvoice = user?.role === "admin" || user?.role === "sales_finance" || user?.role === "project_manager";
  const canCreateExpense = true; // All authenticated users can create expenses

  const getCurrentData = () => {
    switch (activeTab) {
      case "invoices":
        return invoices || [];
      case "sales-orders":
        return salesOrders || [];
      case "purchase-orders":
        return purchaseOrders || [];
      case "expenses":
        return expenses || [];
      default:
        return [];
    }
  };

  const isLoading = () => {
    switch (activeTab) {
      case "invoices":
        return invoicesLoading;
      case "sales-orders":
        return salesOrdersLoading;
      case "purchase-orders":
        return purchaseOrdersLoading;
      case "expenses":
        return expensesLoading;
      default:
        return false;
    }
  };

  const renderTable = () => {
    const data = getCurrentData();
    const loading = isLoading();

    if (loading) {
      return <div className="loading">Loading {activeTab}...</div>;
    }

    if (activeTab === "invoices") {
      return (
        <table>
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Project</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Created</th>
              {(canCreateInvoice || canManageBilling) && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((invoice: IInvoice) => (
                <tr key={invoice.id}>
                  <td>{invoice.invoice_number || `INV-${invoice.id}`}</td>
                  <td>{invoice.project?.name || "N/A"}</td>
                  <td>{formatCurrency(parseFloat(invoice.amount?.toString() || "0"))}</td>
                  <td>
                    <span className={`status ${invoice.state || "draft"}`}>
                      {invoice.state || "Draft"}
                    </span>
                  </td>
                  <td>{invoice.created_at ? new Date(invoice.created_at).toLocaleDateString() : "N/A"}</td>
                  {(canCreateInvoice || canManageBilling) && (
                    <td>
                      <div className="action-buttons">
                        <button className="action-btn edit" onClick={() => handleEdit(invoice)} title="Edit">
                          <FiEdit2 />
                        </button>
                        {canManageBilling && (
                          <button className="action-btn delete" onClick={() => handleDelete(invoice, "invoice")} title="Delete">
                            <FiTrash2 />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "2rem" }}>
                  No invoices found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      );
    }

    if (activeTab === "sales-orders") {
      return (
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Project</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Created</th>
              {canManageBilling && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((order: ISalesOrder) => (
                <tr key={order.id}>
                  <td>SO-{order.id}</td>
                  <td>{order.customer_name}</td>
                  <td>{order.project?.name || "N/A"}</td>
                  <td>{formatCurrency(parseFloat(order.total_amount?.toString() || "0"))}</td>
                  <td>
                    <span className={`status ${order.state || "draft"}`}>
                      {order.state || "Draft"}
                    </span>
                  </td>
                  <td>{order.created_at ? new Date(order.created_at).toLocaleDateString() : "N/A"}</td>
                  {canManageBilling && (
                    <td>
                      <div className="action-buttons">
                        <button className="action-btn edit" onClick={() => handleEdit(order)} title="Edit">
                          <FiEdit2 />
                        </button>
                        <button className="action-btn delete" onClick={() => handleDelete(order, "sales-order")} title="Delete">
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "2rem" }}>
                  No sales orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      );
    }

    if (activeTab === "purchase-orders") {
      return (
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Vendor</th>
              <th>Project</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Created</th>
              {canManageBilling && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((order: IPurchaseOrder) => (
                <tr key={order.id}>
                  <td>PO-{order.id}</td>
                  <td>{order.vendor_name}</td>
                  <td>{order.project?.name || "N/A"}</td>
                  <td>{formatCurrency(parseFloat(order.total_amount?.toString() || "0"))}</td>
                  <td>
                    <span className={`status ${order.state || "draft"}`}>
                      {order.state || "Draft"}
                    </span>
                  </td>
                  <td>{order.created_at ? new Date(order.created_at).toLocaleDateString() : "N/A"}</td>
                  {canManageBilling && (
                    <td>
                      <div className="action-buttons">
                        <button className="action-btn edit" onClick={() => handleEdit(order)} title="Edit">
                          <FiEdit2 />
                        </button>
                        <button className="action-btn delete" onClick={() => handleDelete(order, "purchase-order")} title="Delete">
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "2rem" }}>
                  No purchase orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      );
    }

    if (activeTab === "expenses") {
      return (
        <table>
          <thead>
            <tr>
              <th>Expense ID</th>
              <th>Description</th>
              <th>Project</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Created</th>
              {(canCreateExpense || canManageBilling) && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((expense: IExpense) => (
                <tr key={expense.id}>
                  <td>EXP-{expense.id}</td>
                  <td>{expense.description || "N/A"}</td>
                  <td>{expense.project?.name || "N/A"}</td>
                  <td>{formatCurrency(parseFloat(expense.amount?.toString() || "0"))}</td>
                  <td>
                    <span className={`status ${expense.state || "pending"}`}>
                      {expense.state || "Pending"}
                    </span>
                  </td>
                  <td>{expense.created_at ? new Date(expense.created_at).toLocaleDateString() : "N/A"}</td>
                  {(canCreateExpense || canManageBilling) && (
                    <td>
                      <div className="action-buttons">
                        <button className="action-btn edit" onClick={() => handleEdit(expense)} title="Edit">
                          <FiEdit2 />
                        </button>
                        {canManageBilling && (
                          <button className="action-btn delete" onClick={() => handleDelete(expense, "expense")} title="Delete">
                            <FiTrash2 />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "2rem" }}>
                  No expenses found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      );
    }

    return null;
  };

  const canCreateNewEntry = () => {
    if (activeTab === "invoices") return canCreateInvoice;
    if (activeTab === "sales-orders" || activeTab === "purchase-orders") return canManageBilling;
    if (activeTab === "expenses") return canCreateExpense;
    return false;
  };

  return (
    <div className="billing-page">
      <div className="billing-header">
        <div>
          <h1 className="billing-title">Billing & Finance</h1>
          <p className="billing-subtitle">
            Manage sales orders, invoices, expenses, and vendor bills
          </p>
        </div>
        {canCreateNewEntry() && (
          <button className="new-entry-btn" onClick={handleNewEntry}>
            <FiPlus className="btn-icon" />
            New Entry
          </button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card green-border">
          <div>
            <h4>Total Revenue</h4>
            <h2>{formatCurrency(totalRevenue)}</h2>
          </div>
          <FiDollarSign className="summary-icon green" />
        </div>

        <div className="summary-card yellow-border">
          <div>
            <h4>Pending Invoices</h4>
            <h2>{formatCurrency(pendingInvoices)}</h2>
          </div>
          <FiFileText className="summary-icon yellow" />
        </div>

        <div className="summary-card red-border">
          <div>
            <h4>Total Expenses</h4>
            <h2>{formatCurrency(totalExpenses)}</h2>
          </div>
          <FiFile className="summary-icon red" />
        </div>

        <div className="summary-card blue-border">
          <div>
            <h4>Net Profit</h4>
            <h2>{formatCurrency(netProfit)}</h2>
          </div>
          <FiCreditCard className="summary-icon blue" />
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === "invoices" ? "active" : ""}`}
          onClick={() => setActiveTab("invoices")}
        >
          Invoices
        </button>
        {(canManageBilling) && (
          <>
            <button
              className={`tab ${activeTab === "sales-orders" ? "active" : ""}`}
              onClick={() => setActiveTab("sales-orders")}
            >
              Sales Orders
            </button>
            <button
              className={`tab ${activeTab === "purchase-orders" ? "active" : ""}`}
              onClick={() => setActiveTab("purchase-orders")}
            >
              Purchase Orders
            </button>
          </>
        )}
        <button
          className={`tab ${activeTab === "expenses" ? "active" : ""}`}
          onClick={() => setActiveTab("expenses")}
        >
          Expenses
        </button>
      </div>

      {/* Table */}
      <div className="billing-table">
        {renderTable()}
      </div>

      {/* Form Modal */}
      {showForm && (
        <BillingItemForm
          type={formType}
          item={editingItem || undefined}
          onClose={handleCloseForm}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};

export default BillingPage;
