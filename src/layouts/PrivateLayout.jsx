import React, {useEffect, useState} from 'react'
import Sidebar from 'components/Sidebar';
import SideBarResponsive from 'components/SideBarResponsive';
import PrivateRoute from 'components/PrivateRoute';
import { useAuth0 } from "@auth0/auth0-react";
import ReactLoading from 'react-loading'
import { obtenerDatosUsuario } from 'utils/api';
import { useUser } from 'context/userContext';

const PrivateLayout = ({children }) => {
    const {isAuthenticated, isLoading, loginWithRedirect, getAccessTokenSilently, logout  } = useAuth0();
    const [loadingUserInformation, setLoadingUserInformation]= useState(false)
    const {setUserData}= useUser()

    useEffect(() => {



    const fetchAuth0Token = async()=>{
       /*  if (localStorage.getItem('token')){
           //validar fecha de expiracion de token 
        } else {
            //pedir token
        } */
        setLoadingUserInformation(true)
        const accessToken = await getAccessTokenSilently({
        audience: `api-autenticacion-aplicacion-des-arrolladores`,
    })
    localStorage.setItem('token', accessToken)
    console.log(accessToken)
    await obtenerDatosUsuario((response)=>{
        console.log('response',response)
        setUserData(response.data)
        setLoadingUserInformation(false)

    },(err)=>{
        console.log('err',err)
        setLoadingUserInformation(false)
        logout({ returnTo:'http://localhost:3000/'})
    })    
    }
    if (isAuthenticated){
        fetchAuth0Token()
    }
    }, [isAuthenticated, getAccessTokenSilently])

    if (isLoading || loadingUserInformation) return  <ReactLoading type='cylon' color='#ffffff' height={667} width={375}/>

    if (!isAuthenticated) {
        return loginWithRedirect()
    }

    return ( 
    <div className="flex w-screen h-screen content-center">
        <div className='flex flex-col md:flex-row flex-nowrap h-full w-full'>
            <Sidebar/>
            <SideBarResponsive />
            <main className='flex w-full bg-blue-400 overflow-y-scroll items-center justify-center'> 
            { children}
            </main>
        </div>     
    </div>
        
    )
}

export default PrivateLayout;