import { gql } from '@apollo/client';

export const CREATE_POLL = gql`
  mutation CreatePoll($text: String!, $options: [String!]!) {
    createPoll(text: $text, options: $options) {
      id
      text
      options {
        id
        answer
        voteCount
        currentUserVoted
      }
    }
  }
`;

export const CAST_VOTE = gql`
  mutation CastVote($optionId: String!) {
    castVote(optionId: $optionId) {
      id
    }
  }
`;

export const POLLS = gql`
  query {
    polls {
      id
      text
      createdAt
      options {
        id
        answer
        createdAt
        pollId
        currentUserVoted
        voteCount
      }
    }
  }
`;
