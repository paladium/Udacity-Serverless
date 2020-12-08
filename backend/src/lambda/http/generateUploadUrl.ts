import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getSignedUrl } from '../../businessLogic/todos'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId

    const uploadUrl = await getSignedUrl(todoId);

    return {
        statusCode: 200,
        body: JSON.stringify({ uploadUrl }),
        headers: {
            'Access-Control-Allow-Origin': "*",
        },
    }
}
