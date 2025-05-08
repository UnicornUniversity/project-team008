// src/components/FileAccess/fileAccess.service.ts

import { FileAccess } from './fileAccess.model'

export class FileAccessService {
  static async listForFile(fileId: string) {
    return FileAccess.findAll({ where: { fileId } })
  }

  static async grantAccess(
    fileId: string,
    userId: string,
    permission: 'read' | 'write' = 'read'
  ) {
    const [entry, created] = await FileAccess.findOrCreate({
      where: { fileId, userId },
      defaults: { permission },
    })

    if (!created) {
      if (entry.permission !== permission) {
        entry.permission = permission
        await entry.save()
      }
    }

    return entry
  }

  static async revokeAccess(fileId: string, userId: string) {
    const count = await FileAccess.destroy({
      where: { fileId, userId },
    })
    if (!count) {
      const err = new Error('Access entry not found')
      // Mark it 404 so router can use err.status
      ;(err as any).status = 404
      throw err
    }
  }
}
