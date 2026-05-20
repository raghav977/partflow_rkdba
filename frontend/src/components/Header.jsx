import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Header = ({
  title,
  desc,
  linkhref = null,
  buttonText = 'Add New',
  onClick = null,
  backLink = null,
}) => {
  const navigate = useNavigate()

  const handleBack = () => {
    if (backLink) {
      navigate(backLink)
    } else {
      navigate(-1)
    }
  }

  return (
    <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        
        {/* Left Side */}
        <div className="space-y-2">
          {/* Back Button */}
          {backLink !== null && (
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              <span>←</span>
              Back
            </button>
          )}

          {/* Title */}
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {title}
            </h1>

            {desc && (
              <p className="mt-1 text-sm text-gray-500">
                {desc}
              </p>
            )}
          </div>
        </div>

        {/* Right Side */}
        <div className="flex flex-wrap items-center gap-3">
          {linkhref && (
            <Link
              to={linkhref}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              <span className="text-base">＋</span>
              {buttonText}
            </Link>
          )}

          {!linkhref && onClick && (
            <button
              onClick={onClick}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              <span className="text-base">＋</span>
              {buttonText}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Header