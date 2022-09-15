import React from "react";
import styles from "assets/css/searchbarStyle.module.css";

export default function Serarchbar(props) {
  return (
    <div className={styles.search}>
      <i className={styles.fa_search + " fa fa-search"}></i>
      <input
        type="text"
        className="form-control"
        placeholder={props.searchbarPlaceHolder}
        onChange={props.onChange}
      />
    </div>
  );
}
