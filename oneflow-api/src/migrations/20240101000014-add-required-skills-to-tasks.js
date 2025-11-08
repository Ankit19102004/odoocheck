'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('tasks', 'required_skills', {
      type: Sequelize.JSON,
      allowNull: true,
      comment: 'Array of required skill names for this task',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('tasks', 'required_skills');
  }
};

