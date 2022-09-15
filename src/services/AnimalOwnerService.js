import axios from "axios";
import apiProps from "./ServiceProperties";

export default class AnimalOwnerService {

    apiUrl = apiProps().baseUrl + "animalOwner/";

    getAllOwners(){
        return axios.get(this.apiUrl + "getAll", apiProps().jsonConfig);
    }

    getAllOwnersPageable(pageNo, pageSize){
        return axios.get(this.apiUrl + "getAllPageable?pageNo=" + pageNo + "&pageSize=" + pageSize, apiProps().jsonConfig)
    }

    getById(id){
        return axios.get(this.apiUrl + "getById?id=" + id, apiProps().jsonConfig)
    }

    addOwner(owner){
        return axios.post(this.apiUrl + "add" ,owner, apiProps().jsonConfig)
    }

    updateOwner(owner){
        return axios.post(this.apiUrl + "update" ,owner, apiProps().jsonConfig)
    }

    deleteOwner(owner){
        return axios.post(this.apiUrl + "delete" ,owner, apiProps().jsonConfig)
    }

    updatePhoto(data){
        return axios.post(this.apiUrl + "updatePhoto", data, apiProps().jsonConfig)
    }

}