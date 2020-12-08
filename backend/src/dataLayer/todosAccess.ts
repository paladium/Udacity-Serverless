import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';
import { TodoItem } from '../models/TodoItem';
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';
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

    async createTodo(item: TodoItem): Promise<TodoItem>{
        await this.doClient.put({
            Item: item,
            TableName: this.todosTable,
        }).promise();
        return item;
    }

    async getTodoById(id: string): Promise<AWS.DynamoDB.DocumentClient.QueryOutput>{
        const result =  await this.doClient.query({
            TableName: this.todosTable,
            KeyConditionExpression: 'todoId = :todoId',
            ExpressionAttributeValues: {
                ':todoId': id,
            },
        }).promise();
        return result;
    }

    async updateTodo(item: TodoItem){
        await this.doClient.update({
            TableName: this.todosTable,
            Key: {
                "todoId": item.todoId,
            },
            UpdateExpression: "set #nameField = :todoName, done = :done, dueDate = :dueDate, attachmentUrl = :attachmentUrl",
            ExpressionAttributeNames: {
                "#nameField": "name"
            },
            ExpressionAttributeValues: {
                ":todoName": item.name,
                ":done": item.done,
                ":dueDate": item.dueDate,
                ":attachmentUrl": item.attachmentUrl || null
            }
        }).promise();
    }

    async deleteTodoById(id: string){
        await this.doClient.delete({
            TableName: this.todosTable,
            Key: {
                "todoId": id,
            }
        }).promise();
    }
}