const {Router} = require("express");
const { getTodos , saveTodos, updateTodos, deleteTodos, updateTodoStatus } = require("../controllers/TodoControllers.js");

const router = Router()

router.get("/get", getTodos);
router.post("/save", saveTodos);
router.put("/update/:id", updateTodos)
router.delete("/delete/:id", deleteTodos)
router.put("/todos/:id/status", updateTodoStatus )

module.exports = router;