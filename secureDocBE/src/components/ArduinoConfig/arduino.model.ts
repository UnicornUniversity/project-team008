import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../config/database'

export class ArduinoConfig extends Model {
  declare id: string
  declare consoleHash: string
  declare enabled: boolean
  declare createdAt: Date
  declare updatedAt: Date
}

ArduinoConfig.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    consoleHash: { type: DataTypes.STRING, allowNull: false },
    enabled: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  {
    sequelize,
    tableName: 'arduino_configs',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true,
  }
)
