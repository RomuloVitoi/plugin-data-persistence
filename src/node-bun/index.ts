import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
// @ts-expect-error
import { serialize, parse } from 'dpack'
import { save, load as loadLyra, Lyra, PropertiesSchema, create, insert, search } from '@nearform/lyra'
import { DEFAULT_DB_NAME } from '../common/utils'

export type PersistenceFormat =
  | 'json'
  | 'binary'

function getDefaultOutputDir(format: PersistenceFormat): string {
  let extension: string

  switch (format) {
    case 'json':
      extension = 'json'
      break
    case 'binary':
      extension = 'dpack'
      break
  }

  const fileName = `${DEFAULT_DB_NAME}.${extension}`

  return join(process.cwd(), fileName)
}

export function persist<T extends PropertiesSchema>(db: Lyra<T>, format: PersistenceFormat = 'binary', path: string = getDefaultOutputDir(format)): string {
  const dbExport = save(db)
  let serialized: string

  switch (format) {
    case 'json':
      serialized = JSON.stringify(dbExport)
      break
    case 'binary':
      serialized = serialize(dbExport)
      break
    default:
      throw new Error(`Unsupported serialization format: ${format}`)
  }

  writeFileSync(path, serialized)

  return path
}

export function load<T extends PropertiesSchema>(db: Lyra<T>, format: PersistenceFormat = 'binary', path: string = getDefaultOutputDir(format)): Lyra<T> {
  const data = readFileSync(path)
  let deserialized: any;

  switch (format) {
    case 'json':
      deserialized = JSON.parse(data.toString())
      break;
    case 'binary':
      deserialized = parse(data);
      break;
    default:
      throw new Error(`Unsupported serialization format: ${format}`);
  }

  // loadLyra(db, deserialized)
  db.index = deserialized.index;
  db.docs = deserialized.docs;
  db.nodes = deserialized.nodes;
  db.schema = deserialized.schema;
  return db
}