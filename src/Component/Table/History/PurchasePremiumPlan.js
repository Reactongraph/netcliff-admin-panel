import moment from "moment";
import React from "react";
import { useSelector } from "react-redux";

const PurchasePremiumPlan = (props) => {
  const { loader } = useSelector((state) => state.loader);

  return (
    // <div className="iq-card-body">
    <div className="table-responsive">
      <table
        id="user-list-table"
        className="table table-striped table-borderless custom_table"
        role="grid"
        aria-describedby="user-list-page-info"
      >
        <thead class="text-nowrap">
          <tr>
            <th className="text-center">No.</th>
            <th className="text-center">User Name</th>
            <th className="text-center">Price</th>
            <th className="text-center">Validity</th>
            <th className="text-center">Validity Type</th>
            <th className="text-center">Payment Gateway</th>
            <th className="text-center">Purchase Date</th>
            <th className="text-center">Purchase Time</th>
          </tr>
        </thead>
        <tbody>
          {props.data?.length > 0
            ? props.data.map((data, index) => {
                var date = data.purchaseDate?.split(",");
                return (
                  <tr key={index}>
                    <td className="text-center">{index + 1}</td>
                    <td className="text-center text-capitalize">
                      {data.UserName}
                    </td>
                    <td className="text-center">{data.price}</td>
                    <td className="text-center">{data.validity}</td>
                    <td className="text-center text-capitalize">
                      {data.validityType}
                    </td>
                    <td className="text-success text-center">
                      {data.paymentGateway}
                    </td>
                    <td className="text-center ">{moment(data.purchaseDate).format('Do MMM YY')}</td>
                    <td className="text-center">{moment(data.purchaseDate).format('hh:mm A') }</td>
                  </tr>
                );
              })
            : loader === false &&
              props.data.length < 0 && (
                <tr>
                  <td colSpan="8" align="center">
                    No data Found!!
                  </td>
                </tr>
              )}
        </tbody>
      </table>
    </div>
    // </div>
  );
};

export default PurchasePremiumPlan;
