import axios from "axios";
import apiProps from "./ServiceProperties"

export default class AnimalBreedService {

    apiUrl = apiProps().baseUrl + "animalBreed/";

    getAllBreeds(){
        return axios.get(this.apiUrl + "getAll", apiProps().jsonConfig);    
    }

    getAllByType(id){
        return axios.get(this.apiUrl + "getByTypeId?id=" + id, apiProps().jsonConfig)
    }

    addBreed(breed){
        return axios.post(this.apiUrl + "add", breed, apiProps().jsonConfig)
    }

    updateBreed(breed){
        return axios.post(this.apiUrl + "update", breed, apiProps().jsonConfig)
    }

    deleteBreed(breed){
        return axios.post(this.apiUrl + "delete", breed, apiProps().jsonConfig)
    }

}
