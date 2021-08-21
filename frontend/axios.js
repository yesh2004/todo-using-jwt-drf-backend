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

axiosInstance.interceptors.response.use(
	(response) => {
		return response;
	},
	async function (error) {
		const originalRequest = error.config;

		if (typeof error.response === 'undefined') {
			alert(
				'A server/network error occurred. ' +
					'Looks like CORS might be the problem. ' +
					'Sorry about this - we will get it fixed shortly.'
			);
			return Promise.reject(error);
		}

		

		if (
			
			error.response.status === 403 &&
			error.response.statusText === 'Forbidden'
		) {
			

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
                	localStorage.setItem('access_token',response.data.access_token)
                	location.reload()
                }).catch(err=>console.log(err))

			} 
		

		// specific error handling done elsewhere
		return Promise.reject(error);
	}
);

export default axiosInstance;
