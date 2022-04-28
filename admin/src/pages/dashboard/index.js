/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { BsEye, BsCurrencyDollar } from "react-icons/bs";
import AreaChart from '../../components/charts/areaChart';
import axios from "../../utils/axios";
import { FaUsers } from "react-icons/fa";
import { toast } from "react-toastify";
 
const Dashboard = () => {
  const [products, setproducts] = useState([]);
  const [customers, setcustomers] = useState([]);
  const [orders, setorders] = useState([]);
  const [earnings, setearnings] = useState(0);
  const [stats, setstats] = useState([]);

  const getProducts = async () => {
    try {
      const { data } = await axios.get("/api/products");
      setproducts(data);
    } catch (error) {
      if (error.response.data) {
        toast.error(error.response.data.message);
        return console.log(error.response);
      }
      console.log(error);
      toast.error("Error fetching products");
    }
  };

  const getOrders = async () => {
    try {
      const { data } = await axios.get("/api/orders");
      setorders(data);
    } catch (error) {
      if (error.response.data) {
        toast.error(error.response.data.message);
        return console.log(error.response);
      }
      console.log(error);
      toast.error("Error fetching orders");
    }
  };

  const getCustomers = async () => {
    try {
      const { data } = await axios.get("/api/customers");
      setcustomers(data);
    } catch (error) {
      if (error.response.data) {
        toast.error(error.response.data.message);
        return console.log(error.response);
      }
      console.log(error);
      toast.error("Error fetching customers");
    }
  };

  const getStats = async () => {
    try {
      const { data } = await axios.get("/api/stats");
      setstats(data);
    } catch (error) {
      if (error.response.data) {
        toast.error(error.response.data.message);
        return console.log(error.response);
      }
      console.log(error);
      toast.error("Error fetching stats");
    }
  };

  useEffect( () => {
    getProducts();
    getOrders();
    getCustomers();
    getStats();
  },[]);

  useEffect(() => {
    const totalEarnings = orders.reduce((acc, order) => {
      return acc + order.amount;
    }, 0);
    console.log(totalEarnings);
    setearnings(totalEarnings);
  }, [orders]);
  return (
    <div className='container'>
      <div className="dashboard-stats">
        <div className="stat-box">
          <BsEye className='icon' />
          <div className="info">
            <h4>total products</h4>
            <h2>{products.length}</h2>
          </div>
        </div>
        <div className="stat-box">
          <BsCurrencyDollar className='icon' />
          <div className="info">
            <h4>total Orders</h4>
            <h2>{orders.length}</h2>
          </div>
        </div>
        <div className="stat-box">
          <BsCurrencyDollar className='icon' />
          <div className="info">
            <h4>total revenue</h4>
            <h2>{ earnings }$</h2>
          </div>
        </div>
        <div className="stat-box">
          <FaUsers className='icon' />
          <div className="info">
            <h4>total customers</h4>
            <h2>{customers.length}</h2>
          </div>
        </div>
      </div>

      <div className="charts-wrapper">
        <div className="chart-box"><AreaChart stats={stats} /></div>
      </div>
    </div>
  )
}

export default Dashboard;