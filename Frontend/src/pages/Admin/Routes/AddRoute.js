import React, { useState } from "react";
import Navbar from "../../../components/Navbar/Navbar";
import Header from "../../../components/Header/Header";
import { Toaster, toast } from "react-hot-toast";
import useFetch from "../../../hooks/useFetch";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../../components/Loading/Loading";
import drivers from "../../../data/drivers.json";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  visibilityChange,
  visibilityChangeMapModal,
} from "../../../redux/modalSlice";
import MapModal from "./Map/MapModal";
import { addMap, addMapNames } from "../../../redux/mapSlice";

function AddRoute() {
  const { data, loading, error, reFetchUser } = useFetch("/fleet/getAllFleets");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.users.user);
  const modal = useSelector((state) => state.modals.mapModal);
  const map = useSelector((state) => state.maps.map);
  const mapName = useSelector((state) => state.maps.mapName);

  const [fleet, setFleet] = useState();
  const [car, setCar] = useState();
  const [driver, setDriver] = useState();

  const [route, setRoute] = useState({
    starting: "",
    destination: "",
    start: "",
    end: "",
    distance: "",
    duration: "",
    customer_id: "",
    fleet_id: "",
    car_id: "",
    driver_id: "",
  });

  const handleChange = (e) => {
    setRoute((prev) => ({ ...prev, [e.target.id]: e.target.value.trim() }));
  };

  const handleFleetChange = (e) => {
    const fleetFind = data.filter((item) => item._id == e.target.value);
    setFleet(fleetFind[0]);
  };

  const handleCarChange = (e) => {
    const carFind = fleet.fleetCars.filter((item) => item.id == e.target.value);
    setCar(carFind[0]);
  };

  const handleDriverChange = (e) => {
    const driverFind = drivers.filter((item) => item.id == e.target.value);
    setDriver(driverFind[0]);
  };

  const handleDetailModalRoute = (e) => {
    e.preventDefault();
    dispatch(visibilityChangeMapModal(true));
  };

  const handleRouteNameSlice = (text) => {
    var texts = text.split(" ");
    var completedText = texts.slice(0, 2).join(" ");
    return completedText;
  };

  const handleAddRoute = async (e) => {
    e.preventDefault();

    route.customer_id = user._id;
    route.fleet_id = fleet._id;
    route.car_id = car.id;
    route.driver_id = driver.id;
    route.starting = handleRouteNameSlice(mapName.startName);
    route.destination = handleRouteNameSlice(mapName.endName);
    route.start = mapName.start;
    route.end = mapName.end;
    route.distance = map.distance;
    route.duration = `${map.hours} hour ${map.remainingMinutes} min`;

    try {
      console.log(route);
      const res = await axios.post("/route/addRoute", route);
      let mailUser = {
        email: user.email,
        name: user.name,
        route: res.data,
        car: car,
        driver: driver,
        type: "addRoute",
      };
      await axios.post("/mail/sendMail", mailUser);
      dispatch(addMap(false));
      dispatch(addMapNames(false));
      // toast.success("Route created!");
      navigate("/routes");
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  return (
    <div className="bg-gray-100 font-family-karla flex">
      <Navbar></Navbar>

      <div className="w-full flex flex-col h-screen overflow-y-hidden">
        <Header></Header>

        {loading && <Loading></Loading>}
        {modal && <MapModal></MapModal>}
        {!loading && (
          <div className="w-full overflow-x-hidden border-t flex flex-col">
            <main className="w-full flex-grow px-6">
              <div className="flex flex-wrap">
                {/* Route */}
                <div className="w-full lg:w-1/2 mt-6 pl-0 lg:pl-2">
                  <p className="text-xl flex items-center py-2">
                    <i className="fas fa-address-card mr-3"></i> Set Route{" "}
                  </p>
                  <div className="w-full pl-0 lg:pl-2">
                    <div className="leading-loose">
                      <form className="p-10 bg-white h-64 rounded shadow-xl">
                        <div className="flex flex-col items-center justify-center space-y-5 h-full">
                          {!mapName.start && !mapName.end && (
                            <div className="flex flex-col items-center justify-center space-y-1">
                              <p>⚠️ Select Start and Destination points.</p>
                              <button
                                onClick={(e) => handleDetailModalRoute(e)}
                                className="px-4 py-1 text-white font-light tracking-wider bg-gray-900 rounded"
                                type="submit"
                              >
                                Set Route
                              </button>
                            </div>
                          )}

                          {driver ? (
                            <div className="flex flex-col items-center justify-center space-y-">
                              <p>✔️ You can create your route.</p>
                              <button
                                onClick={handleAddRoute}
                                className="px-4 py-1 text-white font-light tracking-wider bg-gray-900 rounded"
                                type="submit"
                              >
                                Save
                              </button>
                            </div>
                          ) : (
                            mapName.start &&
                            mapName.end && <p>⚠️ Fill in all fields.</p>
                          )}
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                {map && (
                  <div className="w-full lg:w-1/2 mt-6 pl-0 lg:pl-2">
                    <p className="text-xl flex items-center py-2">
                      <i className="fas fa-address-card mr-3"></i> Route
                       Information{" "}
                    </p>
                    <div className="w-full pl-0 lg:pl-2">
                      <div className="leading-loose">
                        <form className="p-10 bg-white h-64 rounded space-y-3 shadow-xl">
                          <div className="flex flex-row w-full justify-evenly">
                            <p className="font-semibold">Starting point :</p>
                            <p>{handleRouteNameSlice(mapName.startName)}</p>
                          </div>
                          <div className="flex flex-row w-full justify-evenly">
                            <p className="font-semibold">Destination :</p>
                            <p>{handleRouteNameSlice(mapName.endName)}</p>
                          </div>
                          <div className="flex flex-row w-full justify-evenly">
                            <p className="font-semibold">Total Distance :</p>
                            <p>{map.distance} km</p>
                          </div>
                          <div className="flex flex-row w-full justify-evenly">
                            <p className="font-semibold">The total time :</p>
                            <p>
                              {map.hours} hour {map.remainingMinutes} minute
                            </p>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap mt-3">
                {/* Fleet */}
                {map && (
                  <div className="w-full lg:w-1/3 mt-6 pl-0 lg:pl-2">
                    <p className="text-xl flex items-center py-2">
                      <i className="fas fa-address-card mr-3"></i> Fleet
                       Information{" "}
                    </p>
                    <div className="w-full pl-0 lg:pl-2">
                      <div className="leading-loose">
                        <form className="p-10 bg-white h-52 rounded shadow-xl">
                          <div>
                            <label
                              htmlFor="customers"
                              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                              Choose a fleet
                            </label>
                            <select
                              id="fleet"
                              onChange={handleFleetChange}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            >
                              <option disabled selected>
                                Choose fleet
                              </option>
                              {data.map(
                                (item) =>
                                  item.status === "active" && (
                                    <option
                                      value={item._id}
                                      key={item._id}
                                      // selected={item._id === fleet.fleetOwner}
                                    >
                                      {item.fleetName}
                                    </option>
                                  )
                              )}
                            </select>
                          </div>
                          <div id="tasks" className="my-5">
                            {fleet && (
                              <p className="text-xs text-slate-500 my-5 text-center">
                                <span className="font-bold">
                                  {fleet.fleetName}
                                </span>{" "}
                                fleet has been chosen.
                              </p>
                            )}
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                )}

                {fleet && (
                  <div className="w-full lg:w-1/3 mt-6 pl-0 lg:pl-2">
                    <p className="text-xl flex items-center py-2">
                      <i className="fas fa-address-card mr-3"></i> Vehicle
                       Information{" "}
                    </p>
                    <div className="w-full pl-0 lg:pl-2">
                      <div className="leading-loose">
                        <form className="p-10 bg-white h-52 rounded shadow-xl">
                          <div>
                            <label
                              htmlFor="customers"
                              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                              Choose tools to add
                            </label>
                            <select
                              id="tempCar"
                              onChange={handleCarChange}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            >
                              <option disabled selected>
                                Choose vehicle
                              </option>
                              {fleet.fleetCars.map((item) => (
                                <option value={item.id} key={item.id}>
                                  {item.make} {"-"} {item.model} {"-"}{" "}
                                  {item.type} {"-"} {item.year}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div id="tasks" className="my-5"></div>
                          {car && (
                            <p className="text-xs text-slate-500 text-center">
                              <span className="font-bold">
                                {car.make}
                                {"-"} {car.model}{" "}
                              </span>{" "}
                              vehicle has been selected.
                            </p>
                          )}
                        </form>
                      </div>
                    </div>
                  </div>
                )}

                {car && (
                  <div className="w-full lg:w-1/3 mt-6 pl-0 lg:pl-2">
                    <p className="text-xl flex items-center py-2">
                      <i className="fas fa-address-card mr-3"></i> Driver
                       Information{" "}
                    </p>
                    <div className="w-full pl-0 lg:pl-2">
                      <div className="leading-loose">
                        <form className="p-10 bg-white h-52 rounded shadow-xl">
                          <div>
                            <label
                              htmlFor="customers"
                              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                              Choose tools to add
                            </label>
                            <select
                              id="driver"
                              onChange={handleDriverChange}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            >
                              <option disabled selected>
                              Choose a driver
                              </option>
                              {drivers.map((item) => (
                                <option value={item.id} key={item.id}>
                                  {item.first_name} {item.last_name} {"||"}{" "}
                                  {item.phone}{" "}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div id="tasks" className="my-5">
                            {driver && (
                              <p className="text-xs text-slate-500 text-center">
                                <span className="font-bold">
                                  {driver.first_name} {driver.last_name}
                                </span>{" "}
                                named driver was selected.
                              </p>
                            )}
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </main>
          </div>
        )}
      </div>
      <Toaster position="top-right" />
    </div>
  );
}

export default AddRoute;
