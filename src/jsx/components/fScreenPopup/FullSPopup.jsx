import React from 'react';
import { useLocation } from 'react-router-dom';
import { ReactComponent as CloseIcon } from "../../../images/Login/close.svg";
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { loginFailedAction } from '../../../store/actions/AuthActions';
import "./fScreenPopup.css?ver0.91";
import { useDispatch } from 'react-redux';

const FullSPopup = ({ popupActive, setPopupActive, popupData, handleActivate }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  if (!popupActive) return null;

  const handleClose = () => {
    setPopupActive(false);
    dispatch(loginFailedAction(""));
  };

  return (
    <div className="fSPopup" onClick={handleClose}>
      <div className="PopupInner" onClick={e => e.stopPropagation()}>
        {location.pathname == "/resetpassword"||"/page-forgot-password"?(<></>):(
          <>
          <div
          className="closeButton"
          onClick={handleClose}
          aria-label="Close popup"
        >
          <CloseIcon />
        </div>
          </>
        )}
        

        <div className="popuprow">
          <div className="icon">
            <svg width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.791 18.084H14.2077V11.6257H16.791M16.791 23.2507H14.2077V20.6673H16.791M1.29102 27.1257H29.7077L15.4993 2.58398L1.29102 27.1257Z" fill="url(#paint0_linear_2698_4653)"/>
                <defs>
                <linearGradient id="paint0_linear_2698_4653" x1="15.4993" y1="2.58398" x2="15.4993" y2="27.1257" gradientUnits="userSpaceOnUse">
                <stop stop-color="#9141AF"/>
                <stop offset="1" stop-color="#431C9F"/>
                </linearGradient>
                </defs>
            </svg>

          </div>

          <div className="textCol">
            <h2 className="MainHeading">{popupData.MainHeading}</h2>
            <p className="paraText">{popupData.Description}</p>
          </div>
        </div>

        <div className="popupButtonRow">
          {popupData.strokeBtn=="Activate Account"?(
            <>
            {popupData.strokeBtn && (
              <button
                className="strokeButton"
                onClick={() => {handleActivate();handleClose()}}
              >
                {popupData.strokeBtn}
              </button>
            )}
            </>
            ):(
            <>
                 
              <button
                className="strokeButton"
                onClick={() => {navigate("/login");
                  handleClose()
                }}
              >
                {popupData.strokeBtn}
              </button>
            </>
          )}
          {/* <button className="filledButton" onClick={handleClose}>
            {popupData.filledBtn || 'Cancel'}
          </button> */}
        </div>
      </div>
    </div>
  );
};

FullSPopup.propTypes = {
  popupActive: PropTypes.bool.isRequired,
  setPopupActive: PropTypes.func.isRequired,
  popupData: PropTypes.shape({
    MainHeading: PropTypes.string,
    Description: PropTypes.string,
    strokeBtn: PropTypes.string,
    filledBtn: PropTypes.string,
    onStrokeClick: PropTypes.func,
  }),
};

FullSPopup.defaultProps = {
  popupData: {},
};

export default FullSPopup;
