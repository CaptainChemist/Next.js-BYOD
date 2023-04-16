import React from 'react';

export interface Option {
  id: string;
  answer: string;
  voteCount: number;
  currentUserVoted: boolean;
}

export interface Poll {
  id: string;
  text: string;
  options: Option[];
}

export type OnOptionClick = (pollId: string, optionId: string) => Promise<void>;

interface PollListProps {
  polls: Poll[];
  onOptionClick: OnOptionClick;
  loading: boolean;
  error: boolean;
}

export const PollList: React.FC<PollListProps> = ({ polls, onOptionClick, loading, error }) => {
  return (
    <div className='flex items-center justify-center p-12'>
      <div className='mx-auto w-full max-w-[550px] space-y-8'>
        <h2 className='text-2xl font-bold mb-6 text-black-500'>Current Polls</h2>
        {loading ? <p>Loading...</p> : null}
        {error ? <p>Error</p> : null}
        {!loading && !error
          ? polls.map(poll => {
              const userHasVoted = poll.options.some(option => option.currentUserVoted);
              const totalVotes = poll.options.reduce((sum, o) => sum + o.voteCount, 0);

              return (
                <div key={poll.id} className='bg-white p-6 rounded-lg shadow-md border border-gray-200'>
                  <h3 className='text-2xl font-semibold mb-4'>{poll.text}</h3>
                  <ul className='space-y-4'>
                    {poll.options.map(option => {
                      const votePercentage = (option.voteCount / totalVotes) * 100;
                      const borderColor = option.currentUserVoted ? 'border-blue-600' : 'border-gray-300';

                      return (
                        <li key={option.id} className='flex flex-col'>
                          {!userHasVoted && (
                            <label
                              className={`flex items-center justify-between p-4 border-2 ${borderColor} rounded-md cursor-pointer hover:border-gray-400`}
                              onClick={() => onOptionClick(poll.id, option.id)}
                            >
                              <span className='text-lg'>{option.answer}</span>
                            </label>
                          )}
                          {userHasVoted && (
                            <div>
                              <div
                                className={`flex items-center justify-between p-4 border-2 ${borderColor} rounded-md`}
                              >
                                <span className='text-lg'>{option.answer}</span>
                                <span className='text-gray-600'>{option.voteCount} votes</span>
                                <span className='text-blue-600'>{Math.round(votePercentage)}%</span>
                              </div>
                              <div className='h-2 mt-2 bg-gray-300 rounded-full'>
                                <div
                                  className='h-full bg-blue-600 rounded-full'
                                  style={{ width: `${Math.round(votePercentage)}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })
          : null}
      </div>
    </div>
  );
};
