import React, { useState, useEffect } from "react";

import {
  Card,
  CardHeader,
  CardBody,
  Table,
  Row,
  Col,
  Button, Modal, ModalHeader, ModalBody, ModalFooter
} from "reactstrap";
import { TextField } from "formik-material-ui"
import VetService from "services/VetService";
import Switch from '@mui/material/Switch';
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import Serarchbar from "components/Search/Serarchbar";
import { Field, Form, Formik } from "formik";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import * as Yup from 'yup';
import MatchError from "components/Search/MatchError";
import jwtDecode from "jwt-decode";
import { Alert, AlertTitle } from "@mui/material";
import { Link } from "react-router-dom";

const label = { inputProps: { 'aria-label': 'Switch demo' } };

export default function VetListPage() {

  const [vets, setVets] = useState();
  const [currentVet, setCurrentVet] = useState();
  const [addModal, setAddModal] = useState(false);
  const [searchText, setSearchText] = useState();
  const [filterData, setFilterData] = useState();
  const [userRole, setUserRole] = useState();
  const [statusChange,setStatusChange] = useState()

  const vetService = new VetService()

  const toggleAddModal = () => setAddModal(!addModal)

  useEffect(() => {
    if(!searchText){
      setFilterData(vets);
    }
  });

  useEffect(() => {
    window.scrollTo(0,0);
    var token = localStorage.getItem("token");
    var decodedToken = jwtDecode(token)
    var role = decodedToken.authorities[0].authority;
    setUserRole(role);
  }, []);

  useEffect(() => {
    vetService.getAllVets().then((result)=>{
      setVets(result.data.data);
    });
  }, [addModal,statusChange]);

  let searchbarHandler = (e) => {
    setSearchText(e.target.value.toLowerCase());
  }

  useEffect(()=>{
    const filterData = vets?.filter((el)=>{
      if(!searchText){
        return el;
      }
      else{
        return el.username.toLowerCase().includes(searchText)
      } 
    })
    setFilterData(filterData)

  },[searchText])

  const addDatas = async(values)=>{
    await new Promise((r)=>setTimeout(r,500));
    var addVetObject = JSON.stringify(values,null,2);
    vetService.addVet(addVetObject).then((response)=>(
      toast.success(response.data.message, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2500,
    }),
    setAddModal(false)
    )).catch((errorResponse)=>(
      toast.error(errorResponse.response.data.message)
    ));
  }

  const handleChange = (currentVet) => {
    var newVet = Object.assign(currentVet,{enable:!(currentVet.enable)})
    var changedVetObject = JSON.stringify(newVet,null,2)
    vetService.updateVet(changedVetObject);
    setStatusChange(!statusChange)
  };

  const schema = Yup.object({
    username : Yup.string().min(3,"please enter minimum 3 character").required("Required Field"),
    password : Yup.string().min(5, "please enter minimum 5 character").required("Required Field")
  })

  const initialEditValues = Object.assign({},currentVet);
  
  const initialEmptyValues = {
    username : "",
    password : ""
  }

  return (
    <div className="content mt-4 col-8">
      {userRole  ?
        <div>
          {vets?
      <div>
        <Row className="justify-content-center">
          <Col md="12">
            <Card>
            <CardHeader>
                  <div className="title">
                    <b>Vets </b>
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
                    <div className="col-md-11">
                      <Serarchbar searchbarPlaceHolder="Search An Breed" onChange={searchbarHandler} />
                    </div>
                  </div>
                </CardHeader>
              <CardBody>

              {filterData?.length != 0 ? 

<Table responsive>
<thead className="text-primary">
  <tr>
    <th>Id</th>
    <th className="text-center">Name</th>
    <th className="text-center">Role Name</th>
    <th className="text-right">Status</th>
  </tr>
</thead>
<tbody>
  {
    filterData?.map((vet)=>(
      <tr key={vet?.id}>
        <td>{vet?.id}</td>
        <td className="text-center">{vet?.username}</td>
          <td key={vet.roles[0].id} className="text-center">{vet?.roles[0]?.roleName??"ROLE_NULL"}</td>
        <td className="text-right">
          <div>
            <Switch checked={vet?.enable} onChange={()=>{handleChange(vet)}}/>
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
        </Row>
      </div>
    : 
    <div className="spinner-border" role="status" style={{"position":"absolute", "left":"50%", "top":"35%"}}>
      <span className="visually-hidden">Loading...</span>
    </div>}

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
        <ModalHeader toggle={toggleAddModal}>Add Vet</ModalHeader>
        <ModalBody>
              <Field
                id="outlined-required"
                className="contactForm w-100 mt-2 mb-2"
                label="Username"
                variant="outlined"
                name="username"
                component={TextField}
              />
              <Field
                id="outlined-required-password"
                className="contactForm w-100 mt-2 mb-2"
                label="Password"
                variant="outlined"
                name="password"
                type={"password"}
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
      :
      <Alert severity="error">
                    <AlertTitle>You are not authorized to do so</AlertTitle>
                    Only admin can access this page <strong>--<Link to={"/mPanel/animals"}> back to animals</Link></strong>
                </Alert> 
      }
    </div>
  );
}
