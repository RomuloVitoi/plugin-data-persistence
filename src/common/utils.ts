import type { PersistenceFormat, AvailableRuntimes } from './types'
import { DPACK_NOT_SUPPORTED_ON_DENO } from './errors'

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
