import React from "react";

//pagination
import TablePagination from "react-js-pagination";

const Pagination = (props) => {
  const handlePage = (page) => {
    props.handlePageChange(page);
  };
  const handleRowsPerPage = (value) => {
    props.handleRowsPerPage(value);
  };

  return (
    <>
      {props.userTotal ? (
        <div className="d-md-flex justify-content-end align-items-center">
          <div className="d-flex align-items-center">
            <span>Rows Per Page</span>
            <select
              className="mx-2 mb-2 mb-md-0 mb-lg-0 dropdown page_dropdown"
              value={props.rowsPerPage}
              onChange={(e) => {
                handleRowsPerPage(e.target.value);
              }}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="200">200</option>
              <option value="500">500</option>
              <option value="1000">1000</option>
              <option value="5000">5000</option>
            </select>
          </div>
          <div className="align-middle">
            <TablePagination
              activePage={props.activePage}
              itemsCountPerPage={props.rowsPerPage}
              totalItemsCount={props.userTotal}
              pageRangeDisplayed={2}
              onChange={(page) => handlePage(page)}
              itemClass="page-item"
              linkClass="page-link"
            />
          </div>
        </div>
      ) : <></>}
    </>
  );
};

export default Pagination;
