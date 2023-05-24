import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, crmdatabase } from '../../Firebase';
import { ref, set } from "firebase/database";

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState(true);


    const signUpUser = (firstName, lastName, email, password) => {
        return createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
            const userId = userCredential.user.uid;
            set(ref(crmdatabase, 'users/' + userId), {
                firstName: firstName,
                lastName: lastName,
                email: email,
                authProvider: 'local'
            });
        })
            .catch((error) => {
                throw error;
            });
    }

    const loginUser = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    }

    const logOutUser = () => {
        console.log('logout');
        return signOut(auth);
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user);
            setLoading(false);
        })
        return unsubscribe
    }, [])

    const value = {
        currentUser,
        signUpUser,
        loginUser,
        logOutUser
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

export default AuthProvider