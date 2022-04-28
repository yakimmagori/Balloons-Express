/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import ReactTable from "react-table-v6";
import { IoMdAdd } from "react-icons/io";
import OptionDropdown from "../../components/optionDropdown";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import { toast } from "react-toastify";

const Products = () => {
  const [products, setproducts] = useState([]);
  const navigate = useNavigate();
  const [loading, setloading] = useState(false);
  const [refresh, setrefresh] = useState(true);

  function ImgCell(props) {
    return <img src={props.value} alt="thumb" className="product-thumbnail" />;
  }

  function QuantityCell(props) {
    return <span>{props.value || "unlimeted"}</span>;
  }

  const ActionCell = (p) => {
    return (
      <OptionDropdown>
        <ul className="action-options">
          <li
            onClick={() => navigate("/edit-product/" + p.value)}
            className="edit">
            edit
          </li>
          <li onClick={() => handleDeleteProduct(p.value)} className="delete">
            delete
          </li>
        </ul>
      </OptionDropdown>
    );
  };

  const handleDeleteProduct = async (id) => {
    toast.loading("Deleting Product...");
    setloading(true);
    try {
      await axios.delete(`/api/products/${id}`);
      toast.dismiss();
      toast.success("Product deleted successfully");
      setloading(false);
      setrefresh(true);
    } catch (error) {
      toast.dismiss();
      setloading(false);
      if (error.response.data) {
        toast.error(error.response.data.message);
        return console.log(error.response);
      }
      console.log(error);
      toast.error("Error deleting Product");
    }
  };

  const changeFeatured = async (id,v) => {
    toast.loading("Changing featured status...");
    setloading(true);
    try {
      await axios.put(`/api/products/featured`, { featured: v, id });
      toast.dismiss();
      toast.success("Featured status changed successfully");
      setloading(false);
      setrefresh(true);
    } catch (error) {
      toast.dismiss();
      setloading(false);
      if (error.response.data) {
        toast.error(error.response.data.message);
        return console.log(error.response);
      }
      console.log(error);
      toast.error("Error changing featured status");
    }
  }

  const FeaturedCell = (v) => {
    return (
      <div className="form-switch">
        <input
          type="checkbox"
          checked={v.original.isFeatured}
          onChange={(e) =>
            changeFeatured(v.value,e.target.checked ? true : false)
          }
          id="feaured"
        />
        <label htmlFor="feaured"></label>
      </div>
    );
  };

  const columns = [
    {
      Header: "Thumbnail",
      accessor: "thumbnail",
      Cell: ImgCell,
    },
    {
      Header: "Name",
      accessor: "name",
      width: 400,
    },
    {
      Header: "orders",
      accessor: "orders",
    },
    {
      Header: "quantity",
      accessor: "quantity",
      Cell: QuantityCell,
    },
    {
      Header: "Featured",
      accessor: "_id",
      Cell: FeaturedCell,
    },
    {
      Header: "Options",
      accessor: "_id",
      Cell: ActionCell,
    },
  ];

  useEffect(async () => {
    setloading(true);
    try {
      const { data } = await axios.get("/api/products");
      setproducts(data);
      setloading(false);
      setrefresh(false);
    } catch (error) {
      console.log(error);
      setrefresh(false);
    }
  }, [refresh]);
  return (
    <div className="container">
      <div className="page-header">
        <h3 className="page-title">products</h3>
        <Link to="/add-product" className="btn add-product-btn">
          <IoMdAdd className="icon" /> add product
        </Link>
      </div>
      <div className="data-table products__table">
        <ReactTable
          data={products}
          columns={columns}
          minRows={0}
          defaultPageSize={15}
          showPageJump={true}
          previousText={""}
          nextText={""}
          resizable={false}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default Products;
