import type { PropertiesSchema, Lyra } from '@nearform/lyra'
import type { PersistenceFormat, AvailableRuntimes } from './types'
import { save, create } from '@nearform/lyra'
// @ts-expect-error dpack does not expose types
import * as dpack from 'dpack'
import { encode, decode } from '@msgpack/msgpack'
import { DPACK_NOT_SUPPORTED_ON_DENO, UNSUPPORTED_FORMAT } from './errors'

export const DEFAULT_DB_NAME = `lyra_bump_${+new Date()}`

export function getDefaultFileName (format: PersistenceFormat, runtime: AvailableRuntimes): string {
  let extension: string

  switch (format) {
    case 'json':
      extension = 'json'
      break
    case 'dpack':
      if (runtime === 'deno') {
        throw new Error(DPACK_NOT_SUPPORTED_ON_DENO())
      }
      extension = 'dpack'
      break
    case 'binary':
      extension = 'msp'
  }

  const dbName = process?.env?.LYRA_DB_NAME || DEFAULT_DB_NAME

  return `${dbName}.${extension}`
}

export function persist<T extends PropertiesSchema> (db: Lyra<T>, format: PersistenceFormat = 'binary', isBrowser = false): string | Buffer {
  const dbExport = save(db)
  let serialized: string | Buffer

  switch (format) {
    case 'json':
      serialized = JSON.stringify(dbExport)
      break
    case 'dpack':
      serialized = dpack.serialize(dbExport)
      break
    case 'binary':
      const msgpack = encode(dbExport)
      serialized = Buffer.from(msgpack.buffer, msgpack.byteOffset, msgpack.byteLength)
      if (isBrowser) {
        serialized = serialized.toString('hex')
      }
      break
    default:
      throw new Error(UNSUPPORTED_FORMAT(format))
  }

  return serialized
}

export function restore<T extends PropertiesSchema> (format: PersistenceFormat = 'binary', data: string | Buffer, isBrowser = false): Lyra<T> {
  const db = create({
    schema: {
      __placeholder: 'string'
    }
  })
  let deserialized: any

  switch (format) {
    case 'json':
      deserialized = JSON.parse(data.toString())
      break
    case 'dpack':
      deserialized = dpack.parse(data)
      break
    case 'binary':
      if (isBrowser) {
        data = Buffer.from(data.toString(), 'hex')
      }
      deserialized = decode((data as Buffer).buffer)
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
