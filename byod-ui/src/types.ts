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
