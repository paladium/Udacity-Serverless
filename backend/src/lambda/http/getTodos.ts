import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';
import { getAttachmentUrl, getUserTodos } from '../../businessLogic/todos';
import { createLogger } from '../../utils/logger';
import { getUserId } from '../utils';
const logger = createLogger("getTodos");

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event);
    let items = await getUserTodos(userId);
    //Go for each item and generate a signed url link
    for(let item of items){
        if(item.attachmentUrl)
            item.attachmentUrl = await getAttachmentUrl(item);
    }
    logger.info(`Got items for user: items=${JSON.stringify(items)}, userId=${userId}`);
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': "*",
        },
        body: JSON.stringify({ items })
    };
}
