import { Types } from "mongoose";

export interface ITodoList {
	_id: Types.ObjectId;
	listName: string;
	todos: {
		_id: Types.ObjectId;
		text: string;
	}[];
}
