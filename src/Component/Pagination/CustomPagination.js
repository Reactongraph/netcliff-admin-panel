import React from "react";

//pagination
import TablePagination from "react-js-pagination";

const CustomPagination = (props) => {
  return (
    <>
      {props.count > 0 ? (
        <div className="d-md-flex justify-content-end align-items-center">
          <div className="d-flex align-items-center">
            <span>Rows Per Page</span>
            <select
              className="mx-2 mb-2 mb-md-0 mb-lg-0 dropdown page_dropdown"
              value={props.rowsPerPage}
              onChange={(e) => {
                props?.onRowsPerPageChange(e);
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
              component="div"
              totalItemsCount={props?.count}
              activePage={props.page}
              pageRangeDisplayed={2}
              onChange={props?.onPageChange}
              itemsCountPerPage={props?.rowsPerPage}
              itemClass="page-item"
              linkClass="page-link"
            />
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default CustomPagination;
