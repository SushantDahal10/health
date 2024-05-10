import React, { useState, useEffect } from 'react';
import { FaHome } from "react-icons/fa";
import { IoIosFitness } from "react-icons/io";
import { IoFitness } from "react-icons/io5";
import { PiSignOutBold } from "react-icons/pi";
import { useNavigate } from 'react-router-dom';
import { GiHotMeal } from "react-icons/gi";
import logo from '../Images/logo.jpg';
import { useLocation } from 'react-router-dom';

const Signup = () => {
  const [showPregnancyInput, setShowPregnancyInput] = useState(false);
  const history = useNavigate();
  const [userData, setUserData] = useState(null);
  const [activePage, setActivePage] = useState('');
  const [data, setData] = useState({
    fullname: "",
    email: "", 
    age: "",
    height: "",
    weight: "",
    gender: "",
    pregnancy: ""
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8000/api/user/dashboard', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const userData = await response.json();
        setUserData(userData);

        // Set email in the data state
        setData(prevData => ({ ...prevData, email: userData.email }));
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  async function submittobackend(e) {
    e.preventDefault();
  
    try {
      const fetchdata = await fetch('http://localhost:8000/api/user/update', {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      const datares = await fetchdata.json();
  
      if (fetchdata.ok) {
        localStorage.setItem('token', datares.token);
        alert('sucessfully updated');
      } else {
        alert(datares.error);
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred. Please try again later.');
      history('/login');
    }
  }

  function handleInputChange(event) {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });

    if (name === "gender" && value === "female") {
      setShowPregnancyInput(true);
    } else if (name === "gender" && value !== "female") {
      setShowPregnancyInput(false);
      setData(prevData => ({ ...prevData, pregnancy: "" }));
    }
  } 

  const location = useLocation();

  useEffect(() => {
    console.log('Current path:', location.pathname);
    setActivePage(location.pathname.split("/")[2]);
  }, [location.pathname]);
  

  const navigateTo = (path, page) => {
    history(path);
    // Remove setActivePage(page) from here
  };
  

  const handleLogout = () => {
    localStorage.removeItem('token');
    history('/login');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 h-screen font-sans">
      {/* Sidebar */}
      <div className="md:col-span-2 bg-gray-400 text-white">
        <div className="py-4 px-6 flex justify-between items-center">
          <div className="flex items-center space-x-4 mt-10">
            <img src={logo} alt="Logo" className="h-10" />
            <h1 className="text-lg font-semibold">Health - Fitness</h1>
          </div>
        </div>
        <nav className="mt-6 md:hidden"> {/* Dropdown for smaller devices */}
          <select
            value={activePage}
            onChange={(e) => navigateTo(`/dashboard/${e.target.value}`, e.target.value)}
            className="block w-full py-2 px-4 rounded transition duration-300 bg-gray-800 text-gray-200"
          >
            <option value="home">Home</option>
            <option value="diet">Meal Planner</option>
            <option value="fitness">Fitness</option>
            <option value="health">Update Info</option>
          </select>
        </nav>
        <nav className="mt-6 hidden md:block"> {/* Sidebar for larger devices */}
          <a onClick={() => navigateTo('/dashboard/home', 'home')}
            className={`block py-2 px-4 rounded transition duration-300 ${activePage === 'home' ? 'bg-gray-800 text-gray-200' : 'hover:bg-gray-800 hover:text-gray-200'}`}>
            <FaHome className="inline" />
            <span className="ml-2 text-base">Home</span>
          </a>
          <a onClick={() => navigateTo('/dashboard/diet', 'diet')}
            className={`block py-2 px-4 rounded transition duration-300 ${activePage === 'diet' ? 'bg-gray-800 text-gray-200' : 'hover:bg-gray-800 hover:text-gray-200'}`}>
            <GiHotMeal className="inline" />
            <span className="ml-2 text-base">Meal Planner</span>
          </a>
          <a onClick={() => navigateTo('/dashboard/fitness', 'fitness')}
            className={`block py-2 px-4 rounded transition duration-300 ${activePage === 'fitness' ? 'bg-gray-800 text-gray-200' : 'hover:bg-gray-800 hover:text-gray-200'}`}>
            <IoIosFitness className="inline" />
            <span className="ml-2 text-base">Fitness</span>
          </a>
          <a onClick={() => navigateTo('/dashboard/health', 'update')}
            className={`block py-2 px-4 rounded transition duration-300 ${activePage === 'update' ? 'bg-gray-800 text-gray-200' : 'hover:bg-gray-800 hover:text-gray-200'}`}>
            <IoFitness className="inline" />
            <span className="ml-2 text-base">Update Info</span>
          </a>
        </nav>
        <footer className="py-80">
          <h1 className="text-center">Health-Fitness<small>©</small></h1>
          <div className="text-center">
            Health-Fitness ©<br />
            All Rights Reserved 2024
          </div>
        </footer>
      </div>

      {/* Main content */}
      <div className="md:col-span-10 bg-gray-100 mt-10 shadow-lg">
        <header className="bg-white w-full shadow-md flex justify-between items-center px-4 py-2">
          <h1 className="text-lg font-semibold">Update Info</h1>
          <div className="app-header-actions">
            <button className="user-profile">
              <span>{userData.fullname}</span>
              <span>
                <img src="https://assets.codepen.io/285131/almeria-avatar.jpeg" alt="User Avatar" className="w-8 h-8 rounded-full" />
              </span>
            </button>
          </div>
          <button onClick={handleLogout} className="block py-2 px-4 rounded transition duration-300 hover:bg-gray-800 hover:text-gray-200">
            <PiSignOutBold className="inline" />
            <span className="ml-2">Sign Out</span>
          </button>
        </header>
        <div className="fles mt-2 min-h-screen bg-gray-100">
        <div className="w-full md:w-3/4 lg:w-4/5 xl:w-5/6 mx-auto p-8">
          <div className="relative">
            <div className="bg-gray-100 bg-opacity-80 rounded-lg p-8 overflow-y-auto max-h-screen">
              <div className="text-3xl font-serif text-black mb-4">Update User Data!</div>
              <form onSubmit={submittobackend} className="grid grid-cols-1 md:grid-cols-2 gap-6 py-10">
              
                
                <div className="col-span-2 md:col-span-1">
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-black">Email:</label>
                    <input type="email" id="email" name="email" value={data.email} className="input-style" />
                  </div>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <div className="space-y-2">
                    <label htmlFor="age">Age:</label>
                    <input
                      type="text"
                      id="age"
                      name="age"
                      value={data.age}
                      onChange={handleInputChange}
                      placeholder={userData && userData.age} 
                      onKeyPress={(e) => {
                        const pattern = /[0-9\b]/;
                        if (!pattern.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      className="input-style"
                    />
                  </div>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <div className="space-y-2">
                    <label htmlFor="height">Height (in cm):</label>
                    <input
                      type="text"
                      id="height"
                      name="height"
                      value={data.height}
                      onChange={handleInputChange}
                      placeholder={userData && userData.height} 
                      onKeyPress={(e) => {
                        const pattern = /[0-9\b]/;
                        if (!pattern.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      className="input-style"
                    />
                  </div>
                </div>
                <div className="col-span-1">
                  <div className="space-y-2">
                    <label htmlFor="weight">Weight (in kg):</label>
                    <input
                      type="text"
                      id="weight"
                      name="weight"
                      value={data.weight}
                      onChange={handleInputChange}
                      placeholder={userData && userData.weight} 
                      onKeyPress={(e) => {
                        const pattern = /[0-9\b]/;
                        if (!pattern.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      className="input-style"
                    />
                  </div>
                </div>
                {userData && userData.gender === 'female' && (
                  <div className="col-span-1">
                    <div className="space-y-2">
                      <label htmlFor="pregnancy" className="block text-black">Pregnancy:</label>
                      <select id="pregnancy" name="pregnancy" value={data.pregnancy} onChange={handleInputChange} className="input-style">
                        <option value="">Select Pregnancy</option>
                        <option value="none">none</option>
                        <option value="pregnant1st">pregnant1st</option>
                        <option value="pregnant2nd_1">pregnant2nd_1</option>
                        <option value="pregnant2nd_2">pregnant2nd_2</option>
                        <option value="pregnant3rd">pregnant3rd</option>
                        <option value="lactating1st">lactating1st</option>
                        <option value="lactating2nd_1">lactating2nd_1</option>
                        <option value="lactating2nd_2">lactating2nd_2</option>
                        <option value="lactating3rd">lactating3rd</option>
                      </select>
                    </div>
                  </div>
                )}
                <button type="submit" className="button col-span-2 transition duration-300 hover:bg-red-800">Update Data</button>
              </form>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
