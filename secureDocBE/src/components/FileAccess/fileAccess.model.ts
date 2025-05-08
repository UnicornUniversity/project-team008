import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../config/database'

export class FileAccess extends Model {
  declare id: string
  declare fileId: string
  declare userId: string
  declare permission: 'read' | 'write'
  declare createdAt: Date
}

FileAccess.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    fileId: { type: DataTypes.UUID, allowNull: false },
    userId: { type: DataTypes.UUID, allowNull: false },
    permission: { type: DataTypes.ENUM('read', 'write'), allowNull: false },
  },
  {
    sequelize,
    tableName: 'file_accesses',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    underscored: true,
  }
)
