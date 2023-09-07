import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase-client";

const AuthContext = createContext({});

export const useAuth = () => {
  const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(false);
    const [userSession, setUserSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      setLoading(true);

      //get user session
      const getSession = async () => {
        const { data } = await supabase.auth.getSession();

        // console.log(data);
        // console.log(data.session)
        if (data.session) {
          setUserSession(data.session);
          setAuth(true);
        }
        setLoading(false);
      };

      getSession();

      const { data } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          // console.log(event)
          if (event == "PASSWORD_RECOVERY") {
            setAuth(false);
            setUserSession(session);
            setLoading(false);
          } else if (event === "SIGNED_IN") {
            // setUser(session.user);
            setAuth(true);
            setUserSession(session);
            setLoading(false);
          } else if (event === "SIGNED_OUT") {
            console.log("signed out");
            setAuth(false);
            setUserSession(null);
            setLoading(false);
          }
        }
      );
      return () => {
        data.subscription.unsubscribe();
      };
    }, []);

    return (
      <AuthContext.Provider
        value={{
          auth,
          userSession,
        }}
      >
        {!loading && children}
      </AuthContext.Provider>
    );
  };
};
export default AuthProvider;
