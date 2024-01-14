import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Footer from "../../../components/Footer/Footer";
import Header from "../../../components/Header/Header";
import Loading from "../../../components/Loading/Loading";
import Navbar from "../../../components/Navbar/Navbar";
import useFetch from "../../../hooks/useFetch";
import Table from "./Table";

function Fleets() {
  const [refetch, setRefetch] = useState(false);
  const { data, loading, error } = useFetch("http://localhost:3000/api/buses", refetch);
  const navigate = useNavigate(); // Use useNavigate hook

  const reFetchBuses = () => {
    setRefetch(!refetch);
  };

  return (
    <div className="bg-gray-100 font-family-karla flex">
      <Navbar></Navbar>
      <div className="w-full flex flex-col h-screen overflow-y-hidden">
        <Header></Header>
        {loading && <Loading></Loading>}
        {!loading && (
          <main className="w-full flex-grow p-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl text-black">Buses ({data.length})</h1>
              <button 
                onClick={() => navigate("/add-fleet")}
                className="text-white font-bold py-2 px-4 rounded"
                style={{ backgroundColor: "#2d3748" }}> {/* Update this color to match your navbar */}
                Add New Bus
              </button>
            </div>
            {data.length === 0 ? (
              <h1 className="text-2xl text-black">No buses yet!</h1>
            ) : (
              <Table buses={data} loading={loading} reFetchBuses={reFetchBuses}></Table>
            )}
          </main>
        )}
      </div>
    </div>
  );
}

export default Fleets;


