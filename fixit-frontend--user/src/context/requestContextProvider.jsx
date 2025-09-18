import RequestContext from './requestContext'
import React ,{useState}from "react";

const backend = import.meta.env.VITE_backend;

const Requestcontextprovider = ({ children }) => {
    const [request,setrequest]=useState();
    const getpendingreq = async () => {
      try {
        const res = await fetch(`${backend}/api/user/gethystory`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjg0MDA1M2I4MDdiNTI1MWU1NTRmN2ViIn0sImlhdCI6MTc0OTA1MzQ2M30.1_GSrZDEN11n4DQaxAdFv7OkCjeRIdhojXCypyFBTiU', // if using JWT auth
          },
        });

        const data = await res.json();
        if (res.ok) {
          setrequest(data.requests);
        } else {
          console.error('Error fetching requests:', data.message);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    const getreqhystory =async (params) => {

    }
    return (
        <RequestContext.Provider value={{ request,setrequest ,getpendingreq,getreqhystory}}>
            {children}
        </RequestContext.Provider>
    );
};

export default Requestcontextprovider;