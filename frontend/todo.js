import axios from 'axios'
import axiosInstance from './axios.js'


const checkAuth=()=>{
    let isauth=localStorage.getItem('isAuth')
    if(isauth !=='false'){
        console.log('working')
        console.log(isauth)
    }else{
        window.location='/'
    }
    
}
checkAuth()

const getTodo=()=>{
	axiosInstance.get('todo/',{},{withCredentials:true})
        .then(response=>{
        	console.log(response)
        	for(let i=0;i<response.data.length;i++){
        		const todos=document.getElementById('todos')
        		
        		const todo=document.createElement('div')
        		todo.classList.add('todo')
                todo.setAttribute("id",`id${response.data[i].id}`)
        		todo.innerHTML=`
        		
				<h4>${response.data[i].title}</h1>
				<div class="btns">	
				<input type='checkbox' id='test'>
				<button class="remove-btn" data-id='${response.data[i].id}'>Remove</button>
				
			</div>

        		`
        		todos.appendChild(todo)
        	}
                })
        .catch(err=>console.log(err))
    const todos=document.getElementById('todos')
    todos.addEventListener('click',e=>{
        if(e.target.tagName.toLowerCase()==='button' &&e.target.className==='remove-btn'){
            console.log(e.target.getAttribute('data-id'))
            todoDelete(e.target.getAttribute('data-id'))
            const todo=document.getElementById(`id${e.target.getAttribute('data-id')}`)
            todo.remove()
        }
    })

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
        	document.getElementById('todo-title').value=''
            location.reload()})
        .catch(err=>console.log(err))

}
const todoInput=document.getElementById('todo-input')

todoInput.addEventListener('submit',postTodo)
console.log(todoInput)



const todoDelete=(id)=>{
    axiosInstance.delete(`todo/${id}`,{withCredentials:true})
        .then(response=>console.log(response.json))
        .catch(err=>console.log(err))
}

const logoutBtn=document.getElementById('logout')
logoutBtn.addEventListener('click',logout)
function logout(){
    
    axios({
                    method: 'post',
                    url: 'http://127.0.0.1:8000/logout/',
                    
                    
                    
                    withCredentials: true
                    
                }).then(response => {
                    console.log(response)
                      localStorage.setItem('isAuth',false)
                      localStorage.removeItem('access_token')
                      location.reload()   
                }).catch(err=>console.log(err))

}
