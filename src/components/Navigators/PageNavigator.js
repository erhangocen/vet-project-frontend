import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import styles from "../../assets/css/mainPanelStyle.module.css"

export default function PageNavigator(props) {

  const [pages] = useState([]);
  const {pageNo} = useParams();

  useEffect(()=>{
    pages.length = 0
    for(var i=1; i<props.page+1; i++){
      pages.push(i);
    }
  },[props.page])

  const linkActive = (e) => {
    if(e==pageNo){
      return "active"
    }
  }

  return (
    <div>
      {
        pages.length != 1 ? 
        <nav
          aria-label="Page navigation example"
          className={styles.page_navigator}
        >
          <ul className="pagination">
          {
            pages?.map((page)=>(
              <li key={page} className="page-item">
                <Link to={`${props.location}${page}`} className={"page-link " + linkActive(page) + " " + (pageNo?"":page==1?" active":"")}>
                  {page}
                </Link>
              </li>
            ))
            
          }
          </ul>
        </nav>
        : ""
      }
    </div>
  )
}
