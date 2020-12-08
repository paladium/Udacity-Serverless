import 'source-map-support/register'
import * as AWS from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import {createLogger} from '../../utils/logger';
import { getUserId } from '../utils';
const logger = createLogger("getTodos");
import {TodosAccess} from '../../dataLayer/todosAccess';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event);
    const items = await new TodosAccess().getUserTodos(userId);
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': "*",
        },
        body: JSON.stringify({items})
    };
}
