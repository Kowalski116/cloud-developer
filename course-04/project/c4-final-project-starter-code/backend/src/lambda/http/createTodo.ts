import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createTodo } from '../../dataLayer/todosAcess'
import { todoBuilder } from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger'

const logger = createLogger('createTodo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Create todo event...')
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
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
