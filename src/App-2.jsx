import Navbar from './components/Navbar'
import { useState, useEffect, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid';
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

function App() {
  const [todo, setTodo] = useState("")
  const [todos, setTodos] = useState([])
  const [showFinished, setShowFinished] = useState(false)
  const isFirstLoad = useRef(true)

  // Load todos from localStorage once on mount
  useEffect(() => {
    const stored = localStorage.getItem("todos");
    if (stored) {
      setTodos(JSON.parse(stored));
    }
  }, []);

  // Persist todos to localStorage whenever they change (skip first load)
  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const toggleFinished = () => {
    setShowFinished(prev => !prev);
  }

  const handleAdd = () => {
    if (todo.trim().length <= 3) return;
    setTodos(prev => [
      ...prev,
      { id: uuidv4(), todo: todo.trim(), isCompleted: false }
    ]);
    setTodo("");
  }

  const handleEdit = (e, id) => {
    const toEdit = todos.find(item => item.id === id);
    if (!toEdit) return;
    setTodo(toEdit.todo);
    setTodos(prev => prev.filter(item => item.id !== id));
  }

  const handleDelete = (e, id) => {
    if (window.confirm("Do you really want to delete this todo?")) {
      setTodos(prev => prev.filter(item => item.id !== id));
    }
  }

  const handleChange = e => {
    setTodo(e.target.value);
  }

  const handleCheckbox = e => {
    const id = e.target.name;
    setTodos(prev =>
      prev.map(item =>
        item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
      )
    );
  }

  return (
    <>
      <Navbar />
      <div className='mx-3 md:container md:mx-auto my-5 rounded-xl p-5 bg-violet-100 min-h-[85vh] md:w-[35%]'>
        <h1 className='font-bold text-center text-xl mb-4'>iTask - Manage your Todos at one place</h1>

        <div className="addTodo flex flex-col gap-4">
          <h2 className='text-lg font-bold'>Add a Todo</h2>
          <input
            type="text"
            placeholder='Enter your todo'
            className='w-full border-1 rounded-md py-1'
            value={todo}
            onChange={handleChange}
          />
          <button
            onClick={handleAdd}
            disabled={todo.trim().length <= 3}
            className='bg-violet-800 hover:bg-violet-950 disabled:bg-violet-800 p-1 text-sm font-bold text-white rounded-md'
          >
            Save
          </button>
        </div>

        <label className='flex items-center my-5'>
          <input
            type="checkbox"
            checked={showFinished}
            onChange={toggleFinished}
            className='mr-2'
          />
          Show Finished
        </label>

        <hr className='border-opacity-25 w-[90%] mx-auto my-2' />

        <h2 className='text-lg font-bold'>Your Todos</h2>
        <div className="todos">
          {todos.length === 0 && <div className='m-5'>No Todos to display</div>}
          {todos.map(item => (
            (showFinished || !item.isCompleted) && (
              <div key={item.id} className="todo flex my-3 justify-between">
                <div className='flex gap-5 items-center'>
                  <input
                    type="checkbox"
                    name={item.id}
                    checked={item.isCompleted}
                    onChange={handleCheckbox}
                  />
                  <span className={item.isCompleted ? "line-through" : ""}>
                    {item.todo}
                  </span>
                </div>

                <div className="buttons flex gap-1">
                  <button
                    onClick={e => handleEdit(e, item.id)}
                    className='bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md'
                  >
                    <FaRegEdit />
                  </button>
                  <button
                    onClick={e => handleDelete(e, item.id)}
                    className='bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md'
                  >
                    <MdDelete />
                  </button>
                </div>
              </div>
            )
          ))}
        </div>
      </div>
    </>
  )
}

export default App;
