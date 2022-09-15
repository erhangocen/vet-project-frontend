import React, { useState, useEffect, useMemo, useCallback } from "react";

import {
  Card,
  CardHeader,
  CardBody,
  Table,
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import styles from "assets/css/tableCardsStyle.module.css";

import AnimalService from "services/AnimalService";
import Fab from "@mui/material/Fab";
import { Link } from "react-router-dom";
import { Avatar, MenuItem, Select, FormControl, InputLabel, AlertTitle} from "@mui/material";
import AnimalBreedService from "services/AnimalBreedService";
import AnimalOwnerService from "services/AnimalOwnerService";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Alert from '@mui/material/Alert';
import * as Yup from 'yup';
import MatchError from "components/Search/MatchError";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
 

export default function AnimalsForOwner(props) {
  const [animals, setAnimals] = useState();
  const [animalBreeds, setAnimalBreeds] = useState();
  const [animalOwners, setAnimalOwners] = useState();
  const [currentAnimal, setCurrentAnimal] = useState();
  const [deleteModal, setdeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const [photoModal, setPhotoModal] = useState(false);
  const [updatePhotoPrewiew, setUpdatePhotoPrewiew] = useState();
  const [updatePhotoName, setUpdatePhotoName] = useState();
  const [anyPhoto, setAnyPhoto] = useState(false);

  const animalBreedService = new AnimalBreedService();
  const animalOwnerService = new AnimalOwnerService();
  const animalService = new AnimalService()

  const toggleDeleteModal = (animal) => {
    setdeleteModal(!deleteModal);
    setCurrentAnimal(animal);
  };

  const toggleEditModal = (animal) => {
    setEditModal(!editModal);
    setCurrentAnimal(animal);
  };

  const uploadPhoto = () => {
    if(anyPhoto){
      var input = document.getElementById("photo").files[0];

      var formData = new FormData();
      formData.append("animalId",currentAnimal?.id)
      formData.append("imageFile", input)

      animalService.updatePhoto(formData).then((response)=>(
        toast.success(response.data.message, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2500
      })
      ));
    }
    setPhotoModal(!photoModal)
    setUpdatePhotoPrewiew(currentAnimal?.photo?.photoUrl??currentAnimal?.animalType?.photo?.photoUrl);
    setUpdatePhotoName(null);
  }

  const toggleUpdatePhotoModal = () => {
    setUpdatePhotoPrewiew(currentAnimal?.photo?.photoUrl??currentAnimal?.animalType?.photo?.photoUrl);
    setUpdatePhotoName(null);
    setEditModal(false);
    setPhotoModal(!photoModal);
  }

  const updatePreview = () => {
    var input = document.getElementById("photo");
    var reader = new FileReader();
    reader.onload = function (e) {
      setUpdatePhotoPrewiew(e.target.result);
    };
    reader.readAsDataURL(input.files[0]);
    setUpdatePhotoName(input.files[0].name);
    setAnyPhoto(true);
  };
 
  useEffect(() => {
    animalService.getAllByOwnerId(props.ownerId).then((result)=>{
      setAnimals(result.data.data);
    })
    animalBreedService.getAllBreeds().then((result) => {
      setAnimalBreeds(result.data.data);
    });
    animalOwnerService.getAllOwners().then((result) => {
      setAnimalOwners(result.data.data);
    });
  }, [editModal,deleteModal]);

  const editDatas = async(values)=>{
    await new Promise((r)=>setTimeout(r,500));
    var editAnimalObject = (JSON.stringify(values,null,2));
    animalService.updateAnimal(editAnimalObject).then((response)=>(
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
    var deleteAnimalObject = JSON.stringify(currentAnimal,null,2);
    animalService.deleteAnimal(deleteAnimalObject).then((response)=>(
      toast.error(response.data.message, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2500
    })
    ));
    setdeleteModal(!deleteModal)
  } 
  

  const editSchema = Yup.object({
    age: Yup.number().required("Required Field").positive().integer().typeError("Please enter a number"),
    description: Yup.string().required("Required Field"),
    name: Yup.string().required("Required Field")
  })

  const initialEditValues = {
    id: currentAnimal?.id,
    age: currentAnimal?.age,
    animalBreed : {
      id: currentAnimal?.animalBreed?.id
    },
    animalOwner: {
      id: currentAnimal?.animalOwner?.id
    },
    description: currentAnimal?.description,
    name: currentAnimal?.name
  }
  
  const initialEmptyValues = {
    age: undefined,
    description: "",
    name: "",
    animalBreed : {
      id: 0
    },
    animalOwner: {
      id: 0
    }
  }

  return (
    <div>
      <div className={styles.content + " content"}>
        {animals ? (
          <div>
            <Row className="justify-content-center">
            {animals.length !== 0 ?
              <Col md="12">
                <Card style={{"backgroundColor":props?.bgColor}}>
                  <CardHeader>
                    <div className="title">
                      <b>Animals </b>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <Table responsive className={styles.table}>
                      <div className={styles.place}>
                        <div className="container">
                          <div className="row justify-content-center">
                            {animals?.map((animal) => (
                              <div
                                className={styles.cards + " col-md-auto"}
                                key={animal.id}
                              >
                                <a className={styles.card}>
                                  <img
                                    src={
                                      animal.photo?.photoUrl ??
                                      animal.animalBreed.animalType.photo
                                        .photoUrl
                                    }
                                    className={styles.card__image}
                                    alt=""
                                  />
                                  <div className={styles.card__overlay}>
                                    <div className={styles.card__header}>
                                      <svg
                                        className={styles.card__arc}
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path />
                                      </svg>
                                      <div className={styles.card__header_text}>
                                      <Fab onClick={() => {
                                                toggleDeleteModal(animal);
                                              }} className={
                                                styles.visible_icon
                                              } size="small" aria-label="edit" style={{ float: "right" }}>
                                            <DeleteIcon />
                                          </Fab>
                                            <Fab onClick={() => {
                                                toggleEditModal(animal);
                                              }}
                                              className={
                                                styles.visible_icon
                                              }
                                              color="danger"
                                              size="small"
                                              aria-label="edit"
                                              style={{ float: "right" }}
                                            >
                                              <EditIcon />
                                            </Fab>
                                        
                                        <h3 className={styles.card__title}>
                                          <b className={styles.animal_name}>
                                            {animal.name}
                                          </b>
                                        </h3>
                                      </div>
                                    </div>
                                    <p className={styles.card__description}>
                                      <b>Age : </b>
                                      {" " + animal.age}
                                    </p>
                                    <p className={styles.card__description}>
                                      <b>Breed : </b>
                                      <span
                                        className={styles.link}
                                        to={
                                          animal?.animalBreed?.animalType?.typeName
                                        }
                                      >
                                        {" " +
                                          animal?.animalBreed?.animalType?.typeName}
                                      </span>
                                    </p>
                                    <p className={styles.card__description}>
                                      <b>Breed : </b>
                                      <span
                                        className={styles.link}
                                        to={animal?.animalBreed.breedName}
                                      >
                                        {" " + animal?.animalBreed.breedName}
                                      </span>
                                    </p>

                                    <p className={styles.card__description}>
                                      <img
                                        width={30}
                                        height={30}
                                        src={animal?.animalOwner.photo.photoUrl}
                                        style={{
                                          borderRadius: "50%",
                                          marginRight: "7px",
                                        }}
                                      />
                                      <Link
                                        className={styles.link}
                                        to={"/mPanel/ownerProfile/"+animal?.animalOwner?.id}
                                      >
                                        {" " +
                                          animal?.animalOwner.firstName +
                                          " " +
                                          animal?.animalOwner.lastName}
                                      </Link>
                                    </p>

                                    <p className={styles.card__description}>
                                      {animal.description}
                                    </p>
                                  </div>
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Table>
                  </CardBody>
                </Card>
              </Col>
              :<Alert severity="info" style={{"width":"70%"}}>
                <AlertTitle>There Are No Any Result</AlertTitle>
                This owner does not have any animals yet  — <strong><Link to={"/mPanel/animals"}>add an animal</Link></strong>
              </Alert> }
            </Row>
          </div>
        ) : (
          <div
            className="spinner-border"
            role="status"
            style={{ position: "absolute", left: "50%", top: "35%" }}
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        )}
        <Modal isOpen={deleteModal} toggle={toggleDeleteModal}>
          <ModalHeader toggle={toggleDeleteModal}>Delete Animal</ModalHeader>
          <ModalBody>
            Do you really want to delete these records? This process cannot be
            undone.
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={deleteDatas}>
              Delete
            </Button>{" "}
            <Button color="secondary" onClick={toggleDeleteModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>

        <Modal
          isOpen={editModal}
          toggle={toggleEditModal}
          modalTransition={{ timeout: 200 }}
          backdropTransition={{ timeout: 200 }}
        >
         <Formik
        initialValues={initialEditValues}
        validationSchema={editSchema}
        onSubmit={(values)=>{editDatas(values)}}>
          {({ dirty, isValid, values, handleChange, handleBlur }) => {
            return(
              <Form>
          <ModalHeader toggle={toggleEditModal}>Edit Animal</ModalHeader>
          <ModalBody>
              <Field
                id="outlined-required"
                className="contactForm w-100 mt-2 mb-2"
                label="Name"
                variant="outlined"
                name="name"
                defaultValue={currentAnimal?.name}
                component={TextField}
              />
              <Field
                id="outlined-required"
                className="contactForm w-100 mt-2 mb-2"
                label="Age"
                variant="outlined"
                name="age"
                defaultValue={currentAnimal?.age}
                component={TextField}
              />
              <Field
                multiline
                rows={2} //max 55 character
                id="outlined-required"
                className="contactForm w-100 mt-2 mb-2"
                label="Description"
                variant="outlined"
                name="description"
                defaultValue={currentAnimal?.description}
                component={TextField}
              />
              <FormControl fullWidth variant="outlined" className="mb-4 mt-3">
                <InputLabel id="demo-simple-select-outlined-label">
                  Breed
                </InputLabel>
                <Select
                  className="contactForm w-100"
                  labelId="demo-simple-select-label"
                  variant="outlined"
                  label="Breed"
                  name="animalBreed.id"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  defaultValue={currentAnimal?.animalBreed?.id}
                >
                  {animalBreeds?.map((animalBreed) => (
                    <MenuItem key={animalBreed?.id} value={animalBreed?.id}>
                      {animalBreed?.breedName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth variant="outlined" className="mb-4 mt-3">
              <InputLabel id="demo-simple-select-outlined-labell">
                Owner
              </InputLabel>
              <Select
                className="contactForm w-100"
                labelId="demo-simple-select-labell"
                variant="outlined"
                label="Owner"
                name="animalOwner.id"
                onChange={handleChange}
                onBlur={handleBlur}
                defaultValue={currentAnimal?.animalOwner?.id}
              >
                {animalOwners?.map((animalOwner) => (
                  <MenuItem key={animalOwner?.id} value={animalOwner?.id}>
                    <Avatar
                      src={animalOwner?.photo?.photoUrl}
                      sx={{ display: "-webkit-inline-box", marginRight: 1 }}
                    />
                    {" " + animalOwner?.firstName + " " + animalOwner?.lastName}
                  </MenuItem>
                ))}
              </Select>
              </FormControl>
          </ModalBody>
          <ModalFooter>
          <div style={{ width: "100%" }}>
            <div style={{ float: "left" }}>
              <Button color="primary" onClick={toggleUpdatePhotoModal}>
                Update Photo
              </Button>
            </div>

            <div style={{ float: "right" }}>
              <Button color="success" type="submit">
                Edit
              </Button>{" "}
              <Button color="secondary" onClick={toggleEditModal}>
                Cancel
              </Button>
            </div>
          </div>
          </ModalFooter>
          </Form>
            )}}
            </Formik>
        </Modal>

        <Modal
        isOpen={photoModal}
        toggle={toggleUpdatePhotoModal}
        modalTransition={{ timeout: 500 }}
        backdropTransition={{ timeout: 500 }}
      >
        <ModalHeader toggle={toggleUpdatePhotoModal}>Update Photo</ModalHeader>
        <ModalBody>
          <form>
            <section className="container max-w-xl mx-auto flex flex-col py-8">
              <div className="py-8">
                <div className="file-input flex items-center">
                  <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                    <div>
                      <img
                        style={{
                          borderRadius: "50%",
                          height: "110px",
                          marginRight: "20px",
                        }}
                        src={
                          updatePhotoPrewiew
                            ??
                            currentAnimal?.animalBreed?.animalType?.photo?.photoUrl
                        }
                        width={110}
                      />
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="rounded-5 shadow-lg  updatePhotoButton">
                      <input
                        onChange={() => {
                          updatePreview();
                        }}
                        type="file"
                        accept="image/*,capture=camera"
                        name="photo"
                        id="photo"
                        className="custom"
                      />
                      <label
                        htmlFor="photo"
                        className="py-2 px-3 rounded-1 text-sm leading-4 font-medium updatePhotoLabel"
                      >
                        Upload Photo
                      </label>
                    </div>
                    <div style={{"marginLeft":"20px", "color":"grey", "maxWidth": "30px"}}>
                        {updatePhotoName}
                    </div>
                  </div>

                </div>
              </div>
            </section>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={uploadPhoto}>
            Update
          </Button>{" "}
          <Button color="secondary" onClick={toggleUpdatePhotoModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
      </div>
    </div>
  )
}
