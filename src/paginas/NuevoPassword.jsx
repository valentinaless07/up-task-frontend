import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Alerta from '../components/Alerta'
import clienteAxios from '../config/clienteAxios'

const NuevoPassword = () => {
  const params = useParams()
  const {token} = params
  const [tokenValido, setTokenValido] = useState(false)
  const [alerta, setAlerta] = useState({})
  const [password, setPassword] = useState('')
const [passwordModificado, setPasswordModificado] = useState(false)

  useEffect(() => {
    
  const comprobarToken = async () => {

    

    try {
       await clienteAxios(`/usuarios/olvide-password/${token}`)
      setTokenValido(true)

    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
    }
  }
  comprobarToken()
    
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if(password.length < 6){
      setAlerta({
        msg: 'El password debe ser minimo de 6 caracteres',
        error: true
      })
      return 
    }

    try {
      
      const url = `/usuarios/olvide-password/${token}`

      const {data} = await clienteAxios.post(url, {password})

      setAlerta({
        msg: data.msg,
        error: false
      })

      setPasswordModificado(true)

      setPassword('')

    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
    }
  }
  

  const {msg} = alerta

  return (
    <>
      <h1 className='text-sky-600 font-black text-6xl capitalize' >
        Reestablece tu password y no pierdas tus
        <span className='text-slate-700'> proyectos</span>
    </h1>

    {msg && <Alerta alerta={alerta}/>}

    {
      tokenValido && (<form onSubmit={handleSubmit} className='my-10 bg-white shadow rounded-lg p-10'>



      <div className='my-5'>
          <label className='uppercase text-gray-600 block text-xl font-bold' htmlFor='password'>Nuevo Password</label>
          <input onChange={e => setPassword(e.target.value)} value={password} id='password' type='password' placeholder='Escribe tu nuevo Password' 
          className='w-full mt-3 p-3 border rounded-xl bg-gray-50'/>
      </div>

      

      <input type='submit' value='Guardar nuevo password' 
      className='bg-sky-700 my-5 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors'/>
  </form>)
    }

{passwordModificado && (
      <Link className='block text-center my-5 text-slate-500 uppercase text-sm' to='/'>
      Inicia Sesión
    </Link>
      )}

    </>
  )
}

export default NuevoPassword