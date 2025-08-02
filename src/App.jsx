import Navbar from './components/Navbar'
import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid';
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";



function App() {
  const [todo, setTodo] = useState("")
  const [todos, setTodos] = useState([])
  const [showFinished, setshowFinished] = useState(false)

  // Load todos from localStorage once on mount
  useEffect(() => {
    const stored = localStorage.getItem("todos");
    if (stored) {
      setTodos(JSON.parse(stored));
    }
  }, []);


  const toggleFinished = (e) => {
    setshowFinished(!showFinished)
  }


  const savetoLS = (params) => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }


  const handleEdit = (e, id) => {
    let t = todos.filter(i => i.id === id)
    setTodo(t[0].todo)
    let newTodos = todos.filter(item => {
      return item.id !== id
    })
    setTodos(newTodos)
    savetoLS()
  }

  const handleDelete = (e, id) => {
    const confirmed = window.confirm("Do you really want to delete this todo?");
    if (confirmed) {
      let newTodos = todos.filter(item => {
        return item.id !== id
      })
      setTodos(newTodos)
      savetoLS()
    }
  }

  const handleAdd = () => {
    setTodos([...todos, { id: uuidv4(), todo, isCompleted: false }])
    setTodo("")
    savetoLS()
  }

  const handleChange = (e) => {
    setTodo(e.target.value)
  }

  const handleCheckbox = (e) => {
    let id = e.target.name
    let index = todos.findIndex(item => {
      return item.id === id
    })
    let newTodos = [...todos]
    newTodos[index].isCompleted = !newTodos[index].isCompleted
    setTodos(newTodos)
    savetoLS()
  }


  return (
    <>
      <Navbar />
      <div className='mx-3 md:container md:mx-auto my-5 rounded-xl p-5 bg-violet-100 min-h-[85vh] ] md:w-[35%]'>
        <h1 className='font-bold text-center text-xl mb-4'>iTask - Manage your Todos at one place</h1>
        <div className="addTodo flex flex-col gap-4">
          <h2 className='text-lg font-bold'>Add a Todo</h2>

          <input onChange={handleChange} value={todo} type="text" placeholder=' enter your todo' className='w-full border-1 rounded-md py-1' />

          <button onClick={handleAdd} disabled={todo.length <= 3} className='bg-violet-800 hover:bg-violet-950  disabled:bg-violet-800 p-1 text-sm font-bold text-white rounded-md cursor-pointer'>Save</button>
        </div>
        <input className='my-5' onChange={toggleFinished} type="checkbox" checked={showFinished} /> Show Finished
        <div className='h-[1px] bg-black opacity-15 w-[90%] mx-auto my-2'></div>

        <h2 className='text-lg font-bold'>Your Todos</h2>
        <div className="todos ">
          {todos.length === 0 && <div className='m-5'>No Todos to display</div>}
          {todos.map(item => {

            return (showFinished || !item.isCompleted) && <div key={item.id} className="todo flex my-3 justify-between ">
              <div className='flex gap-5'>
                <input name={item.id} type="checkbox" onChange={handleCheckbox} checked={item.isCompleted} id='' />
                <div className={item.isCompleted ? "line-through" : ""}>{item.todo}</div>
              </div>

              <div className="buttons flex h-full">
                <button onClick={(e) => handleEdit(e, item.id)} className='bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1'><FaRegEdit /></button>

                <button onClick={(e) => handleDelete(e, item.id)} className='bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1'><MdDelete /></button>
              </div>
            </div>

          })}
        </div>
      </div>
    </>
  )
}

export default App
