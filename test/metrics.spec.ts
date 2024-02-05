import { execSync } from 'node:child_process'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'

describe('Metrics routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should be able to get a total of meals', async () => {
    const createUserResponse = await request(app.server).post('/users').send({
      name: 'Lucas',
      email: 'lucas@email.com',
    })

    const cookies = createUserResponse.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .send({
        name: 'Sanduíche',
        description:
          'Sanduíche de pão integral com atum e salada de alface e tomate',
        datetimeMeal: '2024-02-04 20:31',
        isDiet: true,
      })
      .set('Cookie', cookies)

    await request(app.server)
      .post('/meals')
      .send({
        name: 'Sanduíche',
        description:
          'Sanduíche de pão integral com atum e salada de alface e tomate',
        datetimeMeal: '2024-02-04 20:31',
        isDiet: true,
      })
      .set('Cookie', cookies)

    await request(app.server)
      .post('/meals')
      .send({
        name: 'Sanduíche',
        description:
          'Sanduíche de pão integral com atum e salada de alface e tomate',
        datetimeMeal: '2024-02-04 20:31',
        isDiet: true,
      })
      .set('Cookie', cookies)

    const getMetricsResponse = await request(app.server)
      .get('/metrics')
      .set('Cookie', cookies)
      .expect(200)

    expect(getMetricsResponse.body.metrics.total).toEqual(3)
  })

  it('should be able to get meals within the diet', async () => {
    const createUserResponse = await request(app.server).post('/users').send({
      name: 'Lucas',
      email: 'lucas@email.com',
    })

    const cookies = createUserResponse.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .send({
        name: 'Sanduíche',
        description:
          'Sanduíche de pão integral com atum e salada de alface e tomate',
        datetimeMeal: '2024-02-04 20:31',
        isDiet: true,
      })
      .set('Cookie', cookies)

    await request(app.server)
      .post('/meals')
      .send({
        name: 'Sanduíche',
        description:
          'Sanduíche de pão integral com atum e salada de alface e tomate',
        datetimeMeal: '2024-02-04 20:31',
        isDiet: false,
      })
      .set('Cookie', cookies)

    await request(app.server)
      .post('/meals')
      .send({
        name: 'Sanduíche',
        description:
          'Sanduíche de pão integral com atum e salada de alface e tomate',
        datetimeMeal: '2024-02-04 20:31',
        isDiet: true,
      })
      .set('Cookie', cookies)

    const getMetricsResponse = await request(app.server)
      .get('/metrics/diet/true')
      .set('Cookie', cookies)
      .expect(200)

    expect(getMetricsResponse.body.metrics.total).toEqual(2)
  })

  it('should be able to get meals out of the diet', async () => {
    const createUserResponse = await request(app.server).post('/users').send({
      name: 'Lucas',
      email: 'lucas@email.com',
    })

    const cookies = createUserResponse.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .send({
        name: 'Sanduíche',
        description:
          'Sanduíche de pão integral com atum e salada de alface e tomate',
        datetimeMeal: '2024-02-04 20:31',
        isDiet: true,
      })
      .set('Cookie', cookies)

    await request(app.server)
      .post('/meals')
      .send({
        name: 'Sanduíche',
        description:
          'Sanduíche de pão integral com atum e salada de alface e tomate',
        datetimeMeal: '2024-02-04 20:31',
        isDiet: false,
      })
      .set('Cookie', cookies)

    await request(app.server)
      .post('/meals')
      .send({
        name: 'Sanduíche',
        description:
          'Sanduíche de pão integral com atum e salada de alface e tomate',
        datetimeMeal: '2024-02-04 20:31',
        isDiet: true,
      })
      .set('Cookie', cookies)

    const getMetricsResponse = await request(app.server)
      .get('/metrics/diet/false')
      .set('Cookie', cookies)
      .expect(200)

    expect(getMetricsResponse.body.metrics.total).toEqual(1)
  })

  it('should be able to get meals within the diet sequence', async () => {
    const createUserResponse = await request(app.server).post('/users').send({
      name: 'Lucas',
      email: 'lucas@email.com',
    })

    const cookies = createUserResponse.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .send({
        name: 'Sanduíche',
        description:
          'Sanduíche de pão integral com atum e salada de alface e tomate',
        datetimeMeal: '2024-02-04 20:31',
        isDiet: true,
      })
      .set('Cookie', cookies)

    await request(app.server)
      .post('/meals')
      .send({
        name: 'Sanduíche',
        description:
          'Sanduíche de pão integral com atum e salada de alface e tomate',
        datetimeMeal: '2024-02-04 20:31',
        isDiet: true,
      })
      .set('Cookie', cookies)

    await request(app.server)
      .post('/meals')
      .send({
        name: 'Sanduíche',
        description:
          'Sanduíche de pão integral com atum e salada de alface e tomate',
        datetimeMeal: '2024-02-04 20:31',
        isDiet: false,
      })
      .set('Cookie', cookies)

    await request(app.server)
      .post('/meals')
      .send({
        name: 'Sanduíche',
        description:
          'Sanduíche de pão integral com atum e salada de alface e tomate',
        datetimeMeal: '2024-02-04 20:31',
        isDiet: true,
      })
      .set('Cookie', cookies)

    const getMetricsResponse = await request(app.server)
      .get('/metrics/sequence')
      .set('Cookie', cookies)
      .expect(200)

    expect(getMetricsResponse.body.metrics.total).toEqual(2)
  })
})
