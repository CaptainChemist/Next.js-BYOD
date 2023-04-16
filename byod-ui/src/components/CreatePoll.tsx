import React, { useState } from 'react';

export type OnPollCreated = (pollText: string, options: string[]) => Promise<void>;

interface CreatePollProps {
  onPollCreated: OnPollCreated;
}

export const CreatePoll: React.FC<CreatePollProps> = ({ onPollCreated }) => {
  const [pollText, setPollText] = useState('');
  const [options, setOptions] = useState(['', '']);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onPollCreated(pollText, options);
    setPollText('');
    setOptions(['', '']);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  const deleteOption = (selectedIdx: number) => {
    const newOptions = options.filter((_, idx) => idx !== selectedIdx);
    if (newOptions.length === 0) {
      setOptions(['']);
    } else {
      setOptions(newOptions);
    }
  };

  return (
    <div className='flex items-center justify-center p-12'>
      <div className='mx-auto w-full max-w-[550px]'>
        <h2 className='text-2xl font-bold mb-6 text-black-500'>Create a New Poll</h2>
        <div className='p-6 rounded-lg shadow-md border border-gray-200'>
          <form onSubmit={handleSubmit}>
            <div className='mb-5'>
              <label htmlFor='pollText' className='mb-3 block text-base font-medium text-black-500'>
                Poll Text
              </label>
              <input
                className='w-full rounded-md border-2 border-gray-300 bg-white py-3 px-6 text-base font-medium text-gray-500 outline-none focus:border-blue-600 focus:shadow-md'
                id='pollText'
                type='text'
                placeholder='Enter poll text'
                value={pollText}
                onChange={e => setPollText(e.target.value)}
              />
            </div>
            {options.map((option, index) => (
              <div key={`option-${index}`} className='mb-5'>
                <label htmlFor={`option-${index}`} className='mb-3 block text-base font-medium text-black-500'>
                  Option {index + 1}
                </label>

                <div key={`option-${index}`} className='mb-5 flex items-center'>
                  <input
                    className='flex-1 rounded-md border-2 border-gray-300 bg-white py-3 px-6 text-base font-medium text-gray-500 outline-none focus:border-blue-600 focus:shadow-md'
                    id={`option-${index}`}
                    type='text'
                    placeholder={`Enter option ${index + 1}`}
                    value={option}
                    onChange={e => handleOptionChange(index, e.target.value)}
                  />
                  <button
                    type='button'
                    className='hover:shadow-form rounded-md bg-red-500 py-3 px-4 text-base font-semibold text-white outline-none ml-2'
                    onClick={() => deleteOption(index)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            <div className='mb-5'>
              <button
                type='button'
                className='w-full hover:shadow-form rounded-md border-blue-600 border-2 border-solid py-2 px-8 text-base font-semibold text-black-500 outline-none'
                onClick={addOption}
              >
                Add Option
              </button>
            </div>

            <div className='mb-5'>
              <button
                type='submit'
                className='w-full hover:shadow-form rounded-md bg-blue-600 py-3 px-8 text-base font-semibold text-white outline-none mr-4'
              >
                Create Poll
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
