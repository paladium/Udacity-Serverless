import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getSignedUrl } from '../../businessLogic/todos'
import { getUserId } from '../utils';
import { createLogger } from '../../utils/logger';
const logger = createLogger("generateUploadUrl");

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId;

    const userId = getUserId(event);

    const uploadUrl = await getSignedUrl(todoId);

    logger.info(`Generated upload url for userId=${userId}, todoId=${todoId}`);

    return {
        statusCode: 200,
        body: JSON.stringify({ uploadUrl }),
        headers: {
            'Access-Control-Allow-Origin': "*",
        },
    }
}
