import type { PersistenceFormat } from '../common/types'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { Lyra, PropertiesSchema } from '@nearform/lyra'
import { getDefaultFileName, persist as persistDB, restore as restoreDB } from '../common/utils'

function getDefaultOutputDir (format: PersistenceFormat): string {
  return join(process.cwd(), getDefaultFileName(format, 'node'))
}

export function persist<T extends PropertiesSchema> (db: Lyra<T>, format: PersistenceFormat = 'binary', path: string = getDefaultOutputDir(format)): string {
  const serialized = persistDB(db, format)

  writeFileSync(path, serialized)

  return path
}

export function restore<T extends PropertiesSchema> (format: PersistenceFormat = 'binary', path: string = getDefaultOutputDir(format)): Lyra<T> {
  const data = readFileSync(path)
  return restoreDB(format, data)
}
