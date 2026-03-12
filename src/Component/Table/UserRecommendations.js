import React, { useState } from "react";
import { connect } from "react-redux";
import { apiInstanceFetch } from "../../util/api";
import Search from "../assets/images/search.png";

const UserRecommendations = (props) => {
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!searchText.trim()) {
      setError("Please provide a search text (User ID, Phone Number, or Email)");
      return;
    }

    setLoading(true);
    setError("");
    setRecommendations([]);
    setUserInfo(null);

    try {
      const data = await apiInstanceFetch.post("recommendation/admin/user-recommendations", {
        searchText: searchText.trim(),
        count: 20
      });

      if (data.status) {
        setUserInfo(data.user);
        setRecommendations(data.recommendations || []);
        if (data.fallback) {
          setError("No personalized recommendations found for this user");
        }
      } else {
        setError(data.message || "Failed to get recommendations");
      }
    } catch (err) {
      setError("Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchText("");
    setRecommendations([]);
    setUserInfo(null);
    setError("");
  };

  return (
    <>
      <div id="content-page" className="content-page">
        <div className="container-fluid">
          <div className="header_heading p_zero">
            <h3>User Recommendations</h3>
            <div className="header_heading_right_col">
              <form className="position-relative">
                <div className="form-group mb-0 d-flex mr-3 position-relative">
                  {/* <img
                    src={Search}
                    width="23px"
                    height="23px"
                    className="search_icon"
                  /> */}
                  <input
                    type="search"
                    className="form-control"
                    placeholder="Enter user ID, email, or phone number"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                </div>
              </form>

              <button
                type="button"
                className="btn dark-icon btn-primary"
                onClick={handleSearch}
                disabled={loading}
              >
                <i className="ri-search-line align-bottom me-1 fs-6"></i> 
                {loading ? "Searching..." : "Search"}
              </button>
            </div>
          </div>

          <div className="iq-card mb-5">
            <div className="iq-card-body">

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              {userInfo && (
                <div className="user-info-card mb-4 p-3" style={{background: "#f8f9fa", borderRadius: "8px"}}>
                  <div className="row mt-2">
                    <div className="col-md-3">
                      <strong>ID:</strong> {userInfo._id}
                    </div>
                    <div className="col-md-3">
                      <strong>Name:</strong> {userInfo.fullName || "N/A"}
                    </div>
                    <div className="col-md-3">
                      <strong>Email:</strong> {userInfo.email || "N/A"}
                    </div>
                    <div className="col-md-3">
                      <strong>Phone:</strong> {userInfo.phoneNumber || "N/A"}
                    </div>
                  </div>
                </div>
              )}

              {recommendations.length > 0 && (
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5>Recommendations ({recommendations.length})</h5>
                    <button className="btn btn-secondary btn-sm" onClick={clearSearch}>
                      Clear
                    </button>
                  </div>
                  <div className="row">
                    {recommendations.map((movie) => (
                      <div key={movie._id} className="col-lg-2 col-md-3 col-sm-4 col-6 mb-3">
                        <div className="card h-100">
                          <img
                            src={movie.thumbnail || movie.image || "/placeholder.jpg"}
                            alt={movie.title}
                            className="card-img-top"
                            style={{ height: "200px", objectFit: "cover", borderRadius:5 }}
                            onError={(e) => {
                              e.target.src = "/placeholder.jpg";
                            }}
                          />
                          <div className="card-body pt-2 px-0">
                            <p className=" text-truncate" title={movie.title}>
                              {movie.title}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(null, null)(UserRecommendations);