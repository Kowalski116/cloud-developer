import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'
import { getAllTodosByUserId } from '../../dataLayer/todosAcess'

const logger = createLogger('getTodos')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Get todo event...')
    const todos = await getAllTodosByUserId(getUserId(event))

    return {
      statusCode: 200,
      body: JSON.stringify({ items: todos })
    }
  }
)
handler.use(
  cors({
    credentials: true
  })
)
