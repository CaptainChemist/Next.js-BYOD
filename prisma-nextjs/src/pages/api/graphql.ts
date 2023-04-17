import { createYoga } from 'graphql-yoga';
import SchemaBuilder from '@pothos/core';
import PrismaPlugin from '@pothos/plugin-prisma';
import type PrismaTypes from '@pothos/plugin-prisma/generated';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';

import prisma from '../../lib/prisma';
import { authOptions } from './auth/[...nextauth]';
import { User } from '@prisma/client';

type Context = {
  currentUser: User | null;
};

async function createContext({ req, res }: { req: NextApiRequest; res: NextApiResponse }) {
  const session = await getServerSession(req, res, authOptions);

  let currentUser = null;
  if (session?.user?.email) {
    currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
  }

  return { currentUser };
}

const builder = new SchemaBuilder<{ PrismaTypes: PrismaTypes }>({
  plugins: [PrismaPlugin],
  prisma: {
    client: prisma,
  },
});

builder.queryType({});
builder.mutationType({});

builder.prismaObject('User', {
  fields: t => ({
    id: t.exposeID('id'),
    email: t.exposeString('email'),
    name: t.exposeString('name', { nullable: true }),
    createdAt: t.field({
      type: 'String',
      resolve: user => user.createdAt.toISOString(),
    }),
    votes: t.relation('votes'),
  }),
});

builder.prismaObject('Poll', {
  fields: t => ({
    id: t.exposeID('id'),
    text: t.exposeString('text'),
    createdAt: t.field({
      type: 'String',
      resolve: user => user.createdAt.toISOString(),
    }),
    options: t.relation('options'),
  }),
});

builder.prismaObject('Option', {
  fields: t => ({
    id: t.exposeID('id'),
    answer: t.exposeString('answer'),
    createdAt: t.field({
      type: 'String',
      resolve: user => user.createdAt.toISOString(),
    }),
    poll: t.relation('poll'),
    pollId: t.exposeID('pollId'),
    votes: t.relation('votes'),
    currentUserVoted: t.field({
      type: 'Boolean',
      resolve: async (parent, _args, context) => {
        const ctx = context as Context;
        if (ctx?.currentUser) {
          const votes = await prisma.vote.findMany({
            where: { userId: ctx.currentUser.id, optionId: parent.id },
          });
          return votes.length > 0;
        }
        return false;
      },
    }),
    voteCount: t.field({
      type: 'Int',
      resolve: async (parent, _args, _context) => {
        const votes = await prisma.vote.findMany({
          where: { optionId: parent.id },
        });
        return votes.length;
      },
    }),
  }),
});

builder.prismaObject('Vote', {
  fields: t => ({
    id: t.exposeID('id'),
    createdAt: t.field({
      type: 'String',
      resolve: user => user.createdAt.toISOString(),
    }),
    user: t.relation('user'),
    userId: t.exposeID('userId'),
    option: t.relation('option'),
    optionId: t.exposeID('optionId'),
  }),
});

builder.queryField('polls', t =>
  t.prismaField({
    type: ['Poll'],
    resolve: async (query, _parent, _args) => prisma.poll.findMany({ ...query }),
  })
);

builder.mutationField('createPoll', t =>
  t.prismaField({
    type: ['Poll'],
    args: {
      text: t.arg.string({ required: true }),
      options: t.arg.stringList({ required: true }),
    },
    resolve: async (query, _parent, args) => {
      const { text, options } = args;

      const poll = await prisma.poll.create({
        data: {
          text,
          options: {
            createMany: {
              data: options.map(option => ({ answer: option })),
            },
          },
        },
        include: {
          options: true,
        },
      });

      return [poll];
    },
  })
);

builder.mutationField('castVote', t =>
  t.prismaField({
    type: ['Vote'],
    args: {
      optionId: t.arg.string({ required: true }),
    },
    resolve: async (_query, _parent, args, context) => {
      const ctx = context as Context;
      if (ctx?.currentUser?.id) {
        const { optionId } = args;
        const vote = await prisma.vote.create({
          data: { optionId, userId: ctx.currentUser.id },
        });

        return vote ? [vote] : [];
      }
      return [];
    },
  })
);

const schema = builder.toSchema();

export default createYoga<{
  req: NextApiRequest;
  res: NextApiResponse;
}>({
  schema,
  graphqlEndpoint: '/api/graphql',
  context: createContext,
});

export const config = {
  api: {
    bodyParser: false,
  },
};
