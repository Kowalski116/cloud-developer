import * as AWS from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk')
import { TodoItem } from '../models/TodoItem'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)

const docClient: DocumentClient = createDynamoDBClient()
const todosTable = process.env.TODOS_TABLE
// TODO: Implement the dataLayer logic
export async function createTodo(todo: TodoItem): Promise<TodoItem> {
  await docClient
    .put({
      TableName: todosTable,
      Item: todo
    })
    .promise()

  return todo
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}

export async function getAllTodosByUserId(userId: string): Promise<TodoItem[]> {
  const result = await docClient
    .query({
      TableName: todosTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    })
    .promise()

  return result.Items as TodoItem[]
}

export async function getTodoById(
  todoId: string,
  userId: string
): Promise<TodoItem> {
  const result = await docClient
    .query({
      TableName: todosTable,
      KeyConditionExpression: 'userId = :userId and todoId = :todoId',
      ExpressionAttributeValues: {
        ':userId': userId,
        ':todoId': todoId
      }
    })
    .promise()
  const items = result.Items
  if (items.length > 0) return items[0] as TodoItem
  return null
}

export async function updateToDo(todo: TodoItem): Promise<TodoItem> {
  const result = await docClient
    .update({
      TableName: todosTable,
      Key: { userId: todo.userId, todoId: todo.todoId },
      ConditionExpression: 'attribute_exists(todoId)',
      UpdateExpression: 'set #n = :n, dueDate = :due, done = :dn, note = :note',
      ExpressionAttributeNames: { '#n': 'name' },
      ExpressionAttributeValues: {
        ':n': todo.name,
        ':due': todo.dueDate,
        ':dn': todo.done,
        ':note': todo.note
      }
    })
    .promise()

  return result.Attributes as TodoItem
}

export async function deleteTodo(userId: string, todoId: string) {
  await docClient
    .delete({
      TableName: todosTable,
      Key: { userId, todoId }
    })
    .promise()

  return null
}

export async function saveImgUrl(
  userId: string,
  todoId: string,
  attachmentUrl: string
) {
  await docClient
    .update({
      TableName: todosTable,
      Key: { userId, todoId },
      ConditionExpression: 'attribute_exists(todoId)',
      UpdateExpression: 'set attachmentUrl = :attachmentUrl',
      ExpressionAttributeValues: {
        ':attachmentUrl': attachmentUrl
      }
    })
    .promise()

  return null
}
