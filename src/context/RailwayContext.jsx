import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const RailwayContext = createContext();

export const useRailway = () => useContext(RailwayContext);

export const RailwayProvider = ({ children }) => {
    const [isRailwayMode, setIsRailwayMode] = useState(false);
    const navigate = useNavigate();

    const triggerRailwayTransition = () => {
        setIsRailwayMode(true);
        // Wait for animation to finish before navigating
        setTimeout(() => {
            navigate('/railway');
            // Optional: reset mode after navigation or keep it for the railway page style
            // setIsRailwayMode(false); 
        }, 800); // 800ms match CSS animation duration
    };

    return (
        <RailwayContext.Provider value={{ isRailwayMode, triggerRailwayTransition }}>
            {children}
        </RailwayContext.Provider>
    );
};
