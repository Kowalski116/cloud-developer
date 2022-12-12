import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'
import { getTodoById } from '../../dataLayer/todosAcess'

const logger = createLogger('getTodo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Get todo event...')
    const todoId = event.pathParameters.todoId
    const todo = await getTodoById(todoId, getUserId(event))

    return {
      statusCode: 200,
      body: JSON.stringify({ item: todo })
    }
  }
)
handler.use(
  cors({
    credentials: true
  })
)
