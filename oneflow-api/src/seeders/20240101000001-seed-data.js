'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    // Hash passwords
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Insert users
    const users = await queryInterface.bulkInsert('users', [
      {
        first_name: 'Admin',
        last_name: 'User',
        email: 'admin@oneflow.com',
        password_hash: hashedPassword,
        role: 'admin',
        hourly_rate: 100.00,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        first_name: 'John',
        last_name: 'Manager',
        email: 'manager@oneflow.com',
        password_hash: hashedPassword,
        role: 'project_manager',
        hourly_rate: 75.00,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        first_name: 'Alice',
        last_name: 'Developer',
        email: 'alice@oneflow.com',
        password_hash: hashedPassword,
        role: 'team_member',
        hourly_rate: 50.00,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        first_name: 'Bob',
        last_name: 'Designer',
        email: 'bob@oneflow.com',
        password_hash: hashedPassword,
        role: 'team_member',
        hourly_rate: 45.00,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        first_name: 'Carol',
        last_name: 'Accountant',
        email: 'carol@oneflow.com',
        password_hash: hashedPassword,
        role: 'sales_finance',
        hourly_rate: 60.00,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], { returning: true });

    // Get user IDs from the inserted users
    const insertedUsers = await queryInterface.sequelize.query(
      "SELECT id, email FROM users ORDER BY id",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    
    const adminId = insertedUsers.find(u => u.email === 'admin@oneflow.com').id;
    const managerId = insertedUsers.find(u => u.email === 'manager@oneflow.com').id;
    const aliceId = insertedUsers.find(u => u.email === 'alice@oneflow.com').id;
    const bobId = insertedUsers.find(u => u.email === 'bob@oneflow.com').id;
    const carolId = insertedUsers.find(u => u.email === 'carol@oneflow.com').id;

    // Insert projects
    const projectsResult = await queryInterface.bulkInsert('projects', [
      {
        name: 'Website Redesign',
        description: 'Complete redesign of company website',
        manager_id: managerId,
        deadline: new Date('2024-12-31'),
        priority: 'high',
        budget: 50000.00,
        status: 'active',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Mobile App Development',
        description: 'iOS and Android app development',
        manager_id: managerId,
        deadline: new Date('2025-06-30'),
        priority: 'medium',
        budget: 100000.00,
        status: 'planning',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], { returning: true });

    // Get project IDs
    const insertedProjects = await queryInterface.sequelize.query(
      "SELECT id FROM projects ORDER BY id",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    
    const project1Id = insertedProjects[0].id;
    const project2Id = insertedProjects[1].id;

    // Insert project tags
    await queryInterface.bulkInsert('project_tags', [
      { project_id: project1Id, tag: 'frontend' },
      { project_id: project1Id, tag: 'design' },
      { project_id: project2Id, tag: 'mobile' },
      { project_id: project2Id, tag: 'backend' },
    ]);

    // Insert tasks
    const tasksResult = await queryInterface.bulkInsert('tasks', [
      {
        project_id: project1Id,
        title: 'Design homepage',
        description: 'Create modern homepage design',
        assignee_id: bobId,
        status: 'in_progress',
        priority: 'high',
        deadline: new Date('2024-11-30'),
        time_estimate: 40.00,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        project_id: project1Id,
        title: 'Implement responsive layout',
        description: 'Make website responsive for all devices',
        assignee_id: aliceId,
        status: 'new',
        priority: 'high',
        deadline: new Date('2024-12-15'),
        time_estimate: 60.00,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        project_id: project1Id,
        title: 'Setup CI/CD pipeline',
        assignee_id: aliceId,
        status: 'done',
        priority: 'medium',
        time_estimate: 20.00,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        project_id: project2Id,
        title: 'Design app wireframes',
        assignee_id: bobId,
        status: 'new',
        priority: 'high',
        time_estimate: 30.00,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], { returning: true });

    // Get task IDs
    const insertedTasks = await queryInterface.sequelize.query(
      "SELECT id FROM tasks ORDER BY id",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // Insert timesheets
    await queryInterface.bulkInsert('timesheets', [
      {
        task_id: insertedTasks[0].id,
        user_id: bobId,
        date: new Date('2024-11-01'),
        hours: 8.00,
        billable: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        task_id: insertedTasks[2].id,
        user_id: aliceId,
        date: new Date('2024-10-25'),
        hours: 6.00,
        billable: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    // Insert sales orders
    const salesOrdersResult = await queryInterface.bulkInsert('sales_orders', [
      {
        project_id: project1Id,
        customer_name: 'ABC Corporation',
        total_amount: 50000.00,
        state: 'confirmed',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], { returning: true });

    // Get sales order ID
    const insertedSalesOrders = await queryInterface.sequelize.query(
      "SELECT id FROM sales_orders ORDER BY id",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // Insert purchase orders
    await queryInterface.bulkInsert('purchase_orders', [
      {
        project_id: project1Id,
        vendor_name: 'Hosting Provider Inc',
        total_amount: 5000.00,
        state: 'confirmed',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    // Get purchase order ID
    const insertedPurchaseOrders = await queryInterface.sequelize.query(
      "SELECT id FROM purchase_orders ORDER BY id",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // Insert invoices
    await queryInterface.bulkInsert('invoices', [
      {
        project_id: project1Id,
        sales_order_id: insertedSalesOrders[0].id,
        invoice_number: 'INV-2024-001',
        amount: 50000.00,
        state: 'sent',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    // Insert vendor bills
    await queryInterface.bulkInsert('vendor_bills', [
      {
        project_id: project1Id,
        purchase_order_id: insertedPurchaseOrders[0].id,
        amount: 5000.00,
        state: 'paid',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    // Insert expenses
    await queryInterface.bulkInsert('expenses', [
      {
        project_id: project1Id,
        user_id: aliceId,
        amount: 150.00,
        description: 'Software license',
        billable: true,
        state: 'approved',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('expenses', null, {});
    await queryInterface.bulkDelete('vendor_bills', null, {});
    await queryInterface.bulkDelete('invoices', null, {});
    await queryInterface.bulkDelete('purchase_orders', null, {});
    await queryInterface.bulkDelete('sales_orders', null, {});
    await queryInterface.bulkDelete('timesheets', null, {});
    await queryInterface.bulkDelete('tasks', null, {});
    await queryInterface.bulkDelete('project_tags', null, {});
    await queryInterface.bulkDelete('projects', null, {});
    await queryInterface.bulkDelete('users', null, {});
  }
};

