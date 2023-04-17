import { useSession, signIn } from 'next-auth/react';
import { CreatePoll, Login, LoginClicked, OnOptionClick, OnPollCreated, PollList } from 'byod-ui';
import { useCallback } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { CAST_VOTE, CREATE_POLL, POLLS } from '@/lib/gql-calls';

export default function Home() {
  const { status } = useSession();
  const { data: pollsData, loading: pollsLoading, error: pollsError } = useQuery(POLLS);
  const [createPoll] = useMutation(CREATE_POLL, { refetchQueries: [POLLS] });
  const [castVote] = useMutation(CAST_VOTE, { refetchQueries: [POLLS] });

  const handleCreatePoll: OnPollCreated = useCallback(
    async (pollText, options) => {
      console.log('Poll created:', pollText, options);
      try {
        const response = await createPoll({
          variables: {
            text: pollText,
            options,
          },
        });

        console.log('Poll created:', response.data.createPoll);
      } catch (err) {
        console.error('Error creating poll:', err);
      }
    },
    [createPoll]
  );

  const handleOptionClick: OnOptionClick = useCallback(
    async (pollId, optionId) => {
      console.log('Vote cast:', pollId, optionId);
      try {
        const response = await castVote({
          variables: {
            optionId,
          },
        });

        console.log('Vote cast:', response.data.voteCast);
      } catch (err) {
        console.error('Error casting vote:', err);
      }
    },
    [castVote]
  );

  const signInClicked: LoginClicked = () => {
    signIn();
  };

  return (
    <div>
      {status === 'loading' ||
        (status === 'unauthenticated' && (
          <Login>
            <button
              onClick={() => signInClicked()}
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
            >
              Sign in
            </button>
          </Login>
        ))}
      {status === 'authenticated' && (
        <>
          <PollList
            polls={pollsData?.polls || []}
            loading={pollsLoading}
            error={pollsError ? true : false}
            onOptionClick={handleOptionClick}
          />
          <CreatePoll onPollCreated={handleCreatePoll} />
        </>
      )}
    </div>
  );
}
