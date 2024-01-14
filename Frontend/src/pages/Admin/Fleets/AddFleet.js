import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../../components/Footer/Footer";
import Header from "../../../components/Header/Header";
import Navbar from "../../../components/Navbar/Navbar";
import { toast, Toaster } from "react-hot-toast";
import useFetch from "../../../hooks/useFetch";
import Loading from "../../../components/Loading/Loading";
import useCarFetch from "../../../hooks/useCarFetch";

function AddFleet() {

  const [bus, setBus] = useState({
    type: "",
    status: true, // Assuming status is a boolean
    VIN: "",
    TUIO: 0,
    cap: 0,
    daily_km: 0,
    daily_students_ct: 0,
    bus_point: { type: "Point", coordinates: [0, 0] }, // Assuming default coordinates
    current_students_ct: 0,
    current_driver_id: 0,
    pin_color: ""
  });

  const navigate = useNavigate();

  const handleAddFleet = async (e) => {
    e.preventDefault();
  
    try {
      const res = await axios.post('http://localhost:3000/api/buses', bus);
      // Handle the response, like navigating to the buses page or showing success message
      navigate("/fleets"); // Adjust according to your routing
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBus(prevState => ({
      ...prevState,
      [name]: name === "TUIO" || name === "cap" ? parseInt(value, 10) : value
    }));
  };

  return (
    <div className="bg-gray-100 font-family-karla flex">
      <Navbar></Navbar>
  
      <div className="w-full flex flex-col h-screen overflow-y-hidden">
        <Header></Header>
        <div className="w-full overflow-x-hidden border-t flex flex-col">
          <main className="w-full flex-grow px-6">
            <div className="flex flex-wrap">
              {/* Bus Form */}
              <div className="w-full lg:w-1/2 mt-6 pl-0 lg:pl-2">
                <p className="text-xl pb-6 flex items-center">
                  <i className="fas fa-bus mr-3"></i> Add Bus
                </p>
                <div className="leading-loose">
                  <form className="p-10 bg-white rounded shadow-xl">
                    <div className="">
                      <label className="block text-sm text-gray-600">
                        Bus Type
                      </label>
                      <input
                        className="w-full px-5 py-1 text-gray-700 bg-gray-200 rounded"
                        id="type"
                        name="type"
                        type="text"
                        required=""
                        onChange={handleChange}
                        placeholder="Bus Type"
                        aria-label="Bus Type"
                      />
                    </div>
                    <div className="mt-2">
                      <label className="block text-sm text-gray-600">
                        VIN
                      </label>
                      <input
                        className="w-full px-5 py-4 text-gray-700 bg-gray-200 rounded"
                        id="VIN"
                        name="VIN"
                        type="text"
                        required=""
                        onChange={handleChange}
                        placeholder="VIN"
                        aria-label="VIN"
                      />
                    </div>
                    <div className="mt-2">
                      <label className="block text-sm text-gray-600">
                        TUIO
                      </label>
                      <input
                        className="w-full px-5 py-1 text-gray-700 bg-gray-200 rounded"
                        id="TUIO"
                        name="TUIO"
                        type="number"
                        min="0"
                        max="215"
                        required=""
                        onChange={handleChange}
                        placeholder="TUIO"
                        aria-label="TUIO"
                      />
                    </div>
                    <div className="mt-2">
                      <label className="block text-sm text-gray-600">
                        Capacity
                      </label>
                      <input
                        className="w-full px-5 py-1 text-gray-700 bg-gray-200 rounded"
                        id="cap"
                        name="cap"
                        type="number"
                        required=""
                        onChange={handleChange}
                        placeholder="Capacity"
                        aria-label="Capacity"
                      />
                    </div>
                    <div className="mt-6">
                      <button
                        onClick={handleAddFleet} // Replace with your function for adding a bus
                        className="px-4 py-1 text-white font-light tracking-wider bg-gray-900 rounded"
                        type="submit"
                      >
                        Add Bus
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
  }  

export default AddFleet;
