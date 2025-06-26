# Dope Control

Dope Control is a web application that helps you track your habits and earn rewards for them. It's built with the T3 Stack and allows you to create habits, assign points to them, and see your progress over time.

## Why I Built This

I created this project to implement a rewards-based system for my daily habits. The idea is to have a clear indicator of when I've earned some time for fun activities by accumulating points from my productive habits.

## Features

- **Habit Tracking:** Create, manage, and track your daily habits.
- **Points System:** Assign points to your habits and earn them upon completion.
- **User Authentication:** Sign in with your Google account to keep your habits synced.
- **Post Creation:** Create posts to share your progress or thoughts.

## Tech Stack

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Drizzle](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or later)
- pnpm

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/anujjoshi63/dopecontrol.git
   ```
2. Install NPM packages
   ```sh
   pnpm install
   ```
3. Set up your environment variables by copying the `.env.example` file to `.env` and filling in the required values.
   ```sh
   cp .env.example .env
   ```
4. Run the development server
   ```sh
   pnpm dev
   ```

## Deployment

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.