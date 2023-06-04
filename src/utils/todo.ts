import { ITodoList } from "../types/todo";

export function mapTodo(todo: ITodoList) {
	return {
		listName: todo.listName,
		todos: todo.todos.map(todo => ({ ...todo, _id: todo._id.toString() })),
	};
}
