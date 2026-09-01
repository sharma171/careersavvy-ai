import React from 'react';

const CsavvyPageLoad = ({loaderText}) => {
    return (
        <>
        <div className={`CSavvyLoaderBg ${loaderText=="Getting Job Details"?"bgBlur":""}`}>
            <div className="cSavvyLogo">
                <div className="loaderInfo">
                    <svg width="40" height="40" viewBox="0 0 40 40" className="CSavvySpinner" xmlns="http://www.w3.org/2000/svg" fill="#6024c2">
                        <g transform="translate(20,20)">
                            <g transform="rotate(0)">
                            <rect x="-2" y="-16" width="4" height="9" rx="2" fill="#6024c2" opacity="0.1"/>
                            </g>
                            <g transform="rotate(45)">
                            <rect x="-2" y="-16" width="4" height="9" rx="2" fill="#6024c2" opacity="0.2"/>
                            </g>
                            <g transform="rotate(90)">
                            <rect x="-2" y="-16" width="4" height="9" rx="2" fill="#6024c2" opacity="0.3"/>
                            </g>
                            <g transform="rotate(135)">
                            <rect x="-2" y="-16" width="4" height="9" rx="2" fill="#6024c2" opacity="0.4"/>
                            </g>
                            <g transform="rotate(180)">
                            <rect x="-2" y="-16" width="4" height="9" rx="2" fill="#6024c2" opacity="0.5"/>
                            </g>
                            <g transform="rotate(225)">
                            <rect x="-2" y="-16" width="4" height="9" rx="2" fill="#6024c2" opacity="0.6"/>
                            </g>
                            <g transform="rotate(270)">
                            <rect x="-2" y="-16" width="4" height="9" rx="2" fill="#6024c2" opacity="0.8"/>
                            </g>
                            <g transform="rotate(315)">
                            <rect x="-2" y="-16" width="4" height="9" rx="2" fill="#6024c2" opacity="1"/>
                            </g>
                        </g>
                    </svg>
                    <div className="text">{loaderText}</div>
                </div>
                <div className="outerbar"><div className="innerbar"></div></div>
            </div>
        </div>
        </>
    );
}

export default CsavvyPageLoad;
