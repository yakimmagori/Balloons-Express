import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/loader";
import axios from '../../utils/axios';
import { AUTH_LOADING_ON, AUTH_LOADING_OFF, SET_USER } from '../../store/constants';
import { toast } from 'react-toastify';

const Login = () => {
  const { isLoading } = useSelector((e) => e.AuthReducer);
  const dispatch = useDispatch();
  const [state, setstate] = useState({
    email: "",
    password: "",
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({type:AUTH_LOADING_ON });
    try {
      const { data } = await axios.post('/api/login',state);
      localStorage.setItem('token', data?.token || null);
      toast.success('Login Successful');
      dispatch({type: SET_USER, payload: data?.user || null})
      dispatch({type:AUTH_LOADING_OFF });
    } catch (error) {
      dispatch({type:AUTH_LOADING_OFF });
      if(error.response){
        toast.error(error.response.data.message);
        return console.log(error.response);
      }
      console.log(error);
    }
  };
  return (
    <div className="login">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        <div className="form-group">
          <label htmlFor="email">enter email</label>
          <input
            type="email"
            name="email"
            value={state.email}
            required
            onChange={(e) => setstate({ ...state, email: e.target.value })}
            id="email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">enter password</label>
          <input
            type="password"
            required
            value={state.password}
            name="password"
            id="password"
            onChange={(e) => setstate({ ...state, password: e.target.value })}
          />
        </div>
        {isLoading ? (
          <button type="button" className="btn" disabled>
            <Loader />
          </button>
        ) : (
          <button type="submit" className="btn">login</button>
        )}
      </form>
    </div>
  );
};

export default Login;
