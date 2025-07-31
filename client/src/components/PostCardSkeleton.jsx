import React from 'react'

const PostCardSkeleton = () => {
  return (
     <div className="w-full max-w-md mx-auto bg-gray-800 rounded-xl shadow-md overflow-hidden md:max-w-2xl mb-6">
      <div className="animate-pulse">
        {/* Header */}
        <div className="p-4 flex items-center">
          <div className="h-10 w-10 bg-gray-700 rounded-full"></div>
          <div className="ml-3 h-4 w-1/4 bg-gray-700 rounded"></div>
        </div>
        {/* Image */}
        <div className="w-full h-96 bg-gray-700"></div>
        {/* Actions and Caption */}
        <div className="p-4">
          <div className="h-6 w-1/3 bg-gray-700 rounded"></div>
          <div className="mt-3 h-4 w-full bg-gray-700 rounded"></div>
          <div className="mt-2 h-4 w-3/4 bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  )
}

export default PostCardSkeleton
