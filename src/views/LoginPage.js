import React, { useEffect, useState } from 'react'
import styles from "../assets/css/loginPageStyle.module.css"
import { TextField } from "formik-material-ui"
import { ErrorMessage, Field, Form, Formik } from "formik";
import AuthService from 'services/AuthService';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import jwt from 'jwt-decode';
import * as Yup from 'yup';
import { Alert, Label } from 'reactstrap';
import NoPage from './NoPage';

export default function LoginPage() {

  const [token, setToken] = useState();

  useEffect(() => {
    setToken(localStorage.getItem("token"))
  }, []);

  const authService = new AuthService();
  let navigate = useNavigate();

  const login = async(values)=>{
    await new Promise((r)=>setTimeout(r,500));
    var loginObject = JSON.stringify(values,null,2);

    authService.login(loginObject).then((response)=>{
      if(response.data.success){
        localStorage.setItem("token" , response.data.data.token),
        toast.success(response.data.message, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 700,
        }),
        setTimeout(()=>{navigate("/mPanel/animals")},500)
      }
      else{
        toast.error(response.data.message, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        })
      }
  }).catch((errorResponse)=>(
    toast.error(errorResponse.data.message, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 1000,
    })
    ));
  } 
  
  const initialEmptyValues = {
    username : "",
    password : ""
  }

  const schema = Yup.object({
    username : Yup.string().min(3,"please enter minimum 3 character").required("Required Field"),
    password : Yup.string().min(5, "please enter minimum 5 character").required("Required Field")
  })

  return (
    <div className={styles.body}>
      {
        token?<NoPage/>:<Formik
        initialValues={initialEmptyValues}
        validationSchema={schema}
        onSubmit={(values)=>{login(values)}}>
          {({values}) => {
            return(
              <Form>
         <div className={styles.form}>
            <div className={styles.form__content}>
                <div className={styles.form__box}>
                    <Field type="text" name="username" className={styles.form__input} placeholder="Enter User Name"/>
                    <ErrorMessage name="username" render={error=>
                        <label className={styles.form__label}>{error}</label>
                      }></ErrorMessage>
                      <label className={styles.form__label}>ENTER USERNAME</label>
                    <div className={styles.form__shadow}></div>
                </div>
                <div className={styles.form__box}>
                    <Field type="password" name="password" className={styles.form__input} placeholder="Enter Password"/>
                    <ErrorMessage name="password" render={error=>
                        <label className={styles.form__label}>{error}</label>
                      }></ErrorMessage>
                    <label className={styles.form__label}>ENTER PASSWORD</label>
                    <div className={styles.form__shadow}></div>
                </div>

                <div className={styles.form__button}>
                  <button type="submit" className={styles.form__submit}>Sign Up</button>
                </div>
            </div>
        </div>
        </Form>
            )}}
            </Formik>
      }
      
    </div>
  )
}