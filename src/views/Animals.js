import React, { useState, useEffect, useMemo, useCallback } from "react";

import {
  Card,
  CardHeader,
  CardBody,
  Table,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "reactstrap";
import styles from "assets/css/tableCardsStyle.module.css";

import AnimalService from "services/AnimalService";
import Fab from "@mui/material/Fab";
import Serarchbar from "components/Search/Serarchbar";
import PageNavigator from "components/Navigators/PageNavigator";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Avatar,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import AnimalBreedService from "services/AnimalBreedService";
import AnimalOwnerService from "services/AnimalOwnerService";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Alert from "@mui/material/Alert";
import * as Yup from "yup";
import MatchError from "components/Search/MatchError";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SelectInput from "@mui/material/Select/SelectInput";
import { Stack } from "@mui/system";
import AnimalTypeService from "services/AnimalTypeService";

export default function AnimalsPage(props) {
  const [animals, setAnimals] = useState([]);
  const [animalsPart, setAnimalsPart] = useState();
  const [animalBreeds, setAnimalBreeds] = useState([]);
  const [filterBreeds, setFilterBreeds] = useState([]);
  const [animalTypes, setAnimalTypes] = useState([]);
  const [animalOwners, setAnimalOwners] = useState();
  const [currentAnimal, setCurrentAnimal] = useState();
  const [deleteModal, setdeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [photoModal, setPhotoModal] = useState(false);
  const [updatePhotoPrewiew, setUpdatePhotoPrewiew] = useState();
  const [updatePhotoName, setUpdatePhotoName] = useState();
  const [anyPhoto, setAnyPhoto] = useState(false);
  const [searchText, setSearchText] = useState();
  const [filterData, setFilterData] = useState();
  const [pagenationVisible, setPagenationVisible] = useState(true);
  const [pageSize, setPageSize] = useState(9);
  const [pageableCount, setPageableCount] = useState();
  const [navigatorVisible, setNavigatorVisible] = useState(false);
  const [targetType, setTargetType] = useState(0);
  const [targetBreed, setTargetBreed] = useState(0);
  const [addInTypes, setAddInTypes] = useState(0);
  const [addInBreeds, setAddInBreeds] = useState(); 

  const animalTypeService = new AnimalTypeService();
  const animalBreedService = new AnimalBreedService();
  const animalOwnerService = new AnimalOwnerService();
  const animalService = new AnimalService();
  let navigete = useNavigate()

  const { pageNo } = useParams();

  const toggleDeleteModal = (animal) => {
    setdeleteModal(!deleteModal);
    setCurrentAnimal(animal);
  };

  const toggleEditModal = (animal) => {
    setEditModal(!editModal);
    setCurrentAnimal(animal);

  };

  const toggleBreedsFromType = (typeId, breedId) => {
    setTargetType(typeId)
    setTimeout(() => {
      setTargetBreed(breedId)
    }, 10);
    
  }

  const handleAddInTypes = (e) => {
    setAddInTypes(e.target.value);
    animalBreedService.getAllByType(e.target.value).then((result)=>(
      setAddInBreeds(result.data.data)
    ))
  }

  const uploadPhoto = () => {
    if (anyPhoto) {
      var input = document.getElementById("photo").files[0];

      var formData = new FormData();
      formData.append("animalId", currentAnimal?.id);
      formData.append("imageFile", input);

      animalService
        .updatePhoto(formData)
        .then((response) =>
          toast.success(response.data.message, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2500,
          })
        )
        .catch((response) =>
          toast.error(
            response.message + " Probably maximum upload size exceeded",
            {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 3500,
            }
          )
        );
    }
    setPhotoModal(!photoModal);
    setUpdatePhotoPrewiew(
      currentAnimal?.photo?.photoUrl ??
        currentAnimal?.animalType?.photo?.photoUrl
    );
    setUpdatePhotoName(null);
  };

  const toggleAddModal = () => setAddModal(!addModal);

  const toggleUpdatePhotoModal = () => {
    setUpdatePhotoPrewiew(
      currentAnimal?.photo?.photoUrl ??
        currentAnimal?.animalType?.photo?.photoUrl
    );
    setUpdatePhotoName(null);
    setEditModal(false);
    setPhotoModal(!photoModal);
  };

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
    window.scrollTo(0, 0);
    if(targetType==0&&targetBreed==0){
      animalService
        .getAllPageable(pageNo ?? 1, pageSize)
        .then((result) => setAnimalsPart(result.data.data));
    }
    if(targetType!=0&&targetBreed==0){
      animalService
        .getAllByTypePageable(targetType,pageNo ?? 1, pageSize)
        .then((result) => setAnimalsPart(result.data.data));
    }
    if(targetType!=0&&targetBreed!=0){
      animalService
        .getAllByBreedPageable(targetBreed,pageNo ?? 1, pageSize)
        .then((result) => setAnimalsPart(result.data.data));
    }

    
  }, [addModal,deleteModal,editModal,pageNo,targetBreed,targetType]);

  useEffect(() => {
    if (!searchText) {
      setFilterData(animalsPart);
      setPagenationVisible(true);
    } else {
      setPagenationVisible(false);
    }
  });

  useEffect(() => {
    const filterData = animals?.filter((el) => {
      return el.name.toLowerCase().includes(searchText);
    });
    setFilterData(filterData);
  }, [searchText]);

  let searchBarHandler = (e) => {
    setSearchText(e.target.value.toLowerCase());
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(()=>{
    setTargetBreed(0);
    animalBreedService.getAllByType(targetType).then((result)=>(
      setFilterBreeds(result.data.data)
    ))
  },[targetType])

  useEffect(() => {
    if(targetType == 0 && targetBreed == 0){
        animalService.getAllAnimals().then((result) => {
        setAnimals(result.data.data);
        pageabeMaker(result.data.data.length);
      });
    }
    if(targetType != 0 && targetBreed == 0){
      animalService.getAllByType(targetType).then((result) => {
        setAnimals(result.data.data);
        pageabeMaker(result.data.data.length);   
      });
    }
    if(targetType != 0 && targetBreed != 0){
      animalService.getAllByBreed(targetBreed).then((result) => {
        setAnimals(result.data.data);
        pageabeMaker(result.data.data.length);
        console.log(result.data.data)
      });
    }
    animalBreedService.getAllBreeds().then((result) => {
      setAnimalBreeds(result.data.data);
    });
    animalTypeService.getAllTypes().then((result)=>{
      setAnimalTypes(result.data.data)
    });
    animalOwnerService.getAllOwners().then((result) => {
      setAnimalOwners(result.data.data);
    });
  }, [addModal, editModal, deleteModal, pageableCount, targetType, targetBreed]);

  const pageabeMaker = (data) => {
      var pageCount = data / pageSize;
      var roundPageCount = Math.ceil(pageCount);
      setPageableCount(roundPageCount);
      setNavigatorVisible(true);
  };

  const targetTypeChange = (e) => {
    setTargetType(e.target.value)
    navigete("/mPanel/animals/1")
  }

  const targetBreedChange = (e) => {
    setTargetBreed(e.target.value)
    navigete("/mPanel/animals/1")
  }

  const filterReset = () =>{
    setTargetBreed(0);
    setTargetType(0);
    navigete("/mPanel/animals/1")
  }

  const addDatas = async (values) => {
    await new Promise((r) => setTimeout(r, 500));
    var addAnimalObject = JSON.stringify(values, null, 2);
    animalService
      .addAnimal(addAnimalObject)
      .then(
        (response) => (
          toast.success(response.data.message, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2500,
          }),
          setAddModal(false)
        )
      )
      .catch((errorResponse) =>
        toast.error(errorResponse.response.data.message)
      );
  };

  const editDatas = async (values) => {
    await new Promise((r) => setTimeout(r, 500));
    var editAnimalObject = JSON.stringify(values, null, 2);
    animalService
      .updateAnimal(editAnimalObject)
      .then(
        (response) => (
          toast.success(response.data.message, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2500,
          }),
          setEditModal(false)
        )
      )
      .catch((errorResponse) =>
        toast.error(errorResponse.response.data.message)
      );
  };

  const deleteDatas = () => {
    var deleteAnimalObject = JSON.stringify(currentAnimal, null, 2);
    animalService.deleteAnimal(deleteAnimalObject).then(
      (response) => (
        toast.error(response.data.message, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2500,
        }),
        setdeleteModal(false)
      )
    );
  };

  const addSchema = Yup.object({
    age: Yup.number()
      .required("Required Field")
      .positive()
      .integer()
      .typeError("Please enter a number"),
    description: Yup.string().required("Required Field").max(55),
    name: Yup.string().required("Required Field"),
    animalBreed: Yup.object({
      id: Yup.number().min(1, "Please select a breed"),
    }),
    animalOwner: Yup.object({
      id: Yup.number().min(1, "Please select an owner"),
    }),
  });

  const editSchema = Yup.object({
    age: Yup.number()
      .required("Required Field")
      .positive()
      .integer()
      .typeError("Please enter a number"),
    description: Yup.string().required("Required Field"),
    name: Yup.string().required("Required Field"),
  });

  const initialEditValues = {
    id: currentAnimal?.id,
    age: currentAnimal?.age,
    animalBreed: {
      id: currentAnimal?.animalBreed?.id,
    },
    animalOwner: {
      id: currentAnimal?.animalOwner?.id,
    },
    description: currentAnimal?.description,
    name: currentAnimal?.name,
  };

  const initialEmptyValues = {
    age: undefined,
    description: "",
    name: "",
    animalBreed: {
      id: 0,
    },
    animalOwner: {
      id: 0,
    },
  };

  return (
      <div className="d-flex justify-content-center col-11">
      <div className={styles.content + " content w-100"}>
        {animalsPart ? (
          <div>
            <div className="justify-content-center">
              <Col md="12">
                <Card>
                  <CardHeader>
                    <div className="title">
                      <b>Animals </b>
                      <Fab
                        onClick={toggleAddModal}
                        color="primary"
                        aria-label="edit"
                        style={{
                          float: "right",
                          position: "relative",
                          bottom: "40px",
                        }}
                      >
                        <AddIcon />
                      </Fab>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <div className="m-3 mb-4 row height d-flex justify-content-center align-items-center">
                      <div className="col-md-8">
                        <Serarchbar
                          searchbarPlaceHolder="Search An Animal"
                          onChange={searchBarHandler}
                        />
                      </div>
                    </div>
                    <div className="d-flex justify-content-center m-4">
                      <div className="row d-flex align-items-center">
                      <div className="col-md-8 d-flex align-items-center justify-content-center">
                        <FormControl sx={{ m: 1, minWidth: 120 }}>
                          <InputLabel id="demo-simple-select-label">
                            Type
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Age"
                            value={targetType}
                            onChange={targetTypeChange}
                          >
                            <MenuItem value={0}>Select</MenuItem>
                            {
                             animalTypes?.map((animalType)=>(
                              <MenuItem key={animalType?.id} value={animalType?.id}>{animalType?.typeName}</MenuItem>
                             )) 
                            }
                          </Select>
                        </FormControl>
                        <FormControl sx={{ m: 1, minWidth: 120 }}>
                          <InputLabel id="demo-simple-select-label">
                            Breed
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Age"
                            value={targetBreed}
                            onChange={targetBreedChange}
                            disabled={targetType==0?true:false}
                            
                          >
                            <MenuItem value={0}>Select</MenuItem>
                            {
                              filterBreeds?.map((animalBreed)=>(
                                <MenuItem key={animalBreed?.id} value={animalBreed?.id}>{animalBreed?.breedName}</MenuItem>
                              ))
                              
                            }
                          </Select>
                        </FormControl>
                      </div>
                      <div className="col-md-4 d-flex align-items-center justify-content-center">
                          <Button color="info" onClick={()=>{filterReset()}} outline>
                            Reset
                          </Button>
                      </div>
                    </div>
                      </div>
                    <Table responsive className={styles.table}>
                      <div className={styles.place}>
                        <div className="container">
                          <div className="row justify-content-center">
                            {filterData?.length !== 0 ? (
                              filterData?.map((animal) => (
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
                                        <div
                                          className={styles.card__header_text}
                                        >
                                          <Fab
                                            onClick={() => {
                                              toggleDeleteModal(animal);
                                            }}
                                            className={styles.visible_icon}
                                            size="small"
                                            aria-label="edit"
                                            style={{ float: "right" }}
                                          >
                                            <DeleteIcon />
                                          </Fab>
                                          <Fab
                                            onClick={() => {
                                              toggleEditModal(animal);
                                            }}
                                            className={styles.visible_icon}
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
                                          onClick={()=>{setTargetType(animal?.animalBreed?.animalType
                                              ?.id);setTargetBreed(0)}                 
                                          }
                                        >
                                          {" " +
                                            animal?.animalBreed?.animalType
                                              ?.typeName}
                                        </span>
                                      </p>
                                      <p className={styles.card__description}>
                                        <b>Breed : </b>
                                        <span
                                          className={styles.link}
                                          onClick={()=>{toggleBreedsFromType(animal?.animalBreed?.animalType
                                            ?.id,animal?.animalBreed?.id)}}
                                        >
                                          {" " + animal?.animalBreed.breedName}
                                        </span>
                                      </p>

                                      <p className={styles.card__description}>
                                        <img
                                          width={30}
                                          height={30}
                                          src={
                                            animal?.animalOwner.photo.photoUrl
                                          }
                                          style={{
                                            borderRadius: "50%",
                                            marginRight: "7px",
                                          }}
                                        />
                                        <Link
                                          className={styles.link}
                                          to={
                                            "/mPanel/ownerProfile/" +
                                            animal?.animalOwner?.id
                                          }
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
                              ))
                            ) : (
                              <MatchError />
                            )}
                          </div>
                        </div>
                      </div>
                    </Table>
                    {pagenationVisible ? (
                      <div style={{ paddIng: "20px", marginBottom: "40px" }}>
                        {navigatorVisible ? (
                          <PageNavigator
                            page={pageableCount ?? 6}
                            location="/mPanel/animals/"
                          />
                        ) : (
                          ""
                        )}
                      </div>
                    ) : (
                      ""
                    )}
                  </CardBody>
                </Card>
              </Col>
            </div>
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
            onSubmit={(values) => {
              editDatas(values);
            }}
          >
            {({ dirty, isValid, values, handleChange, handleBlur }) => {
              return (
                <Form>
                  <ModalHeader toggle={toggleEditModal}>
                    Edit Animal
                  </ModalHeader>
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
                    <FormControl
                      fullWidth
                      variant="outlined"
                      className="mb-4 mt-3"
                    >
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
                          <MenuItem
                            key={animalBreed?.id}
                            value={animalBreed?.id}
                          >
                            {animalBreed?.breedName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl
                      fullWidth
                      variant="outlined"
                      className="mb-4 mt-3"
                    >
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
                          <MenuItem
                            key={animalOwner?.id}
                            value={animalOwner?.id}
                          >
                            <Avatar
                              src={animalOwner?.photo?.photoUrl}
                              sx={{
                                display: "-webkit-inline-box",
                                marginRight: 1,
                              }}
                            />
                            {" " +
                              animalOwner?.firstName +
                              " " +
                              animalOwner?.lastName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </ModalBody>
                  <ModalFooter>
                    <div style={{ width: "100%" }}>
                      <div style={{ float: "left" }}>
                        <Button
                          color="primary"
                          onClick={toggleUpdatePhotoModal}
                        >
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
              );
            }}
          </Formik>
        </Modal>

        <Modal
          isOpen={addModal}
          toggle={toggleAddModal}
          modalTransition={{ timeout: 200 }}
          backdropTransition={{ timeout: 200 }}
        >
          <Formik
            initialValues={initialEmptyValues}
            validationSchema={addSchema}
            onSubmit={(values) => {
              addDatas(values);
            }}
          >
            {({ dirty, isValid, values, handleChange, handleBlur }) => {
              return (
                <Form>
                  <ModalHeader toggle={toggleAddModal}>Add Animal</ModalHeader>
                  <ModalBody>
                    <Field
                      id="outlined-required"
                      className="contactForm w-100 mt-2 mb-2"
                      label="Name"
                      variant="outlined"
                      name="name"
                      component={TextField}
                    />
                    <Field
                      id="outlined-required"
                      className="contactForm w-100 mt-2 mb-2"
                      label="Age"
                      variant="outlined"
                      name="age"
                      component={TextField}
                    />
                    <Field
                      multiline
                      rows={2}
                      id="outlined-required"
                      className="contactForm w-100 mt-2 mb-2"
                      label="Description"
                      variant="outlined"
                      name="description"
                      component={TextField}
                    />
                    <FormControl
                      fullWidth
                      variant="outlined"
                      className="mb-2 mt-2"
                    >
                      <InputLabel id="demo-simple-select-outlined-label">
                        Type
                      </InputLabel>
                      <Select
                        className="contactForm w-100"
                        labelId="demo-simple-select-label"
                        variant="outlined"
                        label="Type"
                        onChange={handleAddInTypes}
                        onBlur={handleBlur}
                        value={addInTypes}
                      >
                        <MenuItem value={0}>Select A Type</MenuItem>
                        {animalTypes?.map((animalType) => (
                          <MenuItem
                            key={animalType?.id}
                            value={animalType?.id}
                          >
                            <Avatar
                              src={animalType?.photo?.photoUrl}
                              sx={{
                                display: "-webkit-inline-box",
                                marginRight: 1,
                              }}
                            />
                            {animalType?.typeName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl
                      fullWidth
                      variant="outlined"
                      className="mb-2 mt-2"
                    >
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
                        defaultValue={0}
                        disabled={addInTypes == 0 ? true : false}
                      >
                        <MenuItem value={0}>Select A Breed</MenuItem>
                        {addInBreeds?.map((animalBreed) => (
                          <MenuItem
                            key={animalBreed?.id}
                            value={animalBreed?.id}
                          >
                            {animalBreed?.breedName}
                          </MenuItem>
                        ))}
                      </Select>
                      <ErrorMessage
                        name="animalBreed.id"
                        render={(error) => (
                          <Alert
                            variant="outlined"
                            style={{ border: "none" }}
                            severity="error"
                          >
                            <strong>{error}</strong>
                          </Alert>
                        )}
                      ></ErrorMessage>
                    </FormControl>

                    <FormControl
                      fullWidth
                      variant="outlined"
                      className="mb-2 mt-2"
                    >
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
                        defaultValue={0}
                      >
                        <MenuItem value={0}>Select An Owner</MenuItem>
                        {animalOwners?.map((animalOwner) => (
                          <MenuItem
                            key={animalOwner?.id}
                            value={animalOwner?.id}
                          >
                            <Avatar
                              src={animalOwner?.photo?.photoUrl}
                              sx={{
                                display: "-webkit-inline-box",
                                marginRight: 1,
                              }}
                            />
                            {" " +
                              animalOwner?.firstName +
                              " " +
                              animalOwner?.lastName}
                          </MenuItem>
                        ))}
                      </Select>
                      <ErrorMessage
                        name="animalOwner.id"
                        render={(error) => (
                          <Alert
                            variant="outlined"
                            style={{ border: "none" }}
                            severity="error"
                          >
                            <strong>{error}</strong>
                          </Alert>
                        )}
                      ></ErrorMessage>
                    </FormControl>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="primary" type="submit">
                      Add
                    </Button>{" "}
                    <Button color="secondary" onClick={toggleAddModal}>
                      Cancel
                    </Button>
                  </ModalFooter>
                </Form>
              );
            }}
          </Formik>
        </Modal>

        <Modal
          isOpen={photoModal}
          toggle={toggleUpdatePhotoModal}
          modalTransition={{ timeout: 500 }}
          backdropTransition={{ timeout: 500 }}
        >
          <ModalHeader toggle={toggleUpdatePhotoModal}>
            Update Photo
          </ModalHeader>
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
                            updatePhotoPrewiew ??
                            currentAnimal?.animalBreed?.animalType?.photo
                              ?.photoUrl
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
                      <div
                        style={{
                          marginLeft: "20px",
                          color: "grey",
                          maxWidth: "30px",
                        }}
                      >
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

  );
}
