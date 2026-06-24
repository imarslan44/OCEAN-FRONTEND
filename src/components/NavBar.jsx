import React from 'react';
import { NavLink,  } from 'react-router-dom';

const NavBar = () => {




  const activeNavStyle = `flex flex-col items-center justify-center text-primary font-bold active:scale-95 duration-150 p-2 rounded`

  return ( <nav className="fixed bottom-0 w-full z-50 border-t border-outline/10 bg-surface h-16 flex justify-around items-center px-4">
        <NavLink 
         to="/home" className={({ isActive }) => isActive ? activeNavStyle : `flex flex-col items-center justify-center text-outline hover:bg-surface-container-low transition-all active:scale-95 duration-150 p-2 rounded`}>
          <span className="material-symbols-outlined">grid_view</span>
          <span className="font-label-sm text-[11px] mt-1">Home</span>
        </NavLink>
        <NavLink to="#" className={({ isActive }) => isActive ? `flex flex-col items-center justify-center text-outline/40 hover:bg-surface-container-low transition-all active:scale-95 duration-150 p-2 rounded` : `flex flex-col items-center justify-center text-outline/20 hover:bg-surface-container-low transition-all active:scale-95 duration-150 p-2 rounded`}>
          <span className="material-symbols-outlined">group</span>
          <span className="font-label-sm text-[11px] mt-1">Explore</span>
        </NavLink>
        <NavLink to="/results" className={({ isActive }) => isActive ? activeNavStyle : `flex flex-col items-center justify-center text-outline hover:bg-surface-container-low transition-all active:scale-95 duration-150 p-2 rounded`}>
          <span className="material-symbols-outlined">psychology</span>
          <span className="font-label-sm text-[11px] mt-1">Results</span>
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => isActive ? activeNavStyle : `flex flex-col items-center justify-center text-outline hover:bg-surface-container-low transition-all active:scale-95 duration-150 p-2 rounded`}>
          <span className="material-symbols-outlined" style={{}}>account_circle</span>
          <span className="font-label-sm text-[11px] mt-1">Profile</span>
        </NavLink> 
      </nav>
  );
};

export default NavBar;