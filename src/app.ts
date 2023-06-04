import express, { Express, Request } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { getDate } from "./utils/date";
import path from "path";
import { ITodoList } from "./types/todo";
import mongoose, { Model, Schema, Types } from "mongoose";
import { log } from "console";
import { mapTodo } from "./utils/todo";

dotenv.config();

const app: Express = express();

// apply middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "..", "src", "views"));
app.set("view engine", "ejs");
app.use(express.static("src/public"));

// connect to database
mongoose.connect(process.env.MONGO_REMOTE_URL, { dbName: "todos" });
const TodoList = mongoose.model<ITodoList>(
	"TodoList",
	new Schema<ITodoList>({
		listName: { required: true, type: String },
		todos: {
			type: [{ text: { type: String, required: true } }],
			required: true,
		},
	})
);

app.get("/about", (_, res) => {
	res.render("about");
});

app.route("/")
	.get(async (_, res) => {
		try {
			const todoList = await TodoList.findOne({ listName: "default" })
				.lean()
				.exec();
			if (!todoList)
				throw new Error("Didn't find any list with name index");

			res.render("list", {
				kindOfDay: getDate(),
				todoList: mapTodo(todoList),
			});
		} catch (e) {
			res.render("404");
		}
	})
	.post(async (req, res) => {
		const { todoId = "", nextToDoListItem = "" } = req.body;

		try {
			if (nextToDoListItem)
				await TodoList.updateOne(
					{ listName: "default" },
					{ $push: { todos: { text: nextToDoListItem } } }
				).exec();
			else {
				await TodoList.updateOne(
					{ listName: "default" },
					{ $pull: { todos: { _id: todoId } } }
				).exec();
			}
			res.redirect("/");
		} catch (e) {
			console.log(e);
			res.render("404");
		}
	});

app.route("/:listId")
	.get(async (req, res) => {
		const { listId } = req.params;
		try {
			const foundList = await TodoList.findOne({
				listName: listId.toLowerCase(),
			})
				.lean()
				.exec();

			// if a list exists by the name provided, then render that, otherwise,
			// create a new list
			if (foundList) {
				res.render("list", {
					kindOfDay: listId.toLowerCase(),
					todoList: mapTodo(foundList),
				});
				return;
			}

			const newList = { listName: listId, todos: [] };
			await new TodoList(newList).save();

			res.render("list", {
				kindOfDay: listId.toLowerCase(),
				todoList: newList,
			});
		} catch (e) {
			res.render("404");
		}
	})
	.post(async (req, res) => {
		const { listId } = req.params;
		const { todoId = "", nextToDoListItem = "" } = req.body;
		try {
			if (nextToDoListItem)
				await TodoList.updateOne(
					{ listName: listId.toLowerCase() },
					{ $push: { todos: { text: nextToDoListItem } } }
				).exec();
			else {
				// check if the TodoList exists in database
				const foundList = await TodoList.findOne({
					listName: listId.toLowerCase(),
				})
					.lean()
					.exec();

				if (!foundList) {
					throw new Error("List not found");
				}

				await TodoList.updateOne(
					{ listName: listId },
					{ $pull: { todos: { _id: todoId } } }
				);
			}
			res.redirect(`/${listId.toLowerCase()}`);
		} catch (e) {
			console.log(e);
			res.render("404");
		}
	});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () =>
	console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`)
);
