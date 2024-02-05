import { execSync } from 'node:child_process'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'

describe('Meals routes', () => {
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

  it('should be able to create a new meal', async () => {
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
      .expect(201)
  })

  it('should be able to list all meals', async () => {
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

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    expect(listMealsResponse.body.meals).toEqual([
      expect.objectContaining({
        name: 'Sanduíche',
        description:
          'Sanduíche de pão integral com atum e salada de alface e tomate',
        datetime_meal: '2024-02-04 20:31',
        is_diet: 1,
      }),
    ])
  })

  it('should be able to get a specific meal', async () => {
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

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    const mealId = listMealsResponse.body.meals[0].id

    const getMealResponse = await request(app.server)
      .get(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .expect(200)

    expect(getMealResponse.body.meal).toEqual(
      expect.objectContaining({
        name: 'Sanduíche',
        description:
          'Sanduíche de pão integral com atum e salada de alface e tomate',
        datetime_meal: '2024-02-04 20:31',
        is_diet: 1,
      }),
    )
  })

  it('should be able to edit a specific meal', async () => {
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

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    const mealId = listMealsResponse.body.meals[0].id

    await request(app.server)
      .put(`/meals/${mealId}`)
      .send({
        name: 'Sanduíche de Frango',
        description:
          'Sanduíche frango, pão integral com atum e salada de alface e tomate',
        datetimeMeal: '2024-02-05 08:35',
        isDiet: false,
      })
      .set('Cookie', cookies)
      .expect(204)
  })

  it('should be able to delete a specific meal', async () => {
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

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    const mealId = listMealsResponse.body.meals[0].id

    await request(app.server)
      .delete(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .expect(204)
  })
})
