import type { PersistenceFormat } from '../common/types'
import type { Lyra, PropertiesSchema } from '@lyrasearch/lyra/dist/types'
import { persist as persistDB, restore as restoreDB } from '../common/utils'

export function persist<T extends PropertiesSchema> (db: Lyra<T>, format: PersistenceFormat = 'binary'): Promise<string | Buffer> {
  return persistDB(db, format)
}

export function restore<T extends PropertiesSchema> (format: PersistenceFormat = 'binary', data: string | Buffer): Promise<Lyra<T>> {
  return restoreDB(format, data)
}
