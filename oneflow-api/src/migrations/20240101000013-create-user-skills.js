'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_skills', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      skill_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      proficiency_level: {
        type: Sequelize.ENUM('beginner', 'intermediate', 'advanced', 'expert'),
        allowNull: false,
        defaultValue: 'intermediate',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addIndex('user_skills', ['user_id'], { name: 'idx_user_skills_user_id' });
    await queryInterface.addIndex('user_skills', ['skill_name'], { name: 'idx_user_skills_skill_name' });
    await queryInterface.addConstraint('user_skills', {
      fields: ['user_id', 'skill_name'],
      type: 'unique',
      name: 'unique_user_skill',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user_skills');
  }
};

