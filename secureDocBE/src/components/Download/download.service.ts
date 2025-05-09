// File: src/components/Download/download.service.ts
import { File } from '../File/file.model'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { ArduinoConfig } from '../ArduinoConfig/arduino.model'
import { FileAccess } from '../FileAccess/fileAccess.model'
dotenv.config()

export class DownloadService {
  static async generateToken(
    userId: string,
    id: number,
    hardwarePin?: string,
    arduinoId?: number
  ): Promise<string> {
    const f = await File.findByPk(id)
    if (!f) throw Object.assign(new Error('Not found'), { status: 404 })

    // 1) owner or shared
    if (f.owner !== userId) {
      const access = await FileAccess.findOne({
        where: { fileId: id, userId },
      })
      if (!access) {
        throw Object.assign(new Error('Forbidden'), { status: 403 })
      }
    }

    // 2) hardware PIN check
    if (f.hardwarePinHash && f.arduinoConfigId == arduinoId) {
      const cfg = await ArduinoConfig.findByPk(arduinoId)
      if (!cfg) {
        throw Object.assign(new Error('Forbidden - non existing Arduino.'), {
          status: 403,
        })
      }

      if (!hardwarePin || !(hardwarePin === f.hardwarePinHash)) {
        throw Object.assign(new Error('Forbidden - Wrong PIN!'), {
          status: 403,
        })
      }
    }

    // 3) Arduino config check
    if (f.arduinoConfigId) {
      if (arduinoId == null) {
        throw Object.assign(new Error('Forbidden'), { status: 403 })
      }
      const cfg = await ArduinoConfig.findByPk(arduinoId)
      if (!cfg) {
        throw Object.assign(new Error('Forbidden - non existing Arduino.'), {
          status: 403,
        })
      }

      if (arduinoId === f.arduinoConfigId) {
        // TODO: different arduinos
        throw Object.assign(new Error('Forbidden - invalid Arduino device'), {
          status: 403,
        })
      }
    }

    // all checks passed → sign token
    return jwt.sign({ fileId: id }, process.env.DOWNLOAD_TOKEN_SECRET!, {
      expiresIn: '5m',
    })
  }

  static async verifyTokenAndGetPath(
    id: number,
    token: string
  ): Promise<string> {
    let payload: any
    try {
      payload = jwt.verify(token, process.env.DOWNLOAD_TOKEN_SECRET!) as {
        fileId: number
      }
    } catch {
      throw Object.assign(new Error('Invalid or expired download token'), {
        status: 403,
      })
    }
    if (payload.fileId !== id) {
      throw Object.assign(new Error('Token does not match file'), {
        status: 403,
      })
    }

    const f = await File.findByPk(id)
    if (!f) throw Object.assign(new Error('Not found'), { status: 404 })
    return f.localUrl
  }
}
