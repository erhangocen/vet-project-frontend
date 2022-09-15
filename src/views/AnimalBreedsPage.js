import React, { useState, useEffect } from "react";

import {
  Card,
  CardHeader,
  CardBody,
  Table,
  Row, 
  Col,
  Button, Modal, ModalHeader, ModalBody, ModalFooter, Label
} from "reactstrap";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import AnimalBreedService from "services/AnimalBreedService";
import Serarchbar from "components/Search/Serarchbar";
import AnimalTypeService from "services/AnimalTypeService";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";
import axios from "axios";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import * as Yup from 'yup';

import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import MatchError from "components/Search/MatchError";

export default function AnimalBreedsPage() {
  const [animalBreeds, setAnimalBreeds] = useState();
  const [animalTypes, setAnimalTypes] = useState();
  const [currentBreed, setCurrentBreed] = useState();
  const [deleteModal, setdeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [searchText, setSearchText] = useState();
  const [filterData, setFilterData] = useState();

  const animalBreedService = new AnimalBreedService();
  const animalTypeService = new AnimalTypeService();

  const toggleDeleteModal = (breed) => {
    setdeleteModal(!deleteModal);
    setCurrentBreed(breed);
  }  

  const toggleEditModal = (breed) => {
    setEditModal(!editModal);
    setCurrentBreed(breed);
  } 

  const toggleAddModal = () => setAddModal(!addModal)

  useEffect(()=>{
    if(!searchText){
      setFilterData(animalBreeds)
    }
  })

  useEffect(()=>{
    const filterData = animalBreeds?.filter((el)=>{
        return el.breedName.toLowerCase().includes(searchText) 
    })
    setFilterData(filterData)
  },[searchText])

  useEffect(() => {
    window.scrollTo(0,0);
  },[]);

  useEffect(() => {
    animalBreedService.getAllBreeds().then((result)=>{
      setAnimalBreeds(result.data.data);
    });
    animalTypeService.getAllTypes().then((result)=>{
      setAnimalTypes(result.data.data);
    })
  },[addModal,editModal,deleteModal]);


  let searchbarHandler = (e) => {
    setSearchText(e.target.value.toLowerCase());
  }

  const addDatas = async(values)=>{
    await new Promise((r)=>setTimeout(r,500));
    var addBreedObject = JSON.stringify(values,null,2);
    animalBreedService.addBreed(addBreedObject).then((response)=>(
      toast.success(response.data.message, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2500,
    }),
    setAddModal(false)
    )).catch((errorResponse)=>(
      toast.error(errorResponse.response.data.message)
    ));
  } 

  const editDatas = async(values)=>{
    await new Promise((r)=>setTimeout(r,500));
    var editBreedObject = (JSON.stringify(values,null,2));
    animalBreedService.updateBreed(editBreedObject).then((response)=>(
      toast.success(response.data.message, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2500
    }),
    setEditModal(false)
    )).catch((errorResponse)=>(
      toast.error(errorResponse.response.data.message)
    ));
  } 
  
  const deleteDatas = () => {
    var deleteBreedObject = JSON.stringify(currentBreed,null,2);
    animalBreedService.deleteBreed(deleteBreedObject).then((response)=>(
      toast.error(response.data.message, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2500
    }),
    setdeleteModal(false)
    ));
  } 

  const addSchema = Yup.object({
    breedName: Yup.string().required("Required Field").max(30),
    animalType : Yup.object({
      id: Yup.number().min(1,"Please select a type")
    })
  })
  const editSchema = Yup.object({
    breedName: Yup.string().required("Required Field")
  })

  const initialEditValues = {
    id:currentBreed?.id,
    breedName: currentBreed?.breedName,
    animalType : {
      id: currentBreed?.animalType?.id
    }
  }
  
  const initialEmptyValues = {
    breedName: "",
    animalType : {
      id: 0
    }
  }

  return (
    <div className="content mt-4 col-10">
    {animalBreeds?
      <div>
        <div className="justify-content-center">
          <Col md="12">
            <Card>
            <CardHeader>
                  <div className="title">
                    <b>Animal Breeds </b>
                    <Fab
                      color="primary"
                      aria-label="add"
                      style={{ float: "right","position":"relative", "bottom":"27px" }}
                      size="medium"
                      onClick={toggleAddModal}
                    >
                      <AddIcon />
                    </Fab>
                  </div>
                  <div className="m-4 row height d-flex justify-content-center align-items-center">
                    <div className="col-md-10">
                      <Serarchbar searchbarPlaceHolder="Search An Breed" onChange={searchbarHandler} />
                    </div>
                  </div>
                </CardHeader>
              <CardBody>
                {filterData?.length !== 0 ?
                <Table responsive>
                  <thead className="text-primary">
                    <tr>
                      <th>Id</th>
                      <th className="text-center">Name</th>
                      <th className="text-center">Type Name</th>
                      <th className="text-right">Edit/Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      filterData?.map((animalBreed)=>(
                        <tr key={animalBreed.id}>
                          <td>{animalBreed.id}</td>
                          <td className="text-center">{animalBreed?.breedName}</td>
                          <td className="text-center">{animalBreed?.animalType?.typeName}</td>
                          <td className="text-right">
                            <div>
                              <button className="btn edit-btn btn-outline-success" onClick={()=>{toggleEditModal(animalBreed)}}><FaPencilAlt size={20}/></button>
                              <button className="btn edit-btn btn-outline-danger" onClick={()=>{toggleDeleteModal(animalBreed)}}><FaTrashAlt size={20}/></button>
                            </div>
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </Table>
                :
                    <MatchError/>
 
                }
              </CardBody>
            </Card>
          </Col>
        </div>
      </div>
    : 
    <div className="spinner-border" role="status" style={{"position":"absolute", "left":"50%", "top":"35%"}}>
      <span className="visually-hidden">Loading...</span>
    </div>}

    <Modal
        isOpen={deleteModal}
        toggle={toggleDeleteModal}
      >
        <ModalHeader toggle={toggleDeleteModal}>Delete Breed</ModalHeader>
        <ModalBody>
        Do you really want to delete these records? This process cannot
                be undone.
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={deleteDatas} type="submit">
            Delete
          </Button>{' '}
          <Button color="secondary" onClick={toggleDeleteModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>



      <Modal
        isOpen={editModal}
        toggle={toggleEditModal}
        modalTransition={{ timeout: 500 }}
        backdropTransition={{ timeout: 500 }}
      >
        <Formik
        initialValues={initialEditValues}
        validationSchema={editSchema}
        onSubmit={(values)=>{editDatas(values)}}>
          {({ dirty, isValid, values, handleChange, handleBlur }) => {
            return(
              <Form>
        <ModalHeader toggle={toggleEditModal}>Edit Breed</ModalHeader>
        <ModalBody>        
        <FormControl fullWidth variant="outlined" className="mb-4 mt-3">
              <InputLabel id="demo-simple-select-outlined-label">
                Type
              </InputLabel>
              <Select 
                variant="outlined"
                labelId="demo-simple-select-label"
                label="Type"
                name="animalType.id"
                onChange={handleChange}
                onBlur={handleBlur}
                defaultValue={currentBreed?.animalType?.id}
              >
                {animalTypes?.map((animalType)=>(
                  <MenuItem key={animalType?.id} value={animalType?.id}>
                    {animalType?.typeName}
                  </MenuItem>
                ))}
              </Select>
        </FormControl>
              <Field
                id="outlined-required"
                className="w-100"
                placeholder="Breed Name"
                name="breedName"
                variant="outlined"
                label="Breed Name"
                value ={values.breedName}
                defaultValue={currentBreed.breedName}
                component={TextField}
              />
        </ModalBody>
        <ModalFooter>
          <Button color="success" type="submit">
            Edit
          </Button>{' '}
          <Button color="secondary" onClick={toggleEditModal}>
            Cancel
          </Button>
        </ModalFooter>
        </Form>
            )}}
        </Formik>
      </Modal>


      
      <Modal
        isOpen={addModal}
        toggle={toggleAddModal}
        modalTransition={{ timeout: 500 }}
        backdropTransition={{ timeout: 500 }}
      >
         <Formik
        initialValues={initialEmptyValues}
        validationSchema={addSchema}
        onSubmit={(values)=>{addDatas(values)}}>
          {({ dirty, isValid, values, handleChange, handleBlur }) => {
            return(
              <Form>
        <ModalHeader toggle={toggleAddModal}>Add Breed</ModalHeader>
        <ModalBody>
        <FormControl fullWidth variant="outlined" className="mb-3 mt-3">
              <InputLabel id="demo-simple-select-outlined-label">
                Type
              </InputLabel>
              <Select 
                variant="outlined"
                labelId="demo-simple-select-label"
                label="Type"
                name="animalType.id"
                onChange={handleChange}
                onBlur={handleBlur}
                defaultValue={0}
              >
                  <MenuItem value={0}>Select Animal Type</MenuItem>
                {animalTypes?.map((animalType)=>(
                  <MenuItem key={animalType?.id} value={animalType?.id}>
                    {animalType?.typeName}
                  </MenuItem>
                ))}
              </Select>
              <ErrorMessage name="animalType.id" render={error=>
                 <Alert variant="outlined" style={{"border":"none"}} severity="error">
                    <strong>{error}</strong>
                  </Alert>
              }></ErrorMessage>
        </FormControl>
              <Field
                id="outlined-required"
                className="w-100"
                placeholder="Breed Name"
                name="breedName"
                variant="outlined"
                label="Breed Name"
                value ={values.breedName}
                component={TextField}
              />
        </ModalBody>
        <ModalFooter>
          <Button color="primary" type="submit">
            Add
          </Button>{' '}
          <Button color="secondary" onClick={toggleAddModal}>
            Cancel
          </Button>
        </ModalFooter>
        </Form>
            )}}
        </Formik>
      </Modal>
      
    </div>
  );
}

