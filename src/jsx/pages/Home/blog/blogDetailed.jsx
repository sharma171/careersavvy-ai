import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom'; 
import CareerSavvyLogo from "../../../../images/site_logo.svg";
import {setHomeLink} from "../../../../store/actions/actions";
import {useSelector,useDispatch} from "react-redux";
import "../style.css";
import {ReactComponent as MenuIcon} from "../icons & images/menuIcon.svg";
import {ReactComponent as SearchIcon} from "../icons & images/searchIcon.svg";
import {ReactComponent as DropDown} from "../icons & images/siteDropdown.svg";
import "./style.css";
import "../siiteHeader.css";
import "../responsiveStyle.css";
import PostImage1 from "./images/postImage1.png";
import CareerImage from "../icons & images/careerSavvy-wide.svg";
const Blog = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [detailedPosts, setDetailedPosts] = useState([]);
    const [relatedPosts, setRelatedPosts] = useState([]);
    const dispatch = useDispatch();
    const [footerPage, setFooterPage] = useState('');
    function SignUpPage() {
        navigate("/login");
    }
     // ✅ Extract slug from the URL
     const queryParams = new URLSearchParams(location.search);
     const slug = queryParams.get("slug"); 
    useEffect(()=>{
        getRelatedPosts();
        getDetailedPosts()
    },[slug]);
    
    function navigateDetailed(url){
        console.log(url);
        
        navigate(url);
    }
    function HomePage(){
        navigate('/')
    }
    const getRelatedPosts = async () => {
        try {
            const response = await fetch("https://blog-post-response-streaming-v2-980069659423.us-east1.run.app", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    "operation": "get", 
                    "slug": slug, 
                    "include_related": true
                }),
            });
            if (response.ok) {
                const data = await response.json();
                setRelatedPosts(data.related_posts);
                console.log("relatedPosts",relatedPosts);
            } else {
                console.error("Error fetching feedback", await response.text());
                alert("Failed to get feedback. Please try again later.");
            }
        } catch (error) {
            console.error("Network error:", error);
            alert("Network error while fetching feedback. Please check your connection.");
        } finally {
        }
    };
    const getDetailedPosts = async () => {
        try {
            const response = await fetch("https://blog-post-response-streaming-v2-980069659423.us-east1.run.app", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    "operation": "get", 
                    "slug": slug
                }),
            });
            if (response.ok) {
                const data = await response.json();
                setDetailedPosts(data.post);
                console.log("detailedPosts",detailedPosts);
                
            } else {
                console.error("Error fetching feedback", await response.text());
                alert("Failed to get feedback. Please try again later.");
            }
        } catch (error) {
            console.error("Network error:", error);
            alert("Network error while fetching feedback. Please check your connection.");
        } finally {
        }
    };
    
        const [isScrolled, setIsScrolled] = useState(false);
    
        useEffect(() => {
            const handleScroll = () => {
                setIsScrolled(window.scrollY > 0);
            };
    
            window.addEventListener('scroll', handleScroll);
            return () => window.removeEventListener('scroll', handleScroll);
        }, []);
    
        const [menuOpen, setMenuOpen] = useState(false);
        function togglemenu(){
            setMenuOpen(!menuOpen);
        }


            const scrollToElement = (id) => {
            setTimeout(() => {
                const section = document.getElementById(id);
                if (section) {
                section.scrollIntoView({ behavior: "smooth" });
                }
            }, 100); // give time for the page to render
            };
        
            const handleNavWithScroll = (id) => {
            if (location.pathname !== "/") {
                navigate("/");
                // useEffect will handle scroll after route change
                setTimeout(() => scrollToElement(id), 200);
            } else {
                scrollToElement(id);
            }
            };
    return (
        <>
            <div className="home-page">
                {/* <div className=" blogHeader mainHeader d-flex align-items-center justify-content-between p-3">
                    <div className="d-flex align-items-center" onClick={HomePage}>
                        <img
                            src={CareerSavvyLogo}

                            alt="Career Savvy Logo"
                            className="rounded-circle logo"
                        />
                        <h5 className="m-0">Career Savvy</h5>
                    </div>
                    <div className="nav-menu Hnav-menu">
                        <ul className="d-flex align-items-center m-0 p-0">
                            <li className="nav-item">
                                <a href="/blog" className="nav-link">Explore Our Journals</a>
                            </li>
                        </ul>
                    </div>
                    <button className="btn btn-primary rounded-pill subcribe-button" onClick={SignUpPage}>
                        <span className="text">Get Started</span><svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.08936 0.419117L16.105 8.43474L8.08936 16.4504L6.68311 15.0441L12.2612 9.41912L0.0737309 9.41912V7.45037L12.2612 7.45037L6.68311 1.82537L8.08936 0.419117Z" fill="#221EA9" />
                        </svg>

                    </button>
                </div> */}
                <div className={`SiteHeader ${isScrolled ? 'active' : ''}`}>
                    <div className="siteHeaderWrapper">
                        <div className="siteHeaderRow">
                            <div className="leftMenu row-flex innerSpacing">
                                <div className="navMenuIcon" onClick={togglemenu}>
                                    <MenuIcon/>
                                </div>
                                {/**
                                <div className="navMenuIcon hideSearch">
                                    <SearchIcon/>
                                </div>
                                    */}
                                {menuOpen&&(<>
                                    <div className="positionList">
                                        <ul className="navMenu">
                                            <li className="navItems" onClick={()=>{navigate("/")}}>Home <DropDown/></li>
                                            
                                            <li className="navItems" onClick={() => {dispatch(setHomeLink("features"));navigate("/")}}>
                                                Key Features <DropDown/>
                                            </li>
                                            <li className="navItems" onClick={()=>navigate("/blog")}>Explore Our Journals<DropDown/></li>
                                            {/* <li className="navItems" onClick={() => {
                                                const section = document.getElementById("faqs");
                                                if (section) {
                                                section.scrollIntoView({ behavior: "smooth" });
                                                }
                                            }}>FAQ'S<DropDown/></li> */}
                                            <li className="navItems" onClick={() => handleNavWithScroll("faqs")}>
                                                FAQ's <DropDown/>
                                            </li>
                                        </ul>
                                    </div>
                                </>)}
                            </div>
                            <div className="centerMenu row-flex innerSpacing">
                                <ul className="navMenu">
                                    <li className="navItems" onClick={()=>navigate("/")}>Home <DropDown/></li>
                                    <li className="navItems" 
                                        onClick={() => {dispatch(setHomeLink("features"));navigate("/")}}>Key Features <DropDown/></li>
                                </ul>
                                <div className="logoIcon">
                                    <img
                                        src={CareerSavvyLogo}

                                        alt="CareerSavvy Logo"
                                        className="Site-Rounded-Logo"
                                    />
                                </div>
                                <ul className="navMenu">
                                    <li className="navItems" onClick={()=>navigate("/blog")}>Explore Our Journals<DropDown/></li>
                                    <li className="navItems" onClick={() => {dispatch(setHomeLink("faqs"));navigate("/")}}>FAQ'S<DropDown/></li>
                                </ul>
                            </div>
                            <div className="rightMenu row-flex innerSpacing">
                                <button className="contactButton" onClick={()=>navigate("/login")}>Log In <span className='separateSymbol'>|</span> Create Account</button>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="blogHome">
                    <div className="container">
                        <div className="row relatedRow">
                            <div className="col-md-9">
                                <div className="jobDetailed">
                                     <div className="Dinfo">
                                        <div className="tags">
                                        <span className="topic" onClick={()=>{navigate("/blog")}}>{`<`}</span>
                                            {detailedPosts?.tags?.map((item)=>(
                                                <>
                                                <span className="topic"># {item}</span>
                                                </>
                                            ))}
                                        </div>
                                        <h1 className="dHead">{detailedPosts?.title}</h1>
                                        <div className="info">
                                            <span className="author">{detailedPosts?.author.replace(" ","")}</span>
                                            <div className="dot"></div>
                                            <span className="date">{`created : ${new Date(detailedPosts.created_at).toLocaleDateString()}`}</span><div className="dot"></div><span>{`Updated : ${new Date(detailedPosts.updated_at).toLocaleDateString()}`}</span>
                                        </div>   
                                     </div>
                                     <div className="thumb">
                                        <img src={detailedPosts?.featured_image || PostImage1} alt={detailedPosts?.title?(detailedPosts?.title):"Image"} className="image" />
                                    </div>
                                    <div className="blog-content">
                                    {detailedPosts?.content?.map((block, index) => {
                                        if (block.type === "paragraph") {
                                            return <p key={index} className="para">{block.content}</p>;
                                        }
                                        if (block.type === "heading") {
                                            const Tag = `h${block.level || 2}`;
                                            return <Tag key={index} className="blog-heading">{block.content}</Tag>;
                                        }
                                        if (block.type === "list") {
                                            return (
                                                <ul key={index} className="blog-list">
                                                    {block.items.map((item, i) => <li key={i}>{item}</li>)}
                                                </ul>
                                            );
                                        }
                                        return null;
                                    })}
                                </div>
                                </div>
                            </div>
                            <div className="col-md-3 related">
                            <div className="blogList">
                            <div className="TopHead">
                                <h3 className='CHead'>Latest Posts</h3>
                                
                            </div>
                            <div className="postGrid">
                                {relatedPosts?.map((post) => (
                                <div 
                                    key={post.id}  // ✅ Added key prop
                                    className="postItem"
                                    onClick={() => navigateDetailed(`/blogDetailed?slug=${post.slug}`)}  // ✅ Fixed URL format
                                >
                                    <img src={post.featured_image ||PostImage1 } alt="Image" className="thumb" /> 
                                    <div className="postInfo">
                                    <span className="topic">{post.tags?.[0] || "Technology"}</span>
                                    <h1 className="CHead">{post.title}</h1>
                                    <div className="info">
                                        <span className="author">{post.author}</span>
                                        <div className="dot"></div>
                                        <span className="date">{new Date(post.created_at).toLocaleDateString()}</span>
                                    </div>
                                    </div>
                                </div>
                                ))}
                                    
                                </div>
                            </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
                <div className="footer">
                    <div className="container">
                        <div className="footer-col col-flex">
                            <div className="row-flex bottom-footer">
                                <img src={CareerImage} alt="CareerSavvy" className='logo' />
                                <div className='row-flex'>
                                    <span className="text" onClick={() => { setFooterPage('terms&Conditions'); }}>
                                        Terms and Conditions
                                    </span>
                                    <span className="text" onClick={() => { setFooterPage('privacypolicy'); }}>
                                        Privacy & Policy
                                    </span>
                                </div>
                                <div className='row-flex'>
                                    <ul className="social-icons mt-4" style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        gap: "10px"
                                    }}>
                                        <li><Link to={"https://www.facebook.com/share/p/18Gv5rt2Lv/?mibextid=WC7FNe"} target='blank'><i className="fab fa-facebook-f"
                                            style={{
                                                padding: "4px",
                                                border: "1px solid",
                                                borderRadius: "3px",
                                                width: "26px",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignContent: "center",
                                                margin: "0 10px"
                                            }}></i></Link></li>
                                        {/* <li><Link to={"#"}><i className="fab fa-twitter"></i></Link></li> */}
                                        <li><Link to={"https://www.linkedin.com/company/career-savvy-ai/"} target='blank'><i className="fab fa-linkedin-in"
                                            style={{
                                                padding: "4px",
                                                border: "1px solid",
                                                borderRadius: "3px",
                                                width: "26px",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignContent: "center",
                                                margin: "0 10px"
                                            }}></i></Link></li>
                                        <li>
                                            <Link to={"https://www.instagram.com/p/DDYRi7XxGgv/?igsh=bHlla2s1cGwzdHo0"} target='blank'>
                                                <i className="fab fa-instagram"
                                                    style={{
                                                        padding: "4px",
                                                        border: "1px solid",
                                                        borderRadius: "3px",
                                                        width: "26px",
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignContent: "center",
                                                        margin: "0 10px"
                                                    }}></i>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to={"https://www.youtube.com/watch?v=Nkl5TiWo6Bs"} target='blank'>
                                                <i className="fab fa-youtube"
                                                    style={{
                                                        padding: "4px",
                                                        border: "1px solid",
                                                        borderRadius: "3px",
                                                        width: "26px",
                                                        height: "26px",
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center", // Corrected `alignContent` to `alignItems` for better centering
                                                        margin: "0 10px"
                                                    }}></i>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="footer-col col-flex">
                            <div className="row-flex bottom-footer">
                                <div></div>
                                Copyright © Designed & Developed by TB Soft Solutions LLC 2024
                                <div></div>
                            </div>
                        </div>
                    </div>
                </div>
                {footerPage !== '' && (
                    <div className="footer-Pages">
                        <div className='close' onClick={() => { setFooterPage('') }}>+</div>
                        <div className="container">
                            <div className="col-flex">
                                {footerPage == 'terms&Conditions' ? (
                                    <>
                                        <h3>Terms & Conditions Of Our Portal</h3>
                                        <p>
                                            Welcome to Our Portal! These Terms and Conditions outline the rules and
                                            regulations for your use of our website and services. By accessing or using our site,
                                            you agree to comply with these terms.
                                        </p>
                                        <h5>1. Acceptance of Terms</h5>
                                        <p>
                                            By using our website, you confirm that you accept these Terms and Conditions and
                                            agree to abide by them. If you do not agree with any part of these terms, you must
                                            not use our site.
                                        </p>
                                        <h5>2. Use of Our Services</h5>
                                        <p>
                                            You agree to use our services for lawful purposes only and in a way that does not
                                            infringe on the rights of others or restrict their use and enjoyment of our services.
                                        </p>
                                        <h5>3. Account Responsibilities</h5>
                                        <p>
                                            If you create an account on our site, you are responsible for maintaining the
                                            confidentiality of your account details and for all activities that occur under your
                                            account. You agree to notify us immediately of any unauthorized use of your
                                            account.
                                        </p>
                                        <h5>4. Intellectual Property</h5>
                                        <p>
                                            All content on our website, including text, graphics, logos, and software, is the
                                            property of Our Portal or our licensors and is protected by copyright and other
                                            intellectual property laws. You may not reproduce, distribute, or create derivative
                                            works without our written consent.
                                        </p>
                                        <h5>5. Limitation of Liability</h5>
                                        <p>
                                            To the fullest extent permitted by law, Our Portal shall not be liable for any
                                            indirect, incidental, or consequential damages arising from your use of our site or
                                            services.
                                        </p>
                                        <h5>6. Changes to Terms</h5>
                                        <p>
                                            We reserve the right to modify these Terms and Conditions at any time. Any
                                            changes will be effective immediately upon posting the revised terms on our
                                            website.
                                        </p>
                                        <h5>7. Contact Information</h5>
                                        <p>
                                            If you have any questions about these Terms and Conditions, please contact us at
                                            support@yolojobs.com.
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <h3>Privacy Policy Of Our Portal</h3>
                                        <p>
                                            At Our Portal, we are committed to protecting your privacy. This Privacy Policy
                                            outlines how we collect, use, and protect your information when you use our
                                            website and services.
                                        </p>
                                        <h5>1. Information We Collect</h5>
                                        <p>
                                            • Personal Information: When you register, apply for jobs, or contact us, we may
                                            collect personal information such as your name, email address, phone number, and
                                            resume.
                                            • Usage Data: We collect information about how you interact with our site,
                                            including your IP address, browser type, jobs applied, and pages visited.
                                        </p>
                                        <h5>2. How We Use Your Information</h5>
                                        <p>
                                            • Job Applications: To facilitate job applications and build connections.
                                            • Job Matching: To connect you with job opportunities that align with your skills
                                            and preferences.
                                            • Application Processing: To facilitate your job applications and communicate
                                            with vendors on your behalf.
                                            • Communication: To send you updates, career roadmaps, and respond to inquiries.
                                            • Improvement of Services: To analyze usage patterns and improve our services and
                                            user experience.
                                        </p>
                                        <h5>3. Sharing Your Information</h5>
                                        <p>
                                            • With Vendors: We may share your information with potential vendors who are
                                            hiring for job openings you apply for.
                                            • Service Providers: We may use third-party services to help operate our website
                                            and services, who may have access to your data under strict confidentiality agreements.
                                        </p>
                                        <h5>4. Data Security</h5>
                                        <p>
                                            We implement a variety of security measures to protect your personal information
                                            from unauthorized access, disclosure, alteration, or destruction. However, please be
                                            aware that no method of transmission over the internet is 100% secure.
                                        </p>
                                        <h5>5. Third-Party Links</h5>
                                        <p>
                                            Our site may contain links to third-party websites. We are not responsible for their
                                            content or privacy practices.
                                        </p>
                                        <h5>6. ChatGPT</h5>
                                        <p>
                                            We may utilize AI technologies, including ChatGPT, to provide support and answer
                                            inquiries. Please note that while we strive for accuracy, we are not responsible for
                                            any inaccuracies or misunderstandings that may arise from the use of these AI tools.
                                        </p>
                                        <h5>7. Your Rights</h5>
                                        <p>
                                            You have the right to:
                                            • Access your personal information.
                                            • Request correction of inaccurate information.
                                            • Request deletion of your personal information.
                                            • Choose not to receive marketing communications.
                                        </p>
                                        <h5>8. Cookies</h5>
                                        <p>
                                            Our website uses cookies to enhance your experience. You can choose to accept or
                                            decline cookies through your browser settings.
                                        </p>
                                        <h5>9. Changes to This Privacy Policy</h5>
                                        <p>
                                            We may update this Privacy Policy from time to time. We will notify you of any
                                            changes by posting the new policy on our website with a new effective date.
                                        </p>
                                        <h5>10. Contact Us</h5>
                                        <p>
                                            If you have any questions about this Privacy Policy, please contact us at
                                            support@yolojobs.com.
                                        </p>
                                    </>
                                )}

                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default Blog;
