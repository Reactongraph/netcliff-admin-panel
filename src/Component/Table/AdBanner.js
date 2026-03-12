import React, { useState, useEffect } from "react";
import noImage from "../assets/images/moviePlaceHolder.png";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { connect } from "react-redux";
import { useDispatch } from "react-redux";
import { warning } from "../../util/Alert";
import Search from "../assets/images/search.png";
import arraySort from "array-sort";
import { Toast } from "../../util/Toast_";
import { handleImageError } from "../../util/helperFunctions";
import {
  changeAdBannerStatus,
  deleteBanner,
  getAdBanners,
} from "../../store/AdBanner/adBanner.action";
import { Switch } from "@mui/material";

const AdBanner = (props) => {
  const { loader } = useSelector((state) => state.loader);

  //Define History
  const history = useHistory();
  const dispatch = useDispatch();

  const [data, setData] = useState([]);

  const [titleSort, setTitleSort] = useState(true);
  const [setSearch] = useState("");

  const { adBanners } = useSelector((state) => state.adBanner);

  useEffect(() => {
    dispatch(getAdBanners());
  }, [dispatch]);

  useEffect(() => {
    setData(adBanners);
  }, [adBanners]);

  const insertOpen = () => {
    history.push("/admin/adbanner/create");
  };

  const handleSearch = (e) => {
    setSearch(e);
  };

  const deleteOpen = (bannerId) => {
    const data = warning();
    data
      .then((result) => {
        if (result.isConfirmed) {
          props.deleteBanner(bannerId);
          Toast("success", "Banner deleted successfully.");
        }
      })
      .catch((err) => console.log(err));
  };
  const handleTitleSort = () => {
    setTitleSort(!titleSort);
    arraySort(data, "title", { reverse: titleSort });
  };

  const handleChangeStatus = (bannerId) => {
    props.changeAdBannerStatus(bannerId);
  };

  return (
    <>
      <div id="content-page" className="content-page">
        <div className="container-fluid">
          <div className="header_heading p_zero">
            <h3>Banner</h3>
            <div className="header_heading_right_col">
              <form class="position-relative">
                <div class="form-group mb-0 d-flex position-relative">
                  {" "}
                  <img
                    src={Search || noImage}
                    width="23px"
                    height="23px"
                    className="search_icon"
                    onError={(e) => handleImageError(e, noImage)}
                  />
                  <input
                    type="search"
                    class="form-control"
                    id="input-search"
                    placeholder="Search"
                    aria-controls="user-list-table"
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
              </form>
              <button
                type="button"
                class="btn dark-icon btn-primary"
                id="create-btn"
                data-bs-target="#showModal"
                onClick={insertOpen}
              >
                <i class="ri-add-line align-bottom me-1 fs-6"></i> Add
              </button>
            </div>
          </div>

          <div className="iq-card mb-5">
            <div className="iq-card-body">
              <div className="table-responsive">
                <table
                  id="user-list-table"
                  className="table table-striped table-borderless custom_table"
                  role="grid"
                  aria-describedby="user-list-page-info"
                >
                  <thead class="text-nowrap">
                    <tr>
                      <th className="tableAlign">ID</th>
                      <th className="tableAlign">Image</th>
                      <th
                        className="tableAlign"
                        onClick={handleTitleSort}
                        style={{ cursor: "pointer" }}
                      >
                        Title {titleSort ? " ▼" : " ▲"}
                      </th>
                      <th className="tableAlign">Content Type</th>
                      <th className="tableAlign">Content</th>
                      <th className="tableAlign">Show</th>
                      <th className="tableAlign">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.length > 0
                      ? data.map((data, index) => {
                          return (
                            <React.Fragment key={index}>
                              <tr>
                                <td className="pr-3 tableAlign">{index + 1}</td>
                                <td className="pr-3">
                                  <img
                                    className="img-fluid"
                                    style={{
                                      height: "100px",
                                      width: "80px",
                                      boxShadow:
                                        "0 5px 15px 0 rgb(105 103 103 / 0%)",
                                      border:
                                        "0.5px solid rgba(255, 255, 255, 0.20)",
                                      objectFit: "cover",
                                    }}
                                    src={data?.image ? data?.image : noImage}
                                    alt=""
                                    onError={(e) =>
                                      handleImageError(e, noImage)
                                    }
                                  />
                                </td>

                                <td className="text-start text-capitalize text-center">
                                  {data?.title || "_"}
                                </td>

                                <td className="text-start text-capitalize text-center">
                                  {data.contentType === "movie"
                                    ? "Movie"
                                    : data.contentType === "web-series"
                                    ? "Web Series"
                                    : "TV Channel"}
                                </td>
                                <td className="pr-3 tableAlign">
                                  {data?.contentName || "_"}
                                </td>
                                <td className="text-center">
                                  <Switch
                                    checked={data?.isShow}
                                    onChange={(e) =>
                                      handleChangeStatus(data?._id)
                                    }
                                    color="primary"
                                    name="checkedB"
                                    inputProps={{
                                      "aria-label": "primary checkbox",
                                    }}
                                  />
                                </td>
                                <td className="pr-3 tableAlign">
                                  <button
                                    type="button"
                                    className="btn iq-bg-primary btn-sm"
                                    onClick={() => deleteOpen(data._id)}
                                  >
                                    <i
                                      class="ri-delete-bin-6-line"
                                      style={{ fontSize: "19px" }}
                                    ></i>
                                  </button>
                                </td>
                              </tr>
                            </React.Fragment>
                          );
                        })
                      : loader === false &&
                        data?.length < 0 && (
                          <tr>
                            <td colSpan="12" className="text-center">
                              No data Found!!
                            </td>
                          </tr>
                        )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(null, {
  deleteBanner,
  changeAdBannerStatus,
})(AdBanner);
