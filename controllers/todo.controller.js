const TodoModel = require("../model/todo.model");

exports.createTodo = async (req, res, next) => {
    try {
        const createModel = await TodoModel.create(req.body);
        res.status(201).json(createModel);
        next;
    } catch (err) {
        next(err);
    }
};

exports.getTodos = async (req, res, next) => {
    try {
        const todos = await TodoModel.find({});
        res.status(200).json(todos);
    } catch (err) {
        next(err);
    };
};