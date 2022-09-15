import axios from "axios";
import apiProps from "./ServiceProperties";

export default class AuthService {

    apiUrl = apiProps().baseUrl + "auth/";

    login(loginDto){
        return axios.post(this.apiUrl + "login", loginDto, {headers:{'Content-Type': 'application/json'}});
    }

}