
import axios from 'axios'

const loginForm=document.getElementById('login-form')

loginForm.addEventListener('submit',(e)=>{
	e.preventDefault()
	const data={
		"username":document.getElementById('username').value,
		"password":document.getElementById('password').value,
	}
	console.log(data)
	

		axios({
                    method: 'post',
                    url: 'http://127.0.0.1:8000/login/',
                    data:data,
                    withCredentials: true
                    
                }).then(response => {
                	console.log(response)
                	
                }).catch(err=>console.log(err))


})
const refre=document.getElementById('refresh')
refre.addEventListener('click',refresh)
const getCsrfToken = () => {
      const csrf = document.cookie.match('(^|;)\\s*csrftoken\\s*=\\s*([^;]+)');
      return csrf ? csrf.pop() : '';
    };
 axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
const token =getCsrfToken()
let access_token;
function refresh(){
	
	axios({
                    method: 'post',
                    url: 'http://127.0.0.1:8000/refresh/',
                    xstfCookieName: 'csrftoken',
                    xsrfHeaderName: 'X-CSRFToken',
                    
                    headers: {
                        'X-CSRFToken': token,
                    },
                    withCredentials: true
                    
                }).then(response => {
                	console.log(response)
                	access_token=response.data.access_token
                }).catch(err=>console.log(err))

}
const auth_test=document.getElementById('auth')
auth_test.addEventListener('click',test)
function test(){
	
	axios({
                    method: 'get',
                    url: 'http://127.0.0.1:8000/auth_test/',
                    xstfCookieName: 'csrftoken',
                    xsrfHeaderName: 'X-CSRFToken',
                    
                    headers: {
                        'X-CSRFToken': token,
                        'Authorization':'Token'+' '+access_token
                    },
                    withCredentials: true
                    
                }).then(response => console.log(response)).catch(err=>console.log(err))

}
