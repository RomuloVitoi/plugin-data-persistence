# Disk Persistence Plugin

[![Tests](https://github.com/LyraSearch/plugin-disk-persistence/actions/workflows/tests.yml/badge.svg)](https://github.com/LyraSearch/plugin-disk-persistence/actions/workflows/tests.yml)

Experimental stage, use at your own risk.

# Installation

You can install the disk persistence plugin using `npm`, `yarn`, `pnpm`:

```
npm i @lyrasearch/plugin-disk-persistence
```

```
yarn add @lyrasearch/plugin-disk-persistence
```

```
pnpm add @lyrasearch/plugin-disk-persistence
```

# Usage

You can save and restore a database by using the methods exposed by the `plugin-disk-persistence` package. <br />

Given the following database:

```js
import { create, insert } from '@nearform/lyra'

const myPrimaryDB = create({
  schema: {
    quote: 'string',
    author: 'string'
  }
})

insert(myPrimaryDB, {
  quote: 'Impossible is for the unwilling',
  author: 'John Keats'
})

insert(myPrimaryDB, {
  quote: 'I have not failed. I’ve just found 10,000 ways that won’t work.',
  author: 'Thomas A. Edison'
})
```

you can save the database to disk:

```js
import { persist } from '@lyrasearch/plugin-disk-persistence'

persist(myPrimaryDB, 'binary')
```

Available formats are:

- `binary`: saves the database to a compressed, binary file using `dpack` algorithm (**recommended**)
- `json`: saves the database to a JSON file

The `persist` function accepts as a third argument the file name.
When no argument, a default name will be used: `lyra_bump_623432432`.

Note: you can use the environment variable `LYRA_DB_NAME` to override the default name.

At this point, you can also restore the database from disk:

```js
import { search } from '@nearform/lyra'
import { restore } from '@lyrasearch/plugin-disk-persistence'

const mySecondaryDB = restore('binary')

search(mySecondaryDB, {
  term: 'work'
})
```

# License
[Apache-2.0](/LICENSE.md)
