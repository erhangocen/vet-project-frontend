import axios from "axios";
import apiProps from "./ServiceProperties";

export default class VetService {

    apiUrl = apiProps().baseUrl + "vet/";

    getAllVets(){
        return axios.get(this.apiUrl + "getAll", apiProps().jsonConfig);
    }

    addVet(vet){
        return axios.post(this.apiUrl + "add", vet, apiProps().jsonConfig)
    }

    updateVet(vet){
        return axios.post(this.apiUrl + "update", vet, apiProps().jsonConfig)
    }

    deleteVet(vet){
        return axios.post(this.apiUrl + "delete", vet, apiProps().jsonConfig)
    }

}
