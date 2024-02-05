import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'crypto'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'
import { knex } from '../database'

export async function mealsRoutes(app: FastifyInstance) {
  app.get(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const { sessionId } = request.cookies

      const meals = await knex('meals').where('session_id', sessionId).select()

      return { meals }
    },
  )

  app.get(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const { sessionId } = request.cookies

      const getMealsParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getMealsParamsSchema.parse(request.params)

      const meal = await knex('meals')
        .where({ id, session_id: sessionId })
        .first()

      return { meal }
    },
  )

  app.post(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const sessionId = request.cookies.sessionId

      const createMealBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        datetimeMeal: z.string(),
        isDiet: z.boolean(),
      })

      const { name, description, datetimeMeal, isDiet } =
        createMealBodySchema.parse(request.body)

      await knex('meals').insert({
        id: randomUUID(),
        name,
        description,
        datetime_meal: datetimeMeal,
        is_diet: isDiet,
        session_id: sessionId,
      })

      return reply.status(201).send()
    },
  )

  app.put(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const sessionId = request.cookies.sessionId

      const getMealsParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getMealsParamsSchema.parse(request.params)

      const editMealBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        datetimeMeal: z.string(),
        isDiet: z.boolean(),
      })

      const { name, description, datetimeMeal, isDiet } =
        editMealBodySchema.parse(request.body)

      await knex('meals').where({ id, session_id: sessionId }).update({
        name,
        description,
        datetime_meal: datetimeMeal,
        is_diet: isDiet,
      })

      return reply.status(204).send()
    },
  )

  app.delete(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const { sessionId } = request.cookies

      const getMealsParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getMealsParamsSchema.parse(request.params)

      await knex('meals').where({ id, session_id: sessionId }).delete()

      return reply.status(204).send()
    },
  )
}
