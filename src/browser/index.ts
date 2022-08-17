import type { PersistenceFormat } from '../common/types'
import type { Lyra, PropertiesSchema } from '@nearform/lyra'
import { persist as persistDB, restore as restoreDB } from '../common/utils'

export function persist<T extends PropertiesSchema> (db: Lyra<T>, format: PersistenceFormat = 'binary'): string | Buffer {
  return persistDB(db, format, true)
}

export function restore<T extends PropertiesSchema> (format: PersistenceFormat = 'binary', data: string | Buffer): Lyra<T> {
  return restoreDB(format, data, true)
}
