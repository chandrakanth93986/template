import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import Upload from '../uploads/Upload';
import profile from '../../assets/profile.png'
import axios from 'axios';

const Profile = () => {
  const [avatar, setAvatar] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')

  const updateData = async (e) => {
    e.preventDefault()
    let response;
    const registerToast = new Promise(async (resolve, reject) => {
      try {
        response = await axios.put('http://localhost:8000/api/user/update', {
          email,
          username,
          avatar,
          address
        })
        localStorage.setItem('avatar', avatar)
        localStorage.setItem('username', username)
        localStorage.setItem('address', address)
        localStorage.setItem('email', email)
        console.log(response.status);
        resolve()
      } catch (error) {
        console.log(error)
        reject()
      }
    })

    await toast?.promise(
      registerToast,
      {
        success: 'Profile Updated successfully! 👌',
        pending: 'Loading...',
        error: 'Something went wrong! 🤯'
      },
      {
        theme: "dark"
      }
    )
  }

  const loadData = async() => {
    try {
      let response
      let localEmail = localStorage.getItem('email')
      response = await axios.get(`http://localhost:8000/api/user/profile/${localEmail}`)
      console.log(response);
      setEmail(response.data?.user?.email)
      setUsername(response.data?.user?.username)
      setAddress(response.data?.user?.address)
      setAvatar(response.data?.user?.avatar)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    loadData()
    console.log(avatar);
  }, [])


  return (
    <div>
      <h1 className='text-6xl text-green-700 text-center my-2 font-serif hover:text-amber-400 animate-pulse'>Profile</h1>
      <div className='w-full my-10 flex flex-col gap-5 md:flex-row items-center'>
        <div className='w-[75%] md:w-[50%] p-10 flex md:justify-end justify-center'>
          <form className='bg-green-700 p-10 md:w-[75%] w-full rounded-lg'>
            <div className="mb-6">
              <label htmlFor="username" className="block mb-2 text-lg font-medium text-white">Username</label>
              <input type="text" id="username" className='rounded-md w-full p-2 text-black' onChange={(e) => setUsername(e.target?.value)} value={username} />
            </div>
            <div className="mb-6">
              <label htmlFor="email" className="block mb-2 text-lg font-medium text-white">Email</label>
              <input type="text" id="email" className='rounded-md w-full p-2 cursor-not-allowed' value={email} disabled/>
            </div>
            <div className="mb-6">
              <label htmlFor="address" className="block mb-2 text-lg font-medium text-white">Address</label>
              <input type="text" id="address" className='rounded-md w-full p-2 text-black' onChange={(e) => setAddress(e.target?.value)} value={address} />
            </div>
            <div className='mt-12 w-full'>
              <button type='submit' onClick={(e) => updateData(e)} className='w-full px-4 py-2 bg-amber-300 text-green-700 rounded-md block mx-auto'>Save</button>
            </div>
          </form>
        </div>
        <div className='min-h-[300px] flex flex-col justify-center items-start gap-6 w-[50%] p-2'>
          {
            !avatar ? <img src={profile} alt="" className='w-[300px] rounded-lg' /> :
              <img src={avatar} alt="" className='rounded-lg w-[300px]' />
          }
          <Upload uwConfig={{
            cloudName: "dfctm4pei",
            uploadPreset: "jpmc-cfg",
            multipleFiles: false,
            maxImageFileSize: 2000000,
            folder: "avatars",
          }}
            setAvatar={setAvatar} />
        </div>
      </div>
    </div>
  )
}

export default Profile