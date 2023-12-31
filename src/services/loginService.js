
import jwtDecode from 'jwt-decode';
import axios from 'axios';


const login = async (username, password) => {
    
    try {
        const response = await axios.post('http://localhost:8080/api/v1/authenticate', { username, password });
        const decodedjwt = jwtDecode(response.data.token);
        console.log('decoded jwt:'+JSON.stringify(decodedjwt));
        // Store token in the local storage
        localStorage.setItem('jwtToken', response.data.token);
        
        return { token:response.data.token, username: decodedjwt.sub, role: decodedjwt.roles[0] };
    } catch (error) {
        throw new Error('Login failed');
    }
};

const loginService = {
  login,
};

export default loginService;
