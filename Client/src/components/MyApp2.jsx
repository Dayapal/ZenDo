import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import baseURL from '../Utils/constant';

const MyApp2 = () => {

    const [data, setData] = useState([]);
    const [todo, setTodo] = useState('');
    const [model, setModel] = useState(false)
    const [editTodo, setEditTodo] = useState({ _id: null, todo: "" });

    const openModelTodo = (todoItem) => {
        setEditTodo(todoItem)
        setModel(true)
    }



    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let res = await fetch(`${baseURL}save`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify({ todo }),
            });

            const savedTodo = await res.json();
            if (res.ok) {
                console.log('Created Data successfully...', savedTodo);
                setTodo('');
                setData((prevData) => [...prevData, savedTodo]);
            } else {
                console.log('Failed to save todo');
            }
        } catch (error) {
            console.log('Error occurred during create todo');
        }
    };


    const fetchData = async () => {
        try {
            let res = await fetch('http://localhost:5000/api/get');
            let data = await res.json();
            setData(data);
        } catch (error) {
            console.log('Error occurred during fetchData');
        }
    };

    const handleDelete = async (id) => {
        try {
            console.log(id)
            let res = await fetch(`http://localhost:5000/api/delete/${id}`, {
                method: "DELETE",
            })
            if (res.ok) {
                setData((prevData) => prevData.filter((item) => item._id !== id))
                console.log("Todo Deleted Succussfully...")
            } else {
                console.log("Failed to Delete Todo")
            }

        } catch (error) {
            console.log('error occuring during the Delete Todo')

        }
    }

    const updateTodo = async (id) => {
        try {
            let res = await fetch(`http://localhost:5000/api/update/${editTodo._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ todo: editTodo.todo }),

            });
            if (res.ok) {
                setData((prevData) =>
                    prevData.map((item) =>
                        item._id === editTodo._id ? { ...item, todo: editTodo.todo } : item
                    )
                )
                setModel(false)
            }

        } catch (error) {
            console.log("error updating todo")

        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
            <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6">
                <h1 className="text-3xl font-bold text-center text-red-600 mb-6">Todo App</h1>

                <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
                    <input
                        type="text"
                        value={todo}
                        onChange={(e) => setTodo(e.target.value)}
                        placeholder="Enter your todo"
                        required
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <button
                        type="submit"
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                    >
                        Add
                    </button>
                </form>

                <div className="space-y-4">
                    {data.map((ele) => (
                        <div
                            key={ele._id}
                            className="flex justify-between items-center bg-gray-50 p-3 border rounded-lg shadow-sm"
                        >
                            <span className="text-gray-800">{ele.todo}</span>
                            <div className='flex gap-2'>
                                <button onClick={() => handleDelete(ele._id)} className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">
                                    Delete
                                </button>
                                <button onClick={() => openModelTodo(ele)} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm">
                                    Update
                                </button>
                            </div>

                        </div>
                    ))}
                </div>
            </div>

            {model && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg w-150">
                        <h2 className="text-xl font-semibold mb-4">Update Todo</h2>
                        <input
                            type="text"
                            value={editTodo.todo}
                            onChange={(e) => setEditTodo({ ...editTodo, todo: e.target.value })}
                            className="w-full border px-3 py-2 rounded mb-4"
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setModel(false)}
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={updateTodo}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyApp2
