import { S3Access } from "../dataLayer/s3";
import { TodosAccess } from "../dataLayer/todosAccess";
import { TodoItem } from "../models/TodoItem";
import { CreateTodoRequest } from "../requests/CreateTodoRequest";
import { UpdateTodoRequest } from "../requests/UpdateTodoRequest";
const uuid = require('uuid/v4')

const todoAccess = new TodosAccess();
const s3Access = new S3Access();

export async function getUserTodos(userId: string): Promise<TodoItem[]>{
    return todoAccess.getUserTodos(userId);
}

export async function createTodo(createTodo: CreateTodoRequest, userId: string): Promise<TodoItem>{
    const item = <TodoItem>{
        todoId: uuid(),
        userId: userId,
        createdAt: new Date().toISOString(),
        done: false,
        dueDate: createTodo.dueDate,
        name: createTodo.name,
    };
    return await todoAccess.createTodo(item);
}

export async function updateTodo(updateTodo: UpdateTodoRequest, id: string){
    const item = <TodoItem>{
        todoId: id,
        name: updateTodo.name,
        dueDate: updateTodo.dueDate,
        done: updateTodo.done
    };
    await todoAccess.updateTodo(item);
}

export async function deleteTodo(id: string){
    await todoAccess.deleteTodoById(id);
}

export async function getSignedUrl(id: string){
    return s3Access.getPresignedUrl(id);
}