import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import Loading from "../../../components/Loading/Loading";

function Table({ buses, loading, reFetchBuses }) {
    const navigate = useNavigate();
    const handleEditFleet = (bus) => {
    navigate(`/edit-fleet/${bus._id}`);
  };


  const handleDeleteFleet = async (bus) => {
    try {
      if (window.confirm("Are you sure you want to delete this bus?")) {
        await axios.delete(`http://localhost:3000/api/buses/${bus._id}`);
        toast.success("Bus deleted successfully!");
        reFetchBuses(); // Call the function passed from Fleets to refetch bus data
      }
    } catch (error) {
      toast.error(error.response.data);
    }
  };
  

  return (
    <div className="bg-gray-100 flex items-center justify-center font-sans overflow-auto">
      {loading && <Loading></Loading>}
      {!loading && (
        <div className="w-full">
          <div className="bg-white shadow-md rounded my-6">
            <table className="min-w-max w-full table-auto">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-4 px-8 text-left">Bus Type</th>
                  <th className="py-4 px-8 text-left">VIN</th>
                  <th className="py-4 px-8 text-center">TUIO</th>
                  <th className="py-4 px-8 text-center">Capacity</th>
                  <th className="py-4 px-8 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {buses.map((bus) => (
                  <tr key={bus._id} className="border-b border-gray-200 hover:bg-gray-100">
                    {/* Bus data cells */}
                    <td className="py-4 px-8 text-left">{bus.type}</td>
                    <td className="py-4 px-8 text-left">{bus.VIN}</td>
                    <td className="py-4 px-8 text-center">{bus.TUIO}</td>
                    <td className="py-4 px-8 text-center">{bus.cap}</td>
                    <td className="py-4 px-8 text-center">
                      <div className="flex item-center justify-center">
                        <span
                          onClick={() => handleEditFleet(bus)}
                          className="w-4 mr-2 transform hover:text-green-500 hover:scale-110 cursor-pointer"
                        >
                          <i className="fas fa-pen"></i>
                        </span>
                        <Link
                          onClick={() => handleDeleteFleet(bus)}
                          className="w-4 mr-2 transform hover:text-red-500 hover:scale-110"
                        >
                          <i className="fas fa-trash-alt cursor-pointer"></i>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <Toaster position="top-right" />
    </div>
  );
}

export default Table;
