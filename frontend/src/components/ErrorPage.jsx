import React from 'react'
import { useRouteError } from 'react-router-dom'

function ErrorPage() {
    let routingError = useRouteError();
    return (
        <div className='text-center h-screen bg-amber-400 p-5 rounded-md flex justify-center items-center flex-col'>
            <h1 className='text-red-600 text-3xl'>Error!</h1>
            <h1 className='text-red-600 text-xl'>{routingError.status}-{routingError.data}</h1>
        </div>
    )
}

export default ErrorPage