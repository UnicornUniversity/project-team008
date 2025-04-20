import { FileAccess } from './fileAccess.model'
import { File } from '../File/file.model'

export class FileAccessService {
  static async listForFile(fileId: string) {
    return FileAccess.findAll({ where: { fileId } })
  }

  static async grantAccess(
    fileId: string,
    userId: string,
    permission: 'read' | 'write' = 'read'
  ) {
    // optionally check if req.user owns the file or has write
    const fa = await FileAccess.create({ fileId, userId, permission })
    return fa
  }
}
