const todoController = require("../../controllers/todo.controller");
const TodoModel = require("../../model/todo.model");
const httpMocks = require("node-mocks-http");
const newTodo = require("../mock-data/new-todo.json");
const allTodos = require("../mock-data/all-todos.json");

TodoModel.create = jest.fn();
TodoModel.find = jest.fn();
TodoModel.findById = jest.fn();
TodoModel.findByIdAndUpdate = jest.fn();
TodoModel.deleteOne = jest.fn();

let req, res, next;

beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
});

describe("TodoController.getTodoById", () => {
    it("should have a getTodoById function", () => {
        expect(typeof todoController.getTodoById).toBe("function");
    });

    it("should call TodoModel.findById by params", async () => {
        req.params.todoId = "66a120f41242027ca8013268";
        await todoController.getTodoById(req, res, next);
        expect(TodoModel.findById).toBeCalledWith("66a120f41242027ca8013268");
    });

    it("should return json body and response code 200", async () => {
        TodoModel.findById.mockReturnValue(newTodo);
        await todoController.getTodoById(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getJSONData()).toStrictEqual(newTodo);
    });

    it("should return error handling", async () => {
        const errorMessage = { message: "Not found todo" };
        const rejectedPromise = Promise.reject(errorMessage);
        TodoModel.findById.mockReturnValue(rejectedPromise);
        await todoController.getTodoById(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    });

    it("should return 404 when item doesnt exist", async () => {
        TodoModel.findById.mockReturnValue(null);
        await todoController.getTodoById(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled).toBeTruthy();
    });
})

describe("TodoController.getTodos", () => {
    it("should have a getTodos function", () => {
        expect(typeof todoController.getTodos).toBe("function");
    });
    
    it("should call TodoModel.find({})", async () => {
        await todoController.getTodos(req, res, next);
        expect(TodoModel.find).toHaveBeenCalledWith({});
    });

    it("should return all documents from todos and status 200", async () => {
        TodoModel.find.mockReturnValue(allTodos);
        await todoController.getTodos(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getJSONData()).toStrictEqual(allTodos);
    });

    it("should return a error with status 500", async () => {
        const errorMessage = { message: "Error to find todos" };
        const rejectedPromise = Promise.reject(errorMessage);
        TodoModel.find.mockReturnValue(rejectedPromise);
        await todoController.getTodos(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    });
})

describe("TodoController.createTodo", () => {
    beforeEach(() => {
        req.body = newTodo;
        todoId = "66a120f41242027ca8013268";
    });

    it("should have a createTodo function", () => {
        expect(typeof todoController.createTodo).toBe("function");
    });

    it("should call TodoModel.create", () => {
        todoController.createTodo(req, res, next);
        expect(TodoModel.create).toBeCalledWith(newTodo);
    });

    it("should return 201 response code", async () => {
        await todoController.createTodo(req, res, next);
        expect(res.statusCode).toBe(201);
        expect(res._isEndCalled()).toBeTruthy();
    });

    it("should return json body response", async () => {
        TodoModel.create.mockReturnValue(newTodo);
        await todoController.createTodo(req, res, next);
        expect(res._getJSONData()).toStrictEqual(newTodo);
    });
    it("should handle errors", async () => {
        const errorMessage = { message: "Done property missing" };
        const rejectedPromise = Promise.reject(errorMessage);
        TodoModel.create.mockReturnValue(rejectedPromise);
        await todoController.createTodo(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    });
});

describe("TodoController.update", () => {
    it("should have a updateTodo function", () => {
        expect(typeof todoController.updateTodo).toBe("function");
    });

    it("should call TodoModel.updateTodo", async () => {
        req.params.todoId = todoId;
        req.body = newTodo;
        await todoController.updateTodo(req, res, next);
        TodoModel.findByIdAndUpdate(todoId, newTodo, {
            new: true,
            useFindAndModify: false
        })
        expect(TodoModel.findByIdAndUpdate).toBeCalledWith(todoId, newTodo, { new: true,useFindAndModify: false });
    });

    it("should call updateTodo with status code 200", async () => {
        req.params.todoId = todoId;
        req.body = newTodo;
        TodoModel.findByIdAndUpdate.mockReturnValue(newTodo);
        await todoController.updateTodo(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getJSONData()).toStrictEqual(newTodo);
    });

    it("should return error handling", async () => {
        const errorMessage = { message: "Error to update todo" };
        const rejectedPromise = Promise.reject(errorMessage);
        TodoModel.findByIdAndUpdate.mockReturnValue(rejectedPromise);
        await todoController.updateTodo(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    });

    it("should return 404 when item doesnt exist", async () => {
        TodoModel.findByIdAndUpdate.mockReturnValue(null);
        await todoController.updateTodo(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled).toBeTruthy();
    });
});

describe("TodoController.delete", () => {
    it("should have a deleteOne function", () => {
        expect(typeof todoController.deleteTodo).toBe("function");
    });

    it("should call TodoModel.deleteOne", async () => {
        req.params.todoId = "66a120f41242027ca8013268";
        await todoController.deleteTodo(req, res, next);
        expect(TodoModel.deleteOne).toBeCalledWith(req.params.todoId);
    });

    it("should call deleteOne with status code 200", async () => {
        TodoModel.deleteOne.mockReturnValue(newTodo);
        await todoController.deleteTodo(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getJSONData()).toStrictEqual(newTodo);
    });

    it("should return error handling", async () => {
        const errorMessage = { message: "Error to update todo" };
        const rejectedPromise = Promise.reject(errorMessage);
        TodoModel.deleteOne.mockReturnValue(rejectedPromise);
        await todoController.deleteTodo(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    });

    it("should return 404 when item doesnt exist", async () => {
        TodoModel.deleteOne.mockReturnValue(null);
        await todoController.deleteTodo(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled).toBeTruthy();
    });
})