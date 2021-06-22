import firebase from "firebase";
import { useEffect } from "react";
import { createContext, ReactNode, useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { auth } from "../services/firebase";

type User = {
    id: string;
    name: string;
    avatar: string;
}
type AuthContextData = {
    user: User | undefined;
    loginWithGoogle: ()=>void;
}

type AuthContextProviderProps={
    // typo para o children
    children: ReactNode
}

const AuthContext = createContext({} as AuthContextData);

export function AuthProvider(props: AuthContextProviderProps){
    const [user, setUser] = useState<User>()  
    const history = useHistory()

    useEffect(()=>{
        const unsubscribe = auth.onAuthStateChanged(user=>{
            if(user){
                const {displayName, photoURL, uid} = user

                if (!displayName || !photoURL) {
                    throw new Error ('Missing data from google account!')
                }
                
                setUser({
                    id: uid,
                    name: displayName,
                    avatar: photoURL
                })
                history.push('/rooms/new')
            }
        })
    }, [])


    async function loginWithGoogle(){
        const provider = new firebase.auth.GoogleAuthProvider();

        const data = await auth.signInWithPopup(provider)
        console.log(data)

        if(data.user){
            const {displayName, photoURL, uid} = data.user
            if (!displayName || !photoURL) {
                throw new Error ('Missing data from google account!')
            }
            
            setUser({
                id: uid,
                name: displayName,
                avatar: photoURL
            })
            history.push('/rooms/new')
        }

    }


    return(
        <AuthContext.Provider value={{user, loginWithGoogle}}>
            {props.children}
        </AuthContext.Provider>
    )
}

export function useAuth(){
    const context = useContext(AuthContext)
    return context
}