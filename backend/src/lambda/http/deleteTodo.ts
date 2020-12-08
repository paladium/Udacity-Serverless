import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { deleteTodo } from '../../businessLogic/todos';
import { createLogger } from '../../utils/logger';
import { getUserId } from '../utils';

const logger = createLogger("deleteTodo");

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId;
    const userId = getUserId(event);

    await deleteTodo(todoId);
    logger.info(`Deleted todo item for userId=${userId}, todoId=${todoId}`);

    return {
        statusCode: 200,
        body: "",
        headers: {
            'Access-Control-Allow-Origin': "*",
        },
    }
}
