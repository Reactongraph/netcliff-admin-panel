import React from "react";
import $ from "jquery";
import logo from "../assets/images/logo.png";

//react-router-dom
import { NavLink, useHistory } from "react-router-dom";

//Alert
import Swal from "sweetalert2";

//Redux - Action
import { UNSET_ADMIN } from "../../store/Admin/admin.type";
import { useDispatch } from "react-redux";

// icon
import liveTv from "../assets/images/liveTv.png";
import dashBoard from "../assets/images/dashboard.png";
import User from "../assets/images/User.png";
import movie from "../assets/images/movie.png";
import webSires from "../assets/images/Web Series.png";
import genre from "../assets/images/Genre.png";
import region from "../assets/images/Region.png";
import plan from "../assets/images/plan.png";
import profile from "../assets/images/profile.png";
import setting from "../assets/images/setting.png";
import Advertisement from "../assets/images/AdvertiseMent.png";
import BannerImage from "../assets/images/banner.png";
import helpCenter from "../assets/images/HelpCenter.png";
import purchaseHistory from "../assets/images/PurchaseHistory.png";
import logOut from "../assets/images/logout.png";
import Ticket from "../assets/images/Ticket.png";
// import analytics from "../assets/images/analytics.png";
import { projectName } from "../../util/config";

const navStyle = {
  "&.active": {
    backgroundColor: " #4989F7",
    color: "#fff !important",
    fontWeight: 500,
    fontSize: 16,
  },
  "&.active i": {
    backgroundColor: " #4989F7",
    color: "#fff !important",
    fontWeight: 500,
  },
  "&.active i a span": {
    backgroundColor: " #4989F7",
    color: "#fff !important",
    fontWeight: 500,
  },
};

const handleClick = () => {
  $(".setting").toggleClass("active");
};

const handleRemove = () => {
  $(".setting").toggleClass("active");
};

const handleCollapse = () => {
  $("body").toggleClass("sidebar-main");
  $(".wrapper-menu").toggleClass("open");
};

const Sidebar = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const logout = () => {
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Log Out",
    })
      .then((result) => {
        if (result.isConfirmed) {
          dispatch({ type: UNSET_ADMIN });
          history.push("/login");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <div className="iq-sidebar">
        <div className="iq-sidebar-logo d-flex justify-content-between">
          <NavLink to="/admin/dashboard">
            <div className="iq-light-logo">
              {/* <div className="iq-light-logo">
                <img src="images/logo.gif" className="img-fluid" alt />
              </div> */}
              <div className="iq-dark-logo ml-3">
                <img src={logo} className="img-fluid" alt />
              </div>
            </div>

            {/* <span
              style={{ fontWeight: "600", fontSize: "30px", color: "#fff" }}
            >
              {projectName}
            </span> */}

          </NavLink>
          <div className="iq-menu-bt-sidebar">
            <div className="iq-menu-bt align-self-center">
              <div className="wrapper-menu">
                <div onClick={() => handleCollapse}>
                  <i className="ri-menu-3-line" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="sidebar-scrollbar">
          <div
            className="scroll-content"
          // style={{ transform: "translate3d(0px, -550px, 0px)" }}
          >
            <nav className="iq-sidebar-menu">
              <ul id="iq-sidebar-toggle" className="iq-menu">
                <li>
                  <NavLink to="/admin/dashboard" style={navStyle}>
                    <img src={dashBoard} width="25px" height="25px" />
                    <span className="pl-2">Dashboard</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/admin/user" style={navStyle}>
                    {/* className="iq-waves-effect"  */}
                    <img src={User} width="25px" height="25px" />
                    <span className="pl-2">User</span>
                  </NavLink>
                </li>

                {/* <li>
                  <NavLink to="/admin/movie" style={navStyle}>
                    <img src={movie} width="25px" height="25px" />
                    <span className="pl-2">Movie</span>
                  </NavLink>
                </li> */}
                <li>
                  <NavLink to="/admin/web_series" style={navStyle}>
                    <img src={webSires} width="25px" height="25px" />
                    <span className="pl-2">Web Series</span>
                  </NavLink>
                </li>
                
                {/* <li>
                  <NavLink to="/admin/live_tv" style={navStyle}>
                    <img src={liveTv} width="25px" height="25px" />
                    <span className="pl-2">Live TV</span>
                  </NavLink>
                </li> */}
                <li>
                  <NavLink to="/admin/widget" style={navStyle}>
                    <img src={BannerImage} width="25px" height="25px" />
                    <span className="pl-2">Home Widgets</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/admin/banners" style={navStyle}>
                    <img src={BannerImage} width="25px" height="25px" />
                    <span className="pl-2">Banners</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/admin/region" style={navStyle}>
                    <img src={region} width="25px" height="25px" />
                    <span className="pl-2">Country</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/admin/badges" style={navStyle}>
                    <img src={genre} width="25px" height="25px" />
                    <span className="pl-2">Badges</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/admin/genre" style={navStyle}>
                    <img src={genre} width="25px" height="25px" />
                    <span className="pl-2">Genre</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/admin/tags" style={navStyle}>
                    <img src={genre} width="25px" height="25px" />
                    <span className="pl-2">Tags</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/admin/premium_plan" style={navStyle}>
                    {" "}
                    <img src={plan} width="25px" height="25px" />
                    <span className="pl-2">Purchase Plan</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/admin/payment_screen" style={navStyle}>
                    {" "}
                    <img src={BannerImage} width="25px" height="25px" />
                    <span className="pl-2">Payment Screen</span>
                  </NavLink>
                </li>
                
                <li>
                  <NavLink to="/admin/premium_plan_history" style={navStyle}>
                    <img src={purchaseHistory} width="25px" height="25px" />
                    <span className="pl-2">Purchase Plan History</span>
                  </NavLink>
                </li>
                {/* <li>
                  <NavLink to="/admin/advertisement" style={navStyle}>
                    <img src={Advertisement} width="25px" height="25px" />
                    <span className="pl-2">Advertisement</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/admin/adbanner" style={navStyle}>
                    <img src={BannerImage} width="25px" height="25px" />
                    <span className="pl-2">Ad Banner</span>
                  </NavLink>
                </li> */}
                <li>
                  <NavLink to="/admin/platform-analytics" style={navStyle}>
                  <i className="ri-pie-chart-line" style={{ fontSize: "22px", color: "grey" }} />
                  <span className="pl-2">Analytics</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/admin/raisedTicket" style={navStyle}>
                    <img src={Ticket} width="25px" height="25px" />
                    <span className="pl-2">Raised Tickets</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/admin/help_center/faq" style={navStyle}>
                    <img src={helpCenter} width="25px" height="25px" />
                    <span className="pl-2">Help Center</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/admin/user-recommendations" style={navStyle}>
                    <img src={helpCenter} width="25px" height="25px" />
                    <span className="pl-2">User Recommendations</span>
                  </NavLink>
                </li>
                
                <li>
                  <NavLink to="/admin/landing-page/subscription-hero" style={navStyle}>
                    <img src={BannerImage} width="25px" height="25px" />
                    <span className="pl-2">Subscription Hero</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/admin/brand-integration" style={navStyle}>
                    <img src={Advertisement} width="25px" height="25px" />
                    <span className="pl-2">Brand Integration</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/admin/setting" style={navStyle}>
                    <img src={setting} width="25px" height="25px" />
                    <span className="pl-2">Setting</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/admin/profile/admin_info"
                    style={navStyle}
                    onClick={handleRemove}
                  >
                    <img src={profile} width="25px" height="25px" />
                    <span className="pl-2">Profile</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/login" style={navStyle} onClick={logout}>
                    {" "}
                    <img src={logOut} width="25px" height="25px" />
                    <span className="pl-2">Log Out</span>
                  </NavLink>
                </li>
              </ul>
            </nav>
          </div>
          <div
            className="scrollbar-track scrollbar-track-x"
            // style={{ display: "none" }}
            style={{ display: "block" }}
          >
            <div
              className="scrollbar-thumb scrollbar-thumb-x"
              style={{
                width: "260px",
                transform: "translate3d(0px, 0px, 0px)",
              }}
            ></div>
          </div>
          <div
            className="scrollbar-track scrollbar-track-y"
            // style={{ display: "block" }}
            style={{ display: "none" }}
          >
            <div
              className="scrollbar-thumb scrollbar-thumb-y"
              style={{
                height: "235.982px",
                transform: "translate3d(0px, 0px, 0px)",
              }}
            ></div>
          </div>

          <div className="p-3" />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
