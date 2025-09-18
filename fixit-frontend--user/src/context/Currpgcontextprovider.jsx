import React ,{useState}from "react";
import Currpgcontext from './currpgcontext';

const Currpgcontextprovider = ({ children }) => {
    const [currpg,setcurrpg]=useState('Home');
    return (
        <Currpgcontext.Provider value={{ currpg,setcurrpg }}>
            {children}
        </Currpgcontext.Provider>
    );
};

export default Currpgcontextprovider