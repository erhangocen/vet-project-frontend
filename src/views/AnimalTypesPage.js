import React, { useState, useEffect } from "react";

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
import { TextField } from "formik-material-ui"
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";

import AnimalTypeService from "../services/AnimalTypeService";
import Serarchbar from "components/Search/Serarchbar";
import { Field, Form, Formik } from "formik";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import * as Yup from 'yup';
import MatchError from "components/Search/MatchError";

export default function AnimalTypesPage() {
  const [animalTypes, setAnimalTypes] = useState();
  const [currentType, setCurrentType] = useState();
  const [deleteModal, setdeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [photoModal, setPhotoModal] = useState(false);
  const [updatePhotoPrewiew, setUpdatePhotoPrewiew] = useState();
  const [updatePhotoName, setUpdatePhotoName] = useState();
  const [anyPhoto, setAnyPhoto] = useState(false);
  const [searchText, setSearchText] = useState();
  const [filterData, setFilterData] = useState();

  const animalTypeService = new AnimalTypeService();

  const toggleDeleteModal = (type) => {
    setdeleteModal(!deleteModal);
    setCurrentType(type);
  };

  const toggleEditModal = (type) => {
    setEditModal(!editModal);
    setCurrentType(type);
    setUpdatePhotoPrewiew(type.photo?.photoUrl)
  };

  const toggleUpdatePhotoModal = () => {
    setUpdatePhotoPrewiew(currentType?.photo?.photoUrl);
    setUpdatePhotoName(null);
    setEditModal(false);
    setPhotoModal(!photoModal);
  }

  const uploadPhoto = () => {
    if(anyPhoto){
      var input = document.getElementById("photo").files[0];

      var formData = new FormData();
      formData.append("typeId",currentType?.id)
      formData.append("imageFile", input)

      animalTypeService.updatePhoto(formData).then((response)=>(
        toast.success(response.data.message, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2500
      })
      )).catch((response)=>(
        toast.error(response.message + ' Probably maximum upload size exceeded', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3500
        })
      ));
    }
    setPhotoModal(!photoModal);
    setUpdatePhotoPrewiew(currentType?.photo?.photoUrl);
    setUpdatePhotoName(null);
  }

  const toggleAddModal = () => setAddModal(!addModal);


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

  let searchbarHandler = (e) => {
    setSearchText(e.target.value.toLowerCase());
  }

  useEffect(() => {
    if(!searchText){
      setFilterData(animalTypes)
    }
  });

  useEffect(()=>{
    const filterData = animalTypes?.filter((el)=>{
        return el.typeName.toLowerCase().includes(searchText)
    })
    setFilterData(filterData)

  },[searchText])

  useEffect(() => {
    animalTypeService.getAllTypes().then((result) => {
      setAnimalTypes(result.data.data);
    });
  }, [addModal,editModal,deleteModal]);

  useEffect(()=>{
    window.scrollTo(0,0);
  },[])

  const addDatas = async(values)=>{
    await new Promise((r)=>setTimeout(r,500));
    var addTypeObject = JSON.stringify(values,null,2);
    animalTypeService.addType(addTypeObject).then((response)=>(
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
    var editTypeObject = (JSON.stringify(values,null,2));
    animalTypeService.updateType(editTypeObject).then((response)=>(
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
    var deleteTypeObject = JSON.stringify(currentType,null,2);
    animalTypeService.deleteType(deleteTypeObject).then((response)=>(
      toast.error(response.data.message, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2500
    }),
    setdeleteModal(false)
    ));
  } 

  const schema = Yup.object({
    typeName : Yup.string().required("Required Field").max(30)
  })

  const initialEditValues = Object.assign({},currentType);
  
  const initialEmptyValues = {
    typeName : ""
  }

  return (
    <div className="content mt-4 col-9">
      {animalTypes ? (
        <div>
          <div className="justify-content-center">
            <Col
              md="12">
              <Card>
                <CardHeader>
                  <div className="title">
                    <b>Animal Types </b>
                    <Fab
                      color="primary"
                      aria-label="add"
                      style={{
                        float: "right",
                        position: "relative",
                        bottom: "27px",
                      }}
                      size="medium"
                      onClick={toggleAddModal}
                    >
                      <AddIcon />
                    </Fab>
                  </div>
                  <div className="m-4 row height d-flex justify-content-center align-items-center">
                    <div className="col-md-11">
                      <Serarchbar searchbarPlaceHolder="Search An Type" onChange={searchbarHandler} />
                    </div>
                  </div>
                </CardHeader>
                <CardBody>
                  {
                    filterData?.length !== 0 ?
                  
                  <Table responsive>
                    <thead className="text-primary">
                      <tr>
                        <th>Id</th>
                        <th className="text-center">Name</th>
                        <th className="text-center">Photo</th>
                        <th className="text-right">Edit/Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filterData?.map((animalType) => (
                        <tr key={animalType?.id}>
                          <td>{animalType?.id}</td>
                          <td className="text-center">
                            {animalType?.typeName}
                          </td>
                          <td className="text-center">
                            <div>
                              <img
                                src={animalType?.photo?.photoUrl}
                                width={80}
                                height={80}
                                style={{ borderRadius: "50%" }}
                              />
                            </div>
                          </td>
                          <td className="text-right">
                            <div>
                              <button
                                className="btn edit-btn btn-outline-success"
                                onClick={() => {
                                  toggleEditModal(animalType);
                                }}
                              >
                                <FaPencilAlt size={20} />
                              </button>
                              <button
                                className="btn edit-btn btn-outline-danger"
                                onClick={() => {
                                  toggleDeleteModal(animalType);
                                }}
                              >
                                <FaTrashAlt size={20} />
                              </button>
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
        <ModalHeader toggle={toggleDeleteModal}>Delete Type</ModalHeader>
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
        modalTransition={{ timeout: 500 }}
        backdropTransition={{ timeout: 500 }}
      >
        <Formik
        initialValues={initialEditValues}
        validationSchema={schema}
        onSubmit={(values)=>{editDatas(values)}}>
          {({values}) => {
            return(
              <Form>
        <ModalHeader toggle={toggleEditModal}>Edit Type</ModalHeader>
        <ModalBody>
            <Field
              id="outlined-required"
              className="w-100"
              label="Type Name"
              variant="outlined"
              defaultValue={currentType?.typeName}
              name="typeName"
              component={TextField}
            />
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
        isOpen={addModal}
        toggle={toggleAddModal}
        modalTransition={{ timeout: 500 }}
        backdropTransition={{ timeout: 500 }}
      >
        <Formik
        initialValues={initialEmptyValues}
        validationSchema={schema}
        onSubmit={(values)=>{addDatas(values)}}>
          {({values}) => {
            return(
              <Form>
        <ModalHeader toggle={toggleAddModal}>Add Type</ModalHeader>
        <ModalBody>
              <Field
                id="outlined-required"
                className="w-100"
                placeholder="Type Name"
                name="typeName"
                variant="outlined"
                label="Type Name"
                value ={values.typeName}
                component={TextField}
              />
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
            )
          }  }
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
                            ? updatePhotoPrewiew
                            : currentType?.photo?.photoUrl
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
  );
}
