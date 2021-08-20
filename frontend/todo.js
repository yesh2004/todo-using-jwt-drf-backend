import axios from 'axios'
import axiosInstance from './axios.js'

const getTodo=()=>{
	axiosInstance.get('todo/',{},{withCredentials:true})
        .then(response=>{
        	console.log(response)
        	for(let i=0;i<response.data.length;i++){
        		const todos=document.getElementById('todos')
        		console.log(response.data[i].title,response.data[i].id)
        		const todo=document.createElement('div')
        		todo.classList.add('todo')
        		todo.innerHTML=`
        		
				<h4>${response.data[i].title}</h1>
				<div class="btns">	
				<input type='checkbox' id='test'>
				<button class="remove-btn" data-id='${response.data[i].id}'>Remove</button>
				
			</div>

        		`
        		todos.appendChild(todo)
        	}})
        .catch(err=>console.log(err))

}
getTodo()
const postTodo=(e)=>{
    e.preventDefault()
    console.log('post')
    const data={
        "title":document.getElementById('todo-title').value
    }
    axiosInstance.post('todo/',data,{withCredentials:true})
        .then(response => {
        	console.log(response) 
        	document.getElementById('todo-title').value=''})
        .catch(err=>console.log(err))

}
const todoInput=document.getElementById('todo-input')

todoInput.addEventListener('submit',postTodo)
console.log(todoInput)
const deleteBtns=document.getElementsByClassName('.remove-btn')
console.log(deleteBtns)
/*deleteBtns.forEach(btn=>{
    btn.addEventListener('click',todoDelete(btn.datasets.id))
    console.log(btn.datasets.id)
})*/
const todoDelete=(id)=>{
    axiosInstance.delete(`todo/${id}/`,{withCredentials:true})
        .then(response=>console.log(response.json))
        .catch(err=>console.log(err))
}
