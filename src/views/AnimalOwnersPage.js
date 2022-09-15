import React, { useState, useEffect, useCallback, useMemo } from "react";

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
import { TextField } from "formik-material-ui";
import { Field, Form, Formik } from "formik";
import styles from "assets/css/tableCardsStyle.module.css";

import AnimalOwnerService from "services/AnimalOwnerService";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Serarchbar from "components/Search/Serarchbar";
import PageNavigator from "components/Navigators/PageNavigator";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import * as Yup from "yup";
import { Link, useParams } from "react-router-dom";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import MatchError from "components/Search/MatchError";

export default function AnimalOwnersPage() {
  const [animalOwners, setAnimalOwners] = useState();
  const [animalOwnersPart, setAnimalOwnersPart] = useState();
  const [currentOwner, setCurrentOwner] = useState();
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
  const [pageSize, setPageSize] = useState(6);
  const [pageableCount, setPageableCount] = useState(0);
  const [navigatorVisible, setNavigatorVisible] = useState(false);

  const { pageNo } = useParams();

  const animalOwnerService = new AnimalOwnerService();

  const toggleDeleteModal = (owner) => {
    setdeleteModal(!deleteModal);
    setCurrentOwner(owner);
  };

  const toggleEditModal = (owner) => {
    setEditModal(!editModal);
    setCurrentOwner(owner);
    setUpdatePhotoPrewiew(owner?.photo?.photoUrl);
  };

  const uploadPhoto = () => {
    if (anyPhoto) {
      var input = document.getElementById("photo").files[0];

      var formData = new FormData();
      formData.append("ownerId", currentOwner?.id);
      formData.append("imageFile", input);

      animalOwnerService.updatePhoto(formData).then((response) =>(
        toast.success(response.data.message, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2500,
        })
      )).catch((response)=>(
        toast.error(response.message + ' Probably maximum upload size exceeded', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3500
        })
      ));
    }
    setPhotoModal(!photoModal);
    setUpdatePhotoPrewiew(currentOwner?.photo?.photoUrl);
    setUpdatePhotoName(null);
  };

  const toggleAddModal = () => setAddModal(!addModal);

  const toggleUpdatePhotoModal = () => {
    setUpdatePhotoPrewiew(currentOwner?.photo?.photoUrl);
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
    animalOwnerService
      .getAllOwnersPageable(pageNo ?? 1, pageSize)
      .then((result) => setAnimalOwnersPart(result.data.data));
  }, [addModal,deleteModal,editModal,pageNo]);

  useEffect(() => {
    if (!searchText) {
      setFilterData(animalOwnersPart);
      setPagenationVisible(true);
    } else {
      setPagenationVisible(false);
    }
  });

  useEffect(() => {
    const filterData = animalOwners?.filter((el) => {
      return el.firstName.toLowerCase().includes(searchText);
    });
    setFilterData(filterData);
  }, [searchText]);

  useEffect(() => {
    animalOwnerService.getAllOwners().then((result) => {
      setAnimalOwners(result.data.data);
      var pageCount = result.data.data.length / pageSize;
      var roundPageCount = Math.ceil(pageCount);
      setPageableCount(roundPageCount);
      setNavigatorVisible(true);
    });
  }, [addModal, editModal, deleteModal, pageableCount]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  let searchbarHandler = (e) => {
    setSearchText(e.target.value.toLowerCase());
  };

  const addDatas = async (values) => {
    await new Promise((r) => setTimeout(r, 500));
    var addOwnerObject = JSON.stringify(values, null, 2);
    animalOwnerService
      .addOwner(addOwnerObject)
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
    var editOwnerObject = JSON.stringify(values, null, 2);
    animalOwnerService
      .updateOwner(editOwnerObject)
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
    var deleteOwnerObject = JSON.stringify(currentOwner, null, 2);
    animalOwnerService.deleteOwner(deleteOwnerObject).then(
      (response) => (
        toast.error(response.data.message, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2500,
        }),
        setdeleteModal(false)
      )
    );
  };

  const schema = Yup.object({
    firstName: Yup.string().required("Required Field"),
    lastName: Yup.string().required("Required Field"),
    email: Yup.string()
      .email("Must Be A Valid Email")
      .required("Required Field"),
    phoneNumber: Yup.number()
      .required("Required Field")
      .positive()
      .integer()
      .typeError("Please enter a valid number"),
  });

  const initialEditValues = Object.assign({}, currentOwner);

  const initialEmptyValues = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  };

  return (
    <div className="d-flex justify-content-center col-11">
      <div className={styles.content + " content w-100"}>
      {animalOwnersPart ? (
        <div>
          <div className="justify-content-center">
            <Col md="12">
              <Card>
                <CardHeader>
                  <div className="title">
                    <b>Animal Owners </b>
                    <Fab
                      color="primary"
                      aria-label="add"
                      style={{
                        float: "right",
                        position: "relative",
                        bottom: "40px",
                      }}
                      onClick={toggleAddModal}
                    >
                      <AddIcon />
                    </Fab>
                  </div>
                </CardHeader>
                <CardBody>
                <div className="m-3 row height d-flex justify-content-center align-items-center">
                      <div className="col-md-8">
                        <Serarchbar searchbarPlaceHolder="Search An Owner" onChange={searchbarHandler} />
                      </div>
                    </div>
                  <Table responsive className={styles.table}>
                    <div className={styles.place}>
                      <div className="container">
                        <div className="row justify-content-center">
                          {filterData?.length !== 0 ? (
                            filterData?.map((animalOwner) => (
                              <div
                                className={"col-4 " + styles.cards}
                                key={animalOwner.id}
                              >
                                <a className={styles.card}>
                                  <Link
                                    to={
                                      "/mPanel/ownerProfile/" + animalOwner.id
                                    }
                                  >
                                    <img
                                      src={animalOwner.photo?.photoUrl}
                                      className={styles.card__image}
                                      alt=""
                                    />
                                  </Link>
                                  <div className={styles.card__overlay}>
                                    <div className={styles.card__header}>
                                      <svg
                                        className={styles.card__arc}
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path />
                                      </svg>
                                      <div className={styles.card__header_text}>
                                        <Fab
                                          onClick={() => {
                                            toggleDeleteModal(animalOwner);
                                          }}
                                          className={
                                            styles.visible_icon +
                                            " visible_icon"
                                          }
                                          size="small"
                                          aria-label="edit"
                                          style={{ float: "right" }}
                                        >
                                          <DeleteIcon />
                                        </Fab>
                                        <Fab
                                          onClick={() => {
                                            toggleEditModal(animalOwner);
                                          }}
                                          className={
                                            styles.visible_icon +
                                            " visible_icon"
                                          }
                                          color="danger"
                                          size="small"
                                          aria-label="edit"
                                          style={{ float: "right" }}
                                        >
                                          <EditIcon />
                                        </Fab>
                                        <h3 className={styles.card__title}>
                                          <a
                                            href={
                                              "/mPanel/ownerProfile/" +
                                              animalOwner.id
                                            }
                                            style={{ color: "black" }}
                                          >
                                            <b>
                                              {animalOwner.firstName +
                                                " " +
                                                animalOwner.lastName}
                                            </b>
                                          </a>
                                        </h3>
                                      </div>
                                    </div>
                                    <p
                                      className={styles.card__description}
                                      style={{ marginTop: "2em" }}
                                    >
                                      {" "}
                                      📧 {animalOwner.email}
                                    </p>
                                    <p className={styles.card__description}>
                                      📞 {"+90 " + animalOwner.phoneNumber}
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
                    <div style={{ padding: "20px", marginBottom: "40px" }}>
                      {navigatorVisible ? (
                        <PageNavigator
                          page={pageableCount??6}
                          location="/mPanel/owners/"
                        />
                      ) : (
                        "bb"
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
        <ModalHeader toggle={toggleDeleteModal}>Delete Owner</ModalHeader>
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
          onSubmit={(values) => {
            editDatas(values);
          }}
        >
          {({ values }) => {
            return (
              <Form>
                <ModalHeader toggle={toggleEditModal}>Edit Owner</ModalHeader>
                <ModalBody>
                  <Field
                    id="outlined-required"
                    className="contactForm w-50 mb-2"
                    label="First Name"
                    variant="outlined"
                    name="firstName"
                    component={TextField}
                  />
                  <Field
                    id="outlined-required"
                    className="contactForm w-50"
                    label="Last Name"
                    variant="outlined"
                    name="lastName"
                    component={TextField}
                  />
                  <Field
                    id="outlined-required"
                    className="contactForm w-100 mt-2 mb-2"
                    label="Email"
                    variant="outlined"
                    name="email"
                    component={TextField}
                  />
                  <Field
                    id="outlined-required"
                    className="contactForm w-100 mt-3 mb-3"
                    label="Phone Number"
                    variant="outlined"
                    name="phoneNumber"
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
            );
          }}
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
          onSubmit={(values) => {
            addDatas(values);
          }}
        >
          {({ values }) => {
            return (
              <Form>
                <ModalHeader toggle={toggleAddModal}>Add Owner</ModalHeader>
                <ModalBody>
                  <Field
                    id="outlined-required"
                    className="contactForm w-50 mb-2"
                    label="First Name"
                    variant="outlined"
                    name="firstName"
                    component={TextField}
                  />
                  <Field
                    id="outlined-required"
                    className="contactForm w-50"
                    label="Last Name"
                    variant="outlined"
                    name="lastName"
                    component={TextField}
                  />
                  <Field
                    id="outlined-required"
                    className="contactForm w-100 mt-2 mb-2"
                    label="Email"
                    variant="outlined"
                    name="email"
                    component={TextField}
                  />
                  <Field
                    id="outlined-required"
                    className="contactForm w-100 mt-3 mb-3"
                    label="Phone Number"
                    variant="outlined"
                    name="phoneNumber"
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
                          updatePhotoPrewiew ?? currentOwner?.photo?.photoUrl
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
