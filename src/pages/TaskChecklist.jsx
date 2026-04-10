import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const TaskChecklist = () => {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");

  const addTask = () => {
    if (!taskName) {
      alert("Enter task");
      return;
    }

    const newTask = {
      id: Date.now(),
      name: taskName,
      completed: false,
    };

    setTasks([...tasks, newTask]);
    setTaskName("");
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };
  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;

  const progress =
    totalTasks === 0 ? 0 : Math.floor((completedTasks / totalTasks) * 100);

  return (
    <div>
      <Navbar />
      <div className="flex">
        <Sidebar />

        <div className="p-10 w-full">
          <h1 className="text-3xl font-bold mb-6">Task Checklist</h1>
          <div className="mb-4">
            <p className="font-semibold">Progress: {progress}%</p>

            <div className="w-full bg-gray-300 rounded h-4 mt-1">
              <div
                className="bg-green-500 h-4 rounded"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white p-6 rounded shadow max-w-xl space-y-4">
            <input
              type="text"
              placeholder="Enter task"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="border p-2 w-full rounded"
            />

            <button
              onClick={addTask}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Add Task
            </button>
          </div>

          <div className="mt-6 space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-gray-100 p-4 rounded shadow flex justify-between items-center"
              >
                <div>
                  <p
                    className={`font-semibold ${
                      task.completed ? "line-through text-gray-500" : ""
                    }`}
                  >
                    {task.name}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    {task.completed ? "Undo" : "Done"}
                  </button>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskChecklist;
