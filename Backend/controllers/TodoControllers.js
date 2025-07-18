const TodoModel = require('../models/TodoModels');


module.exports.getTodos = async (req, res) => {

    try {
        const todos = await TodoModel.find().sort({ createdAt: -1 });
        res.status(200).send(todos)
    } catch (error) {
        res.send(500).send({ error: "failed to fetch todos" })

    }
};


module.exports.saveTodos = async (req, res) => {
    try {
        const { todo, status } = req.body;

        if (!todo || todo.trim === "") {
            return res.status(400).json({ message: "Todo is required" })
        }
        const newTodo = new TodoModel({ todo, status });
        await newTodo.save();

        res.status(200).json({ message: "Todo created Succussfully", data: newTodo });
    } catch (error) {
        res.status(500).json({ message: "Error occuring during create Todo", error })

    }

};


module.exports.updateTodos = (req, res) => {
    const { id } = req.params;
    const { todo } = req.body;

    TodoModel.findByIdAndUpdate(id, { todo })
        .then(() => {
            res.status(200).send(todo)
        })
        .catch((error) => {
            res.status(501).send({ error: error, msg: "failed to update" })
        })
};

module.exports.deleteTodos = (req, res) => {

    const { id } = req.params;
    TodoModel.findByIdAndDelete(id)
        .then(() => {
            res.status(200).send("Deleted Successfully...")
        })
        .catch((error) => {
            res.status(501).send({ error: error, msg: "failed to update" })
        })
};


module.exports.updateTodoStatus  = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['pending', 'in-proecess', 'completed'].includes(status)) {
            return res.status(200).json({ message: 'Invalid status value' });
        }

        const updateTodo = await TodoModel.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if(!updateTodo){
            return res.status(404).json({message: "Todo not found"});
        }
        res.status(200).json({message: " Status updated", data: updateTodo});

    } catch (error) {
        res.status(500).json({message: "Error updateing status", error})


    }


}