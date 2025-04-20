import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../config/database'

export class User extends Model {
  declare id: number
  declare email: string
  declare password: string
  declare role: 'user' | 'admin'
  declare createdAt: Date
  declare updatedAt: Date
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('user', 'admin'), defaultValue: 'user' },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true,
  }
)
