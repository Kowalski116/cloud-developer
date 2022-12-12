import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { getUploadUrl } from '../../helpers/attachmentUtils'
import { saveImgUrl } from '../../dataLayer/todosAcess'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const bucketName = process.env.ATTACHMENT_S3_BUCKET
const logger = createLogger('generateUploadUrl')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Upload image todo event...')
    const todoId = event.pathParameters.todoId
    const userId = getUserId(event)
    const url = getUploadUrl(todoId)
    const attachmentUrl = `https://${bucketName}.s3.amazonaws.com/${todoId}`
    await saveImgUrl(userId, todoId, attachmentUrl)

    return {
      statusCode: 201,
      body: JSON.stringify({ uploadUrl: url })
    }
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
