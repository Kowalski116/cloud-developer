import 'source-map-support/register'
import { TodoItem } from './../../models/TodoItem'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { updateToDo } from '../../dataLayer/todosAcess'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('updateTodo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Update todo event...')
    const todoId = event.pathParameters.todoId
    const userId = getUserId(event)
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
    const newTodo = { userId, todoId, ...updatedTodo } as TodoItem
    await updateToDo(newTodo)

    return {
      statusCode: 200,
      body: null
    }
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
