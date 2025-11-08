import { Request, Response, NextFunction } from 'express';
import { sequelize } from '../config/database';
import Invoice from '../models/Invoice';
import VendorBill from '../models/VendorBill';
import Expense from '../models/Expense';
import Timesheet from '../models/Timesheet';
import User from '../models/User';
import Task from '../models/Task';
import Project from '../models/Project';

export const getProjectAnalytics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const project = await Project.findByPk(id);
    if (!project) {
      res.status(404).json({ success: false, error: 'Project not found' });
      return;
    }

    // Calculate revenue (sum of paid invoices)
    const invoices = await Invoice.findAll({
      where: {
        project_id: id,
        state: 'paid',
      },
    });
    const revenue = invoices.reduce((sum, inv) => sum + parseFloat(inv.amount.toString()), 0);

    // Calculate costs
    // 1. Vendor bills
    const vendorBills = await VendorBill.findAll({
      where: {
        project_id: id,
        state: 'paid',
      },
    });
    const vendorBillCost = vendorBills.reduce((sum, vb) => sum + parseFloat(vb.amount.toString()), 0);

    // 2. Timesheets (hours * hourly_rate)
    const tasks = await Task.findAll({
      where: { project_id: id },
      attributes: ['id'],
    });
    const taskIds = tasks.map((t) => t.id);

    const timesheets = await Timesheet.findAll({
      where: {
        task_id: taskIds,
      },
      include: [{ model: User, as: 'user', attributes: ['hourly_rate'] }],
    });

    let timesheetCost = 0;
    for (const ts of timesheets) {
      const user = await User.findByPk(ts.user_id);
      if (user) {
        timesheetCost += parseFloat(ts.hours.toString()) * parseFloat(user.hourly_rate.toString());
      }
    }

    // 3. Expenses
    const expenses = await Expense.findAll({
      where: {
        project_id: id,
        state: 'paid',
      },
    });
    const expenseCost = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount.toString()), 0);

    const totalCost = vendorBillCost + timesheetCost + expenseCost;
    const profit = revenue - totalCost;

    // Calculate hours logged
    const hoursLogged = timesheets.reduce((sum, ts) => sum + parseFloat(ts.hours.toString()), 0);

    res.json({
      success: true,
      data: {
        project_id: parseInt(id),
        revenue,
        cost: totalCost,
        profit,
        hours_logged: hoursLogged,
        invoice_count: invoices.length,
        expense_count: expenses.length,
        timesheet_count: timesheets.length,
        breakdown: {
          vendor_bills: vendorBillCost,
          timesheets: timesheetCost,
          expenses: expenseCost,
        },
      },
    });
  } catch (error: any) {
    next(error);
  }
};

