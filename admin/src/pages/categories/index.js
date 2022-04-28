/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import ReactTable from "react-table-v6";
import { IoMdAdd } from "react-icons/io";
import Drawer from "../../components/drawer";
import OptionDropdown from "../../components/optionDropdown";
import { BsImage } from "react-icons/bs";
import axios from "../../utils/axios";
import { toast } from "react-toastify";
import Loader from "../../components/loader";

function ImgCell(props) {
  return <img src={props.value} alt="thumb" className="category-thumbnail" />;
}

const Categories = () => {
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [state, setstate] = useState({
    name: "",
    slug: "",
    thumbnail: "",
  });
  const [categories, setcategories] = useState([]);
  const [loading, setloading] = useState(false);
  const [refresh, setrefresh] = useState(false);
  const [isEdit, setisEdit] = useState(false);

  const ActionCell = (p) => {
    return (
      <OptionDropdown>
        <ul className="action-options">
          <li onClick={() => showEditCategory(p.value)} className="edit">
            edit
          </li>
          <li onClick={() => handleDeleteCategory(p.value)} className="delete">
            delete
          </li>
        </ul>
      </OptionDropdown>
    );
  };

  const showEditCategory = (id) => {
    const cat = categories.filter((e) => e._id === id);
    setstate({
      name: cat[0].name,
      _id: cat[0]._id,
      thumbnail: cat[0].thumbnail,
    });
    setisEdit(true);
    setShowAddCategory(true);
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
    },
    {
      Header: "Total Products",
      accessor: "products",
    },
    {
      Header: "Options",
      accessor: "_id",
      Cell: ActionCell,
    },
  ];

  const handleNameChange = (e) => {
    const { value } = e.target;
    const slug = value.toLowerCase().replace(/\s/g, "-");
    setstate({ ...state, name: value, slug });
  };

  const handleSlugChange = (e) => {
    const { value } = e.target;
    const slug = value.toLowerCase().replace(/\s/g, "-");
    setstate({ ...state, slug });
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    toast.loading("Uploading image...");
    setloading(true);
    const { files } = e.target;
    const file = files[0];
    const formData = new FormData();
    formData.append("img", file);
    try {
      const { data } = await axios.post("/api/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setstate({ ...state, thumbnail: data.url });
      toast.dismiss();
      toast.success("Image uploaded successfully");
      setloading(false);
    } catch (error) {
      toast.dismiss();
      toast.error("Error uploading image");
      setloading(false);
      if (error.response.data) {
        return console.log(error.response);
      }
      console.log(error);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!state.thumbnail) {
      toast.error("Please upload an image");
      return;
    }
    if (!state.name) {
      toast.error("Name is required");
      return;
    }
    if (!state.slug) {
      toast.error("Slug is required");
      return;
    }
    toast.loading("Adding category...");
    setloading(true);
    try {
      await axios.post("/api/categories", state);
      toast.dismiss();
      toast.success("Category added successfully");
      setloading(false);
      setstate({
        name: "",
        slug: "",
        thumbnail: "",
      });
      setrefresh(true);
      setShowAddCategory(false)
    } catch (error) {
      toast.dismiss();
      setloading(false);
      if (error.response.data) {
        toast.error(error.response.data.message);
        return console.log(error.response);
      }
      console.log(error);
      toast.error("Error adding category");
    }
  };

  const handleEditCategory = async (e) => {
    e.preventDefault();
    if (!state.thumbnail) {
      toast.error("Please upload an image");
      return;
    }
    if (!state.name) {
      toast.error("Name is required");
      return;
    }
    toast.loading("Updating category...");
    setloading(true);
    try {
      await axios.put(`/api/categories/${state._id}`, state);
      toast.dismiss();
      toast.success("Category updated successfully");
      setloading(false);
      setstate({
        name: "",
        slug: "",
        thumbnail: "",  
      });
      setrefresh(true);
      setShowAddCategory(false)
    } catch (error) {
      toast.dismiss();
      setloading(false);
      if (error.response.data) {
        toast.error(error.response.data.message);
        return console.log(error.response);
      }
      console.log(error);
      toast.error("Error updating category");
    }
  };

  const handleDeleteCategory = async (id) => {
    toast.loading("Deleting category...");
    setloading(true);
    try {
      await axios.delete(`/api/categories/${id}`);
      toast.dismiss();
      toast.success("Category deleted successfully");
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
      toast.error("Error deleting category");
    }
  };

  const ShowAddCategory = () => {
    setisEdit(false);
    setShowAddCategory(true)
  }

  useEffect(async () => {
    try {
      const { data } = await axios.get("/api/categories");
      setcategories(data);
      setrefresh(false);
    } catch (error) {
      setrefresh(false);
      if (error.response) {
        toast.error(error.response.data.message);
        return console.log(error.response);
      }
      console.log(error);
    }
  }, [refresh]);

  return (
    <div className="container">
      <div className="page-header">
        <h3 className="page-title">Categories</h3>
        <button
          onClick={ShowAddCategory}
          className="btn add-category-btn">
          <IoMdAdd className="icon" /> add category
        </button>
      </div>
      <Drawer show={showAddCategory} setShow={setShowAddCategory}>
        <form onSubmit={isEdit ? handleEditCategory : handleAddCategory} className="add-categories">
          <h3>{ isEdit ? 'edit category' :  'add category'}</h3>
          <input
            type="text"
            placeholder="enter name"
            value={state.name}
            onChange={handleNameChange}
          />
          {!isEdit && (
            <input
              type="text"
              placeholder="category slug"
              value={state.slug}
              onChange={handleSlugChange}
            />
          )}
          <input type="file" id="cat-thumb" onChange={handleImageUpload} />
          <label className="image-input" htmlFor="cat-thumb">
            <BsImage className="icon" /> select category image
          </label>
          {state.thumbnail && (
            <img
              className="thumbnail-preview-category"
              src={state.thumbnail}
              alt="thumbnail"
            />
          )}
          {loading ? (
            <button type="button" className="btn" disabled>
              <Loader />
            </button>
          ) : (
            <button className="btn">{ isEdit ? 'edit category' :  'add category'}</button>
          )}
        </form>
      </Drawer>
      <div className="data-table categories__table">
        <ReactTable
          data={categories}
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

export default Categories;
