/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import ReactTable from "react-table-v6";
import OptionDropdown from "../../components/optionDropdown";
import axios from '../../utils/axios';
import { toast } from "react-toastify";

const Orders = () => {
  const [orders, setorders] = useState([]);
  const [refresh, setrefresh] = useState(false);
  const changeOrderStatus = async (s, id) => {
    toast.loading("Updating Order...");
    try {
      const response = await axios.put('/api/orders?status=' + s + '&id=' + id);
      toast.dismiss();
      toast.success(response.data.message);
      setrefresh(!refresh);
    } catch (error) {
      toast.dismiss();
      if (error.response.data) {
        toast.error(error.response.data.message);
        return console.log(error.response);
      }
      toast.error("Error updating Order");
      console.log(error);
    }
  }
  
  const ActionCell = (p) => {
    return (
      <OptionDropdown>
        <ul className="action-options">
          <li onClick={() => changeOrderStatus('pending', p.original._id)}>pending</li>
          <li onClick={() => changeOrderStatus('processing', p.original._id)}>processing</li>
          <li onClick={() => changeOrderStatus('shipped', p.original._id)}>shipped</li>
        </ul>
      </OptionDropdown>
    )
  }
  
  const PriceCell = (p) => {
    return <h3>{p.value}$</h3>
  }
  
  const StatusCell = (p) => {
    return <span className={`order-status ${p.value}`}>{p.value}</span>
  }
  
  const columns = [
    
    {
      Header: "Products",
      accessor: "products",
      width: 400,
      Cell: (p) => {
        return (
          <div>
            {p.value.map((product, i) => (
              <div key={i}>
                <p>{product.name},</p>
              </div>
            ))}
          </div>
        )
      }
    },
    {
      Header: "Payment Method",
      accessor: "paymentMethod",
    },
    {
      Header: "Phone",
      accessor: "address",
      Cell: (p) => {
        return <span>{p.value?.phone || 'null'}</span>
      }
    },
    {
      Header: "Amount",
      accessor: "amount",
      Cell: PriceCell,
    },
    {
      Header: "status",
      accessor: "status",
      Cell: StatusCell,
    },
    {
      Header: 'Change Status',
      accessor: 'id',
      Cell: ActionCell,
    }
  
  ];

  useEffect( async () => {
    try {
      const { data } = await axios.get('/api/orders');
      setorders(data);
      setrefresh(!refresh);
    } catch (error) {
      console.log(error);
      setrefresh(!refresh);
    }
  },[refresh])
  return (
    <div className="container">
      <div className="page-header">
        <h3 className="page-title">Orders</h3>
      </div>
      <div className="data-table products__table">
        <ReactTable
          data={orders}
          columns={columns}
          minRows={0}
          defaultPageSize={15}
          showPageJump={true}
          previousText={""}
          nextText={""}
          resizable={false}
        />
      </div>
    </div>
  );
};

export default Orders;
