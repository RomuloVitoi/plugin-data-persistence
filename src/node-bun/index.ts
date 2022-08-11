import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
// @ts-expect-error dpack does not expose types
import { serialize, parse } from 'dpack'
import { encode, decode } from '@msgpack/msgpack'
import { create, save, Lyra, PropertiesSchema } from '@nearform/lyra'
import { DEFAULT_DB_NAME } from '../common/utils'
import { UNSUPPORTED_FORMAT } from '../common/errors'

export type PersistenceFormat =
  | 'json'
  | 'dpack'
  | 'binary'

function getDefaultOutputDir(format: PersistenceFormat): string {
  let extension: string

  switch (format) {
    case 'json':
      extension = 'json'
      break
    case 'dpack':
      extension = 'dpack'
      break
    case 'binary':
      extension = 'msp'
  }

  const dbName = process.env.LYRA_DB_NAME || DEFAULT_DB_NAME
  const fileName = `${dbName}.${extension}`

  return join(process.cwd(), fileName)
}

export function persist<T extends PropertiesSchema>(db: Lyra<T>, format: PersistenceFormat = 'binary', path: string = getDefaultOutputDir(format)): string {
  const dbExport = save(db)
  let serialized: string | Buffer

  switch (format) {
    case 'json':
      serialized = JSON.stringify(dbExport)
      break
    case 'dpack':
      serialized = serialize(dbExport)
      break
    case 'binary':
      const msgpack = encode(dbExport)
      serialized = Buffer.from(msgpack.buffer, msgpack.byteOffset, msgpack.byteLength)
      break
    default:
      throw new Error(UNSUPPORTED_FORMAT(format))
  }

  writeFileSync(path, serialized)

  return path
}

export function restore<T extends PropertiesSchema>(format: PersistenceFormat = 'binary', path: string = getDefaultOutputDir(format)): Lyra<T> {
  const db = create({
    schema: {
      __placeholder: 'string'
    }
  });
  const data = readFileSync(path)
  let deserialized: any

  switch (format) {
    case 'json':
      deserialized = JSON.parse(data.toString())
      break
    case 'dpack':
      deserialized = parse(data)
      break
    case 'binary':
      deserialized = decode(data.buffer)
      break
    default:
      throw new Error(UNSUPPORTED_FORMAT(format))
  }

  db.index = deserialized.index
  db.docs = deserialized.docs
  db.nodes = deserialized.nodes
  db.schema = deserialized.schema
  return db as unknown as Lyra<T>
}
