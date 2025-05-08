import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../config/database'
import { User } from '../User/user.model'

export class File extends Model {
  declare id: string
  declare fileName: string
  declare localUrl: string
  declare size: number
  declare owner: string
  declare hardwarePinHash: string | null
  declare createdBy: string
  declare createdAt: Date
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

File.belongsTo(User, { foreignKey: 'owner', as: 'uploader' })
