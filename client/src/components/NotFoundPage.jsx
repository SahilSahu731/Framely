import React from 'react'
import { Link } from 'react-router-dom'

const NotFoundPage = () => {
  return (
    <div className='flex justify-center items-center '>
        <div className='rounded-lg p-5 bg-gray-700 w-1/2 mt-44'>
            <h1 className='text-3xl poppins-medium mb-5 text-white'>
                Not Found Page
            </h1>
            <p className='text-sm text-white'>
                This page is not available.
            </p>
            <button className='mt-8  text-left justify-end bg-sky-800  px-4 py-3 rounded-xl'>
                <Link to='/'>
                    <span className='text-white'>Go back to home</span>
                </Link>
            </button>
        </div>
    </div>
  )
}

export default NotFoundPage
