import React, { useState, useEffect } from 'react';
import axios from 'axios';
import baseURL from '../Utils/constant';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  'in-progress': 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
};

const MyApp = () => {
  const [data, setData] = useState([]);
  const [todo, setTodo] = useState('');
  const [model, setModel] = useState(false);
  const [editTodo, setEditTodo] = useState({ _id: null, todo: '' });

  const openModelTodo = (todoItem) => {
    setEditTodo(todoItem);
    setModel(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${baseURL}save`, { todo });
      const savedTodo = res.data?.data;
      setData((prevData) => [savedTodo, ...prevData ]);
      setTodo('');
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  const fetchData = async () => {
    try {
      const res = await axios.get(`${baseURL}get`);
      setData(res.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseURL}delete/${id}`);
      setData((prevData) => prevData.filter((item) => item._id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const updateTodo = async () => {
    try {
      await axios.put(`${baseURL}update/${editTodo._id}`, {
        todo: editTodo.todo,
      });
      setData((prevData) =>
        prevData.map((item) =>
          item._id === editTodo._id ? { ...item, todo: editTodo.todo } : item
        )
      );
      setModel(false);
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(`${baseURL}todos/${id}/status`, { status: newStatus });
      setData((prevData) =>
        prevData.map((item) =>
          item._id === id ? { ...item, status: newStatus } : item
        )
      );
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-xl p-6">
        <h1 className="text-3xl font-bold text-center text-red-600 mb-6">Todo App</h1>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 mb-6">
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
              className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center bg-gray-50 p-4 border rounded-lg shadow-sm gap-3"
            >
              <div>
                <span className="text-gray-800 font-medium text-lg">{ele.todo}</span>
              </div>

              <div className="flex  gap-2 items-center">
                <span
                  className={`text-xs px-3 py-1 rounded-full font-semibold capitalize ${statusColors[ele.status] || 'bg-gray-200 text-gray-800'}`}
                >
                  {ele.status}
                </span>
                <select
                  value={ele.status}
                  onChange={(e) => handleStatusChange(ele._id, e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>

                <button
                  onClick={() => handleDelete(ele._id)}
                  className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                >
                  Delete
                </button>
                <button
                  onClick={() => openModelTodo(ele)}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
                >
                  Update
                </button>
              </div>
            </div>
            
          ))}
        </div>
      </div>

      {model && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-md mx-auto">
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

export default MyApp;
