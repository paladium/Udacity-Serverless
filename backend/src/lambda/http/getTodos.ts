import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';
import { getUserTodos } from '../../businessLogic/todos';
import { createLogger } from '../../utils/logger';
import { getUserId } from '../utils';
const logger = createLogger("getTodos");

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event);
    const items = await getUserTodos(userId);
    logger.info("Got items for user")
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': "*",
        },
        body: JSON.stringify({items})
    };
}
