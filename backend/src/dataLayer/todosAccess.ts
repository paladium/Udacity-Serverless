import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';
import {TodoItem} from '../models/TodoItem';
import { CreateTodoRequest } from '../requests/CreateTodoRequest';
import {v4} from 'uuid/v4';
export class TodosAccess
{
    constructor(
        private readonly XAWS = AWSXRay.captureAWS(AWS),
        private readonly doClient: AWS.DynamoDB.DocumentClient = new XAWS.DynamoDB.DocumentClient(), 
        private readonly todosTable = process.env.TODOS_TABLE,
        private readonly index = process.env.INDEX_NAME,
    ){

    }

    async getUserTodos(userId: string): Promise<TodoItem[]>{
        const result = await this.doClient.query({
            TableName: this.todosTable,
            IndexName: this.index,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId,
            },
        }).promise();
        const items = result.Items as TodoItem[];
        return items;
    }

    async createTodo(createTodo: CreateTodoRequest, userId: string): Promise<TodoItem>{
        const item = <TodoItem>{
            todoId: v4(),
            userId: userId,
            createdAt: new Date().toISOString(),
            done: false,
            dueDate: createTodo.dueDate,
            name: createTodo.name,
        };
        await this.doClient.put({
            Item: createTodo,
            TableName: this.todosTable,
        }).promise();
        return item;
    }
}