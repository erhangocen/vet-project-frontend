import axios from "axios";
import apiProps from "./ServiceProperties";

export default class AnimalTypeService {

    apiUrl = apiProps().baseUrl + "animalType/";

    getAllTypes(){
        return axios.get(this.apiUrl + "getAll", apiProps().jsonConfig);
    }

    addType(type){
        return axios.post(this.apiUrl + "add", type, apiProps().jsonConfig)
    } 

    updateType(type){
        return axios.post(this.apiUrl + "update", type, apiProps().jsonConfig)
    }

    deleteType(type){
        return axios.post(this.apiUrl + "delete", type, apiProps().jsonConfig)
    }

    updatePhoto(data){
        return axios.post(this.apiUrl + "updatePhoto", data, apiProps().jsonConfig)
    }

}
