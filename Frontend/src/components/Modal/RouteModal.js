import React, { useState } from "react";
import "./style.css";
import { useDispatch, useSelector } from "react-redux";
import { visibilityChangeRouteModal } from "../../redux/modalSlice";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function RouteModal({ reFetchUser }) {
  const dispatch = useDispatch();

  const route = useSelector((state) => state.routes.route);
  const [routeStatus, setRouteStatus] = useState();

  const handleChange = (e) => {
    setRouteStatus((prev) => ({
      ...prev,
      [e.target.id]: e.target.value.trim(),
    }));
  };

  const handleDetailRoute = () => {
    dispatch(visibilityChangeRouteModal(false));
  };

  const handleUpdateRoute = async () => {
    try {
      await axios.put(`/route/updateStatusRoute/${route._id}`, [
        route,
        routeStatus,
      ]);
      handleDetailRoute();
      reFetchUser();
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  return (
    <div className="overlayChat">
      <div className="modalRouteContainer">
        <div className="chat-header">
          <p className="text-lg font-medium">Route Status</p>
          <div onClick={() => handleDetailRoute()}>
            <i className="fas fa-times fa-lg mt-1 cursor-pointer"></i>
          </div>
        </div>
        <div className="chat-area flex justify-center items-center">
          <select
            id="routeStatus"
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="active" selected={route.status === "active"}>
              On the road
            </option>
            <option value="completed" selected={route.status === "completed"}>
              Completed
            </option>
            <option value="passive" selected={route.status === "passive"}>
              Canceled
            </option>
          </select>
          <button
            onClick={() => handleUpdateRoute()}
            className="px-4 py-1 mt-5 text-white font-light tracking-wider bg-gray-900 rounded"
            type="submit"
          >
            Update
          </button>
        </div>
        <div className="chat-typing-area-wrapper"></div>
      </div>
    </div>
  );
}
