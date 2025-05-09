import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../config/database'
import { User } from '../User/user.model'
import { ArduinoConfig } from '../ArduinoConfig/arduino.model'

export class File extends Model {
  declare id: string
  declare fileName: string
  declare localUrl: string
  declare size: number
  declare owner: string
  declare hardwarePinHash: string | null
  declare createdBy: string
  declare createdAt: Date
  declare arduinoConfigId: number | null
}

File.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    fileName: { type: DataTypes.STRING, allowNull: false },
    localUrl: { type: DataTypes.STRING, allowNull: false },
    size: { type: DataTypes.INTEGER, allowNull: false },
    owner: { type: DataTypes.UUID, allowNull: false },
    hardwarePinHash: { type: DataTypes.STRING, allowNull: true },
    createdBy: { type: DataTypes.UUID, allowNull: false },
    arduinoConfigId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'arduino_configs',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'files',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    underscored: true,
  }
)

// Associations
File.belongsTo(User, { foreignKey: 'owner', as: 'uploader' })
File.belongsTo(ArduinoConfig, {
  foreignKey: 'arduinoConfigId',
  as: 'arduinoConfig',
})
