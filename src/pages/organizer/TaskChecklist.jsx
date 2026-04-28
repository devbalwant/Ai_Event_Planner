import { useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import toast from "react-hot-toast";

const defaultTasks = [
  "Book the venue",
  "Finalize guest list",
  "Arrange catering",
  "Send invitations",
  "Arrange decorations",
  "Confirm AV equipment",
  "Arrange transportation",
  "Prepare event schedule",
];

const TaskChecklist = () => {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");

  const addTask = (name) => {
    const n = (name || taskName).trim();
    if (!n) {
      toast.error("Please enter a task name");
      return;
    }
    if (tasks.find((t) => t.name.toLowerCase() === n.toLowerCase())) {
      toast.error("Task already exists");
      return;
    }
    setTasks([...tasks, { id: Date.now(), name: n, completed: false }]);
    setTaskName("");
  };

  const toggleTask = (id) =>
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );

  const deleteTask = (id) => setTasks(tasks.filter((t) => t.id !== id));

  const loadDefaults = () => {
    const existing = tasks.map((t) => t.name.toLowerCase());
    const toAdd = defaultTasks
      .filter((n) => !existing.includes(n.toLowerCase()))
      .map((name) => ({
        id: Date.now() + Math.random(),
        name,
        completed: false,
      }));
    setTasks([...tasks, ...toAdd]);
    toast.success(`Added ${toAdd.length} default tasks`);
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const total = tasks.length;
  const progress = total === 0 ? 0 : Math.floor((completedCount / total) * 100);

  return (
    <div className="min-h-screen bg-[#E8DCC4] dark:bg-[#1a1a1a]">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="mb-7">
            <h1 className="text-2xl font-bold text-[#8B1538] dark:text-white">
              Task Checklist
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Track your event preparation tasks
            </p>
          </div>

          {/* Progress */}
          {total > 0 && (
            <div className="bg-white dark:bg-[#242424] border border-gray-200 dark:border-gray-700 rounded-2xl p-5 max-w-xl mb-6 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Overall Progress
                </span>
                <span className="text-sm font-bold text-[#8B1538] dark:text-white">
                  {completedCount}/{total} done
                </span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5">
                <div
                  className="bg-[#C4A574] dark:bg-[#C4A574] h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                {progress}% complete
              </p>
            </div>
          )}

          {/* Add Task */}
          <div className="bg-white dark:bg-[#242424] border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm max-w-xl mb-6">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
              Add New Task
            </h2>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="e.g. Book the venue"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTask()}
                className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C4A574]/20 focus:border-[#8B1538] dark:focus:border-[#C4A574] bg-white dark:bg-[#242424] dark:text-gray-100"
              />
              <button
                onClick={() => addTask()}
                className="bg-[#C4A574] hover:bg-[#B09560] text-[#0f0f0f] px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shrink-0"
              >
                Add
              </button>
            </div>
            {tasks.length === 0 && (
              <button
                onClick={loadDefaults}
                className="mt-3 text-xs text-[#8B1538] dark:text-[#C4A574] hover:underline font-medium"
              >
                + Load default event tasks
              </button>
            )}
          </div>

          {/* Task List */}
          {tasks.length === 0 ? (
            <div className="text-center py-16 text-gray-400 dark:text-gray-500 text-sm">
              No tasks yet. Add your first task above.
            </div>
          ) : (
            <div className="max-w-xl space-y-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`bg-white dark:bg-[#242424] border rounded-xl px-5 py-4 flex items-center justify-between gap-4 transition-all ${
                    task.completed
                      ? "border-green-200 dark:border-green-700 opacity-70"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                        task.completed
                          ? "bg-green-500 border-green-500 text-white"
                          : "border-gray-300 dark:border-gray-600 hover:border-[#8B1538] dark:hover:border-[#C4A574]"
                      }`}
                    >
                      {task.completed && (
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </button>
                    <span
                      className={`text-sm font-medium ${task.completed ? "line-through text-gray-400 dark:text-gray-500" : "text-gray-800 dark:text-gray-100"}`}
                    >
                      {task.name}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-xs text-red-400 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 font-medium shrink-0"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskChecklist;
