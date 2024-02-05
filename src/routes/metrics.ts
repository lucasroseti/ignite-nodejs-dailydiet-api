import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'
import { knex } from '../database'

export async function metricsRoutes(app: FastifyInstance) {
  app.get(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const { sessionId } = request.cookies

      const metrics = await knex('meals')
        .where('session_id', sessionId)
        .count('id', { as: 'total' })
        .first()

      return { metrics }
    },
  )

  app.get(
    '/diet/:diet',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const { sessionId } = request.cookies

      const getMealsParamsSchema = z.object({
        diet: z
          .string()
          .toLowerCase()
          .transform((val) => val === 'true')
          .pipe(z.boolean()),
      })

      const { diet } = getMealsParamsSchema.parse(request.params)

      const metrics = await knex('meals')
        .where('session_id', sessionId)
        .where('is_diet', diet)
        .count('id', { as: 'total' })
        .first()

      return { metrics }
    },
  )

  app.get(
    '/sequence',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const { sessionId } = request.cookies
      let isDiet = true
      let sequence = 0

      const metrics = await knex('meals')
        .where('session_id', sessionId)
        .select()
        .orderBy('created_at', 'desc')

      metrics.forEach((metric) => {
        if (metric.is_diet && isDiet) {
          ++sequence
        } else {
          isDiet = false
        }
      })

      return { metrics: { total: sequence } }
    },
  )
}
