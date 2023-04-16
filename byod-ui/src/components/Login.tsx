import React from 'react';

export type LoginClicked = () => void;

interface LoginProps {
  children: React.ReactNode;
}

export const Login: React.FC<LoginProps> = ({ children }) => {
  return (
    <div className='min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12'>
      <div className='relative py-3 sm:max-w-xl sm:mx-auto'>
        <div className='absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl'></div>
        <div className='relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20'>
          <h1 className='text-4xl font-bold mb-4'>Welcome to the Polls App</h1>
          <div>
            <p className='text-xl mb-4'>Please sign in to create and participate in polls.</p>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
