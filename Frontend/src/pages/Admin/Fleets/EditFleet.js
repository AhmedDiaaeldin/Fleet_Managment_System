import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../../components/Header/Header";
import Navbar from "../../../components/Navbar/Navbar";
import Loading from "../../../components/Loading/Loading";
import { toast, Toaster } from "react-hot-toast";

function EditFleet() {
  const [bus, setBus] = useState({
  type: "",
  VIN: "",
  TUIO: 0,
  cap: 0,
});
const [loading, setLoading] = useState(true); // Add loading state

  const id = useLocation().pathname.split("/")[2];
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBusData = async () => {
      setLoading(true); // Start loading
      try {
        const response = await axios.get(`http://localhost:3000/api/buses/${id}`);
        setBus(response.data);
        setLoading(false); // Stop loading after fetching data
      } catch (error) {
        toast.error("Failed to load bus data");
        setLoading(false); // Stop loading if there's an error
      }
    };
  
    fetchBusData();
  }, [id]);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBus(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleEditFleet = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/api/buses/${id}`, bus);
      toast.success("Bus updated successfully!");
      navigate("/fleets"); // Adjust according to your routing
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  // Form JSX
  return (
    <div className="bg-gray-100 font-family-karla flex">
      <Navbar></Navbar>
  
      <div className="w-full flex flex-col h-screen overflow-y-hidden">
        <Header></Header>

        {loading && <Loading></Loading>}
        
        {!loading && (
          <main className="w-full flex-grow p-6">
            <div className="flex flex-wrap">
              {/* Bus Edit Form */}
              <div className="w-full lg:w-1/2 mt-6 pl-0 lg:pl-2">
                <p className="text-xl pb-6 flex items-center">
                  <i className="fas fa-bus mr-3"></i> Edit Bus
                </p>
                <div className="leading-loose">
                  <form className="p-10 bg-white rounded shadow-xl">
                    {/* Bus Type Input */}
                    <div className="mt-2">
                      <label className="block text-sm text-gray-600">
                        Bus Type
                      </label>
                      <input
                        className="w-full px-5 py-1 text-gray-700 bg-gray-200 rounded"
                        id="type"
                        name="type"
                        type="text"
                        required=""
                        value={bus.type}
                        onChange={handleChange}
                        placeholder="Bus Type"
                        aria-label="Bus Type"
                      />
                    </div>
                    {/* VIN Input */}
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
                        value={bus.VIN}
                        onChange={handleChange}
                        placeholder="VIN"
                        aria-label="VIN"
                      />
                    </div>
                    {/* TUIO Input */}
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
                        value={bus.TUIO}
                        onChange={handleChange}
                        placeholder="TUIO"
                        aria-label="TUIO"
                      />
                    </div>
                    {/* Capacity Input */}
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
                        value={bus.cap}
                        onChange={handleChange}
                        placeholder="Capacity"
                        aria-label="Capacity"
                      />
                    </div>
                    {/* Submit Button */}
                    <div className="mt-6">
                      <button
                        onClick={handleEditFleet}
                        className="px-4 py-1 text-white font-light tracking-wider bg-gray-900 rounded"
                        type="submit"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </main>
        )}
      </div>
  
      <Toaster position="top-right" />
    </div>
  );
}  

export default EditFleet;
