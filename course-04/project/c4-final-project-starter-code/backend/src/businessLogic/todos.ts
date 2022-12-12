import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import * as uuid from 'uuid'
import { APIGatewayProxyEvent } from 'aws-lambda'
import { getUserId } from '../lambda/utils'

// TODO: Implement businessLogic

export const todoBuilder = (
  todoRequest: CreateTodoRequest,
  event: APIGatewayProxyEvent
) => {
  const todoId = uuid.v4()
  const todo = {
    todoId,
    createdAt: new Date().toISOString(),
    userId: getUserId(event),
    done: false,
    attachmentUrl: '',
    ...todoRequest
  }
  return todo
}
