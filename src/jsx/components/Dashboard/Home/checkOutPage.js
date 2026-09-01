import React, { Fragment, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./checkout.css";
import { setProductCode } from '../../../../store/actions/actions';
import { Link } from "react-router-dom";
import UserIcon from './userIcon.png';
import CheckoutForm from "../../../layouts/nav/checkoutForm";
import LoaderIcon from "./loading-gif.gif";
import "./styles/dash.css";

//** Import Image */
import profileImg from "../../../../images/avatar/1.jpg";
import { Dropdown } from "react-bootstrap";

import { ThemeContext } from "../../../../context/ThemeContext";





const DashboardDark = () => {
    const { changeBackground } = useContext(ThemeContext);	
    const [showLoader, setShowLoader ] = useState(false);
    const dispatch = useDispatch();
   
   
   
	useEffect(() => {
		changeBackground({ value: "dark", label: "Dark" });
	}, []);
   return (
      <Fragment>
         {/* <div className="row">
            <div className="col-xl-4 col-lg-4">
               <div className="card subscription">
                  <div className="card-header">
                  <h4 className="card-title">Choose Subscription</h4>
                  </div>
                  <div className="card-body">
                     <div className="row">
                  
                        <div className="pro-products col-md-12">
                        {membershipData!==null ?(membershipData.map((item) => (
                           <div className={`card ${productCode===item.product_code?"active":""}`} key={item.id} onClick={() => selectProductCode(item.product_code)}>
                              <div className="card-body">
                                 <h5 className="card-title">{item.product_name}</h5>
                                 <p className="card-text">{item.product_description}</p>
                                 <p className="card-text price">Price: ${item.product_price}</p>
                                 
                                 
                              </div>
                           </div>
                           ))):(<div className="facade"></div>)}
                        </div>
                     </div>
                  
                  </div>
               </div>
            </div>
            <div className="col-xl-8 col-lg-8 ov-form">
               <div className="card">
                  <div className="card-header">
                  <h4 className="card-title">Fill Checkout Form</h4>
                  </div>
                  <div className="card-body">
                     {productCode===""?(
                        <div className="facade">Choose Your Subscription</div>
                     ):(<CheckoutForm setShowLoader={setShowLoader} />)}
                  
                  </div>
               </div>
            </div>
         </div>
         {showLoader && (<div className="checkout-loader">
            <img src={LoaderIcon} alt="loader" />
         </div>)} */}
      </Fragment>
   );
};

export default DashboardDark;