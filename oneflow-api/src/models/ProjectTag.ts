import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import Project from './Project';

interface ProjectTagAttributes {
  id: number;
  project_id: number;
  tag: string;
}

interface ProjectTagCreationAttributes extends Optional<ProjectTagAttributes, 'id'> {}

class ProjectTag extends Model<ProjectTagAttributes, ProjectTagCreationAttributes> implements ProjectTagAttributes {
  public id!: number;
  public project_id!: number;
  public tag!: string;
}

ProjectTag.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    project_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'projects',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    tag: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'project_tags',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['project_id', 'tag'],
      },
    ],
  }
);

ProjectTag.belongsTo(Project, { foreignKey: 'project_id' });
Project.hasMany(ProjectTag, { foreignKey: 'project_id', as: 'tags' });

export default ProjectTag;

