import { File } from '../File/file.model'
import bcrypt from 'bcrypt'

export class DownloadService {
  static async getDownloadLink(id: string, hardwarePin?: string) {
    const f = await File.findByPk(id)
    if (!f) throw new Error('Not found')
    if (f.hardwarePinHash) {
      if (
        !hardwarePin ||
        !(await bcrypt.compare(hardwarePin, f.hardwarePinHash))
      ) {
        const err: any = new Error('Forbidden')
        err.status = 403
        throw err
      }
    }
    // In real life generate signed URL or token
    return { download_url: `http://localhost:3000/files/${id}` }
  }
}
