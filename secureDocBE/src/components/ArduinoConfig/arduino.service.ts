import { ArduinoConfig } from './arduino.model'

export class ArduinoService {
  static async list() {
    return ArduinoConfig.findAll()
  }
  static async create(data: Partial<ArduinoConfig>) {
    return ArduinoConfig.create(data)
  }
  static async getById(id: string) {
    const cfg = await ArduinoConfig.findByPk(id)
    if (!cfg) throw new Error('Not found')
    return cfg
  }
  static async update(id: string, data: any) {
    const [cnt, [updated]] = await ArduinoConfig.update(data, {
      where: { id },
      returning: true,
    })
    if (!cnt) throw new Error('Not found')
    return updated
  }
  static async delete(id: string) {
    const cnt = await ArduinoConfig.destroy({ where: { id } })
    if (!cnt) throw new Error('Not found')
  }
}
