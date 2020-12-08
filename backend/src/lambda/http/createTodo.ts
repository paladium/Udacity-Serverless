import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';
import { createTodo } from '../../businessLogic/todos';
import { CreateTodoRequest } from '../../requests/CreateTodoRequest';
import { createLogger } from '../../utils/logger';
import { getUserId } from '../utils';

const logger = createLogger("createTodo");

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body);
    const userId = getUserId(event);

    const item = await createTodo(newTodo, userId);
    logger.info(`Created todo item for userId=${userId}, item=${JSON.stringify(item)}`);

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': "*",
        },
        body: JSON.stringify({ item })
    }
}
