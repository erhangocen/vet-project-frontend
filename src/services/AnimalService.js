import axios from "axios";
import apiProps from "./ServiceProperties";

export default class AnimalService {

    apiUrl = apiProps().baseUrl + "animal/";

    getAllAnimals(){
        return axios.get(this.apiUrl + "getAll", apiProps().jsonConfig);
    }

    getAllByOwnerId(id){
        return axios.get(this.apiUrl + "getAllByOwnerId?id="+id, apiProps().jsonConfig)
    }

    getAllPageable(pageNo, pageSize){
        return axios.get(this.apiUrl + "getAllPageable?pageNo=" + pageNo + "&pageSize=" + pageSize, apiProps().jsonConfig)
    }

    getAllByTypePageable(typeId, pageNo, pageSize){
        return axios.get(this.apiUrl + "getAllByTypeIdPageable?id=" + typeId + "&pageNo=" + pageNo + "&pageSize=" + pageSize, apiProps().jsonConfig)
    }

    getAllByBreedPageable(breedId, pageNo, pageSize){
        return axios.get(this.apiUrl + "getAllByBreedIdPageable?id=" + breedId + "&pageNo=" + pageNo + "&pageSize=" + pageSize, apiProps().jsonConfig)
    }
    
    getAllByType(typeId){
        return axios.get(this.apiUrl + "getAllByTypeId?id=" + typeId, apiProps().jsonConfig)
    }

    getAllByBreed(breedId){
        return axios.get(this.apiUrl + "getAllByBreedId?id=" + breedId, apiProps().jsonConfig)
    }

    addAnimal(animal){
        return axios.post(this.apiUrl + "add", animal, apiProps().jsonConfig);
    }

    updateAnimal(animal){
        return axios.post(this.apiUrl + "update", animal, apiProps().jsonConfig);
    }

    deleteAnimal(animal){
        return axios.post(this.apiUrl + "delete", animal, apiProps().jsonConfig);
    }

    updatePhoto(data){
        return axios.post(this.apiUrl + "updatePhoto", data, apiProps().jsonConfig)
    }

}