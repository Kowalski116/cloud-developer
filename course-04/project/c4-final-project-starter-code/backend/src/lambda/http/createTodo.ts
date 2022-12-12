import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createTodo } from '../../helpers/todosAcess'
import { todoBuilder } from '../../helpers/todos'
import { createLogger } from '../../utils/logger'

const logger = createLogger('createTodo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Create todo event...')
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    if (!newTodo.name) {
      return {
        statusCode: 400,
        body: 'Name is required field!'
      }
    }

    const todo = todoBuilder(newTodo, event)
    const createdTodo = await createTodo(todo)
    return {
      statusCode: 201,
      body: JSON.stringify({
        item: createdTodo
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
