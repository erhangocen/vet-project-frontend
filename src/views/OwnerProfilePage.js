import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import AnimalOwnerService from 'services/AnimalOwnerService';
import AnimalService from 'services/AnimalService';
import styles from "../assets/css/ownerProilePageStyle.module.css"
import AnimalsPage from './Animals';
import PhoneIcon from '@mui/icons-material/Phone';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Animal from 'components/Animals/AnimalsForOwner.js';

export default function OwnerProfilePage() {

    const[animals, setAnimals] = useState();
    const[owner,setOwner] = useState();

    const {id} = useParams();

    const animalService = new AnimalService();
    const animalOwnerService = new AnimalOwnerService();
    
    useEffect(()=>{
        animalService.getAllByOwnerId(id).then((result)=>(
            setAnimals(result.data.data)
        ));
        animalOwnerService.getById(id).then((result)=>(
            setOwner(result.data.data)
        ));
        window.scrollTo(0,0);
    },[])

  return (
    <div className={styles.profile_page+ " profile-page col-12 mt-4"}>
    
    <div className={styles.page_header + " " + styles.header_filter}></div>
    <div className={styles.main + " " + styles.main_raised + " main main-raised"}>
		<div className={styles.profile_content}>
            {owner?
                <div className="container p-3 pb-3">
                    <div className="row" style={{"justifyContent":"center"}}>
                    <div className="col-md-6 ml-auto mr-auto">
                        <div className={styles.profile + " profile"}>
                                <div className={styles.avatar + " avatar"}>
                                    <img src={owner?.photo?.photoUrl} alt="Circle Image" className={styles.img_raised + " " + styles.rounded_circle + " " + styles.img_fluid + " img-raised rounded-circle img-fluid"}/>
                                </div>
                                <div className={styles.name + " name"}>
                                    <h3 className="title">{owner?.firstName + " " + owner?.lastName}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.description + " description text-center"}>
                        <p><AlternateEmailIcon/> {owner?.email}</p>
                        <p><PhoneIcon/>{" +90 " + owner?.phoneNumber}</p>
                    </div>
                    <Animal ownerId={id} bgColor="rgb(250,250,247)"/>
                </div>
                :
                <Alert severity="error">
                    <AlertTitle>There Are No Any Result</AlertTitle>
                        This owner has been deleted or is no longer accessible — <strong><Link to={"/mPanel/owners"}>add an owner</Link></strong>
                </Alert>  
            }
        </div>
        </div>
    </div>
  )
}
