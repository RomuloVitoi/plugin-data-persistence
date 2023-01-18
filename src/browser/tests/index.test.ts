import t from 'tap'
import { create, insert, search } from '@lyrasearch/lyra'
import { Lyra } from '@lyrasearch/lyra/dist/types'
import { restore, persist } from '../../browser'

async function generateTestDBInstance (): Promise<Lyra<any>> {
  const db = await create({
    schema: {
      quote: 'string',
      author: 'string'
    }
  })

  await insert(db, {
    quote: 'I am a great programmer',
    author: 'Bill Gates'
  })

  await insert(db, {
    quote: 'Be yourself; everyone else is already taken.',
    author: 'Oscar Wilde'
  })

  await insert(db, {
    quote: 'I have not failed. I\'ve just found 10,000 ways that won\'t work.',
    author: 'Thomas A. Edison'
  })

  await insert(db, {
    quote: 'The only way to do great work is to love what you do.',
    author: 'Steve Jobs'
  })

  return db
}

t.test('binary persistence', t => {
  t.plan(1)

  t.test('should persist and restore the database in binary format', async t => {
    t.plan(2)

    const db = await generateTestDBInstance()
    const q1 = await search(db, {
      term: 'way'
    })

    const q2 = await search(db, {
      term: 'i'
    })

    // Persist database in-memory in binary format
    const data = await persist(db, 'binary')

    // Load database from disk in binary format
    const db2 = await restore('binary', data)

    const qp1 = await search(db2, {
      term: 'way'
    })

    const qp2 = await search(db2, {
      term: 'i'
    })

    // Queries on the loaded database should match the original database
    t.same(q1.hits, qp1.hits)
    t.same(q2.hits, qp2.hits)
  })
})

t.test('json persistence', t => {
  t.plan(1)

  t.test('should persist and restore the database in json format', async t => {
    t.plan(2)

    const db = await generateTestDBInstance()
    const q1 = await search(db, {
      term: 'way'
    })

    const q2 = await search(db, {
      term: 'i'
    })

    // Persist database in-memory in json format
    const data = await persist(db, 'json')

    // Load database from memory in json format
    const db2 = await restore('json', data)

    const qp1 = await search(db2, {
      term: 'way'
    })

    const qp2 = await search(db2, {
      term: 'i'
    })

    // Queries on the loaded database should match the original database
    t.same(q1.hits, qp1.hits)
    t.same(q2.hits, qp2.hits)
  })
})

t.test('dpack persistence', t => {
  t.plan(1)

  t.test('should persist and restore the database in dpack format', async t => {
    t.plan(2)

    const db = await generateTestDBInstance()
    const q1 = await search(db, {
      term: 'way'
    })

    const q2 = await search(db, {
      term: 'i'
    })

    // Persist database on disk in dpack format
    const data = await persist(db, 'dpack')

    // Load database from disk in dpack format
    const db2 = await restore('dpack', data)

    const qp1 = await search(db2, {
      term: 'way'
    })

    const qp2 = await search(db2, {
      term: 'i'
    })

    // Queries on the loaded database should match the original database
    t.same(q1.hits, qp1.hits)
    t.same(q2.hits, qp2.hits)
  })
})
