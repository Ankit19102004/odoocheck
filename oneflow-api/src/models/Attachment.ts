import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface AttachmentAttributes {
  id: number;
  owner_type: string;
  owner_id: number;
  filename: string;
  url: string;
  created_at: Date;
  updated_at: Date;
}

interface AttachmentCreationAttributes extends Optional<AttachmentAttributes, 'id' | 'created_at' | 'updated_at'> {}

class Attachment extends Model<AttachmentAttributes, AttachmentCreationAttributes> implements AttachmentAttributes {
  public id!: number;
  public owner_type!: string;
  public owner_id!: number;
  public filename!: string;
  public url!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Attachment.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    owner_type: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    owner_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    filename: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'attachments',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['owner_type', 'owner_id'],
      },
    ],
  }
);

export default Attachment;

