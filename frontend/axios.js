import axios from 'axios';

const baseURL = 'http://127.0.0.1:8000/';
const getCsrfToken = () => {
      const csrf = document.cookie.match('(^|;)\\s*csrftoken\\s*=\\s*([^;]+)');
      return csrf ? csrf.pop() : '';
    };
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
const token =getCsrfToken()


const axiosInstance = axios.create({
	baseURL: baseURL,
	timeout: 5000,
	headers: {
		'X-CSRFToken': token? token:'',
		'Authorization': localStorage.getItem('access_token')?'Token'+' '+localStorage.getItem('access_token'):'',
	},
	withCredentials: true 
});
export default axiosInstance;
