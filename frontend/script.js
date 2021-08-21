
import axios from 'axios'
import axiosInstance from './axios.js'


const loginForm=document.getElementById('login-form')

loginForm.addEventListener('submit',(e)=>{
	e.preventDefault()
	const data={
		"username":document.getElementById('username').value,
		"password":document.getElementById('password').value,
	}


		axiosInstance
                .post('login/',data,{headers:{'Authorization':''}},{withCredentials: true})
                .then(response => {
                	console.log(response)
                	localStorage.setItem('access_token',response.data.access_token)
                    localStorage.setItem('isAuth',true)
                    window.location='/todo.html'
                }).catch(err=>console.log(err))


})

const getCsrfToken = () => {
      const csrf = document.cookie.match('(^|;)\\s*csrftoken\\s*=\\s*([^;]+)');
      return csrf ? csrf.pop() : '';
    };
 
const token =getCsrfToken()






