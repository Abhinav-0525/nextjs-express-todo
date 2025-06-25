'use client'

import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Home() {
  let [title, setTitle] = useState('')
  let [task, setTask] = useState('')
  let [todos, setTodos] = useState([])
  let [update, setUpdate] = useState(true)

  async function handleSubmit() {
    //let res = await fetch()
    let todo = {title: title, task: task}
    let res = await fetch('http://localhost:4000/add', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo)
    })
    let data = await res.json()
    setUpdate(!update)
    console.log(data.message)
  }

  async function handleDelete(id){
    let res = await fetch(`http://localhost:4000/delete/${id}`,{
      method:'DELETE'
    })
    let data = await res.json();
    setUpdate(!update)
    console.log(data.message)
  }

  useEffect(()=>{
    async function fetchTodos(){
      let res = await fetch('http://localhost:4000/get',{
        method: 'GET'
      })
      let data = await res.json()
      setTodos(data.payload)
      console.log(data.payload);
      console.log(todos);
    }
    fetchTodos()
  },[update])

  return (
    <div className="grid  items-center justify-items-center  p-8 pb-20 gap-10 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Typography variant="h3" gutterBottom>
        To-do list
      </Typography>
      <div className='w-100 p-4 bg-white border rounded'>
        <form className=' flex flex-col'>
          <div>
            <TextField
              required
              id="title"
              label="Title"
              sx={{width:'100%', marginBottom:'15px'}}
              onChange={(e)=>setTitle(e.target.value)}
              placeholder="Assignment"
            />
          </div>
          <div>
            <TextField
              required
              id="task"
              label="Task"
              multiline
              rows={4}
              sx={{width:'100%', marginBottom:'15px'}}
              onChange={(e)=>setTask(e.target.value)}
              placeholder="Complete the frontend application."
            />
          </div>
          <div className='w'>
            <Button variant="contained" onClick={handleSubmit} sx={{backgroundColor:'green'}}>Add</Button>
          </div>
        </form>
      </div>
      <div className='w-100 m-5 p-4 bg-white border rounded font-black'>
        {todos.length>0 && <Table sx={{ minWidth: 250 }} aria-label="simple table">
          <TableHead>
          <TableRow>
            <TableCell align="left">Title</TableCell>
            <TableCell align="right">Task</TableCell>
            <TableCell align="right">Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
            {todos.map((todo)=>(
              <TableRow
              key={todo._id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell align="left">{todo.title}</TableCell>
              <TableCell align="right">{todo.task}</TableCell>
              <TableCell align="right" ><Button onClick={()=>handleDelete(todo._id)}><DeleteIcon /></Button></TableCell>
            </TableRow>
              
            ))}
          </TableBody>
          </Table>}
      </div>
    </div>
  );
}
