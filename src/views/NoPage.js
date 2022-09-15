import React from 'react'
import { Link } from 'react-router-dom'
import styles from "../assets/css/noPageStyle.module.css"

export default function NoPage() {
  return (
    <div>
        <figure>
	<div className={styles.sad_dog}><img className={styles.crydogimg} src='https://res.cloudinary.com/dbzf16o0x/image/upload/v1662849886/cryindog_bohwd0.png'/></div>
	<div className={styles.figcaption}>
        <div className='col-md-11'>
            <div className='row'>
                <div className='col-7 d-flex justify-content-end p-3'>
                    <span className={styles.e}></span>
                    <span className={styles.r}></span>
                    <span className={styles.r}></span>
                    <span className={styles.o}></span>
                    <span className={styles.r}></span>
                </div>
                <div className='col-5  d-flex justify-align-content-between p-3'>
                    <span className={styles._4}></span>
                    <span className={styles._0}></span>
                    <span className={styles._4}></span>
                </div>
                <div className='col-6  d-flex justify-content-end p-3'>
                    <span className={styles.n}></span>
                    <span className={styles.o}></span>
                    <span className={styles.t}></span>
                </div>
                <div className='col-3  d-flex justify-content-center p-3'>
                    <span className={styles.f}></span>
                    <span className={styles.o}></span>
                    <span className={styles.u}></span>
                    <span className={styles.n}></span>
                    <span className={styles.d}></span>
                </div>
                <div className='col-12 d-flex justify-content-center p-2 m-lg-4'>
                    <div className='fs-6' style={{"marginLeft":"5%"}}>
                       <Link to={"/"}> Back To Homepage </Link>
                    </div>
                </div>
            </div>
        </div> 
	</div>
</figure>
    </div>
  )
}
