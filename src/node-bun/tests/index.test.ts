import { rmSync } from 'node:fs'
import t from 'tap'
import { create, insert, Lyra, search } from '@nearform/lyra'
import { restore, persist } from '../../node-bun'

function generateTestDBInstance(): Lyra<any> {
  const db = create({
    schema: {
      quote: 'string',
      author: 'string'
    }
  })

  insert(db, {
    quote: 'I am a great programmer',
    author: 'Bill Gates'
  })

  insert(db, {
    quote: 'Be yourself; everyone else is already taken.',
    author: 'Oscar Wilde'
  })

  insert(db, {
    quote: 'I have not failed. I\'ve just found 10,000 ways that won\'t work.',
    author: 'Thomas A. Edison'
  })

  insert(db, {
    quote: 'The only way to do great work is to love what you do.',
    author: 'Steve Jobs'
  })

  return db
}

t.test('binary persistence', async t => {
  t.plan(2)

  t.test('should generate a persistence file on the disk with random name', async t => {
    t.plan(2)

    const db = generateTestDBInstance()
    const q1 = search(db, {
      term: 'way'
    })

    const q2 = search(db, {
      term: 'i'
    })

    // Persist database on disk in binary format
    const path = await persist(db, 'binary')

    // Load database from disk in binary format
    const db2 = restore('binary')

    const qp1 = search(db2, {
      term: 'way'
    })

    const qp2 = search(db2, {
      term: 'i'
    })

    // Queries on the loaded database should match the original database
    t.same(q1.hits, qp1.hits)
    t.same(q2.hits, qp2.hits)

    // Clean up
    rmSync(path)
  })

  t.test('should generate a persistence file on the disk with a given name', async t => {
    t.plan(2)

    const db = generateTestDBInstance()
    const q1 = search(db, {
      term: 'way'
    })

    const q2 = search(db, {
      term: 'i'
    })

    // Persist database on disk in binary format
    const path = await persist(db, 'binary', 'test.dpack')

    // Load database from disk in binary format
    const db2 = restore('binary', 'test.dpack')

    const qp1 = search(db2, {
      term: 'way'
    })

    const qp2 = search(db2, {
      term: 'i'
    })

    // Queries on the loaded database should match the original database
    t.same(q1.hits, qp1.hits)
    t.same(q2.hits, qp2.hits)

    // Clean up
    rmSync(path)
  })
})
