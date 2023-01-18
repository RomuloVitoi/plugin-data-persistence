import type { PersistenceFormat } from '../common/types'
import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'
import { Lyra, PropertiesSchema } from '@lyrasearch/lyra/dist/types'
import { getDefaultFileName, persist as persistDB, restore as restoreDB } from '../common/utils'

function getDefaultOutputDir (format: PersistenceFormat): string {
  return join(process.cwd(), getDefaultFileName(format, 'node'))
}

export async function persistToFile<T extends PropertiesSchema> (db: Lyra<T>, format: PersistenceFormat = 'binary', path: string = getDefaultOutputDir(format)): Promise<string> {
  const serialized = await persistDB(db, format)

  await writeFile(path, serialized)

  return path
}

export async function restoreFromFile<T extends PropertiesSchema> (format: PersistenceFormat = 'binary', path: string = getDefaultOutputDir(format)): Promise<Lyra<T>> {
  const data = await readFile(path)
  return restoreDB(format, data)
}

export function importInstance<T extends PropertiesSchema>(data: string | Buffer, format: PersistenceFormat): Promise<Lyra<T>> {
  return restoreDB(format, data)
}

export function exportInstance<T extends PropertiesSchema> (db: Lyra<T>, format: PersistenceFormat = 'binary'): Promise<string | Buffer> {
  return persistDB(db, format)
}
