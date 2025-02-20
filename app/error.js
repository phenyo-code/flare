"use client";

import React from 'react'
import { useEffect, useState } from 'react';
import { FaRegSadTear, FaExclamationTriangle } from 'react-icons/fa';
import { AiOutlineCheckCircle } from 'react-icons/ai';

export default function ErrorPage({ statusCode, error }) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="mb-4">
          {statusCode === 404 ? (
            <FaRegSadTear className="text-red-500 text-6xl mx-auto" />
          ) : statusCode === 500 ? (
            <FaExclamationTriangle className="text-yellow-500 text-6xl mx-auto" />
          ) : (
            <AiOutlineCheckCircle className="text-green-500 text-6xl mx-auto" />
          )}
        </div>

        <h1 className="text-2xl font-semibold mb-2">
          {statusCode === 404
            ? 'Page Not Found'
            : statusCode === 500
            ? 'Internal Server Error'
            : 'An Unknown Error Occurred'}
        </h1>

        <p className="text-gray-600">
          {error?.message || 'Please try again later.'}
        </p>

        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
