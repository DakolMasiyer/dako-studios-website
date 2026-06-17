# Real Estate Infrastructure Template

Welcome to the Real Estate Infrastructure Template! This project is built using Next.js, TypeScript, Sanity.io, and TailwindCSS. This template serves as the base for creating advanced real estate websites that deliver high-quality user experiences.

## Project Overview

- Next.js: A React.js framework for building JavaScript-based web applications.
- TypeScript: A statically typed superset of JavaScript that brings optional static types to your code.
- Sanity.io: A platform for structured content that allows you to manage and distribute digital content to any device or channel.
- TailwindCSS: A utility-first CSS framework for rapidly building custom user interfaces.
- Zustand: A small, fast, and scalable state management library for React.js.
- Framer Motion: A production-ready motion library for React.js.

## How to Use

1. Clone this repository to your local machine using `git clone <repo_url>`.
2. Navigate to the project folder using `cd <project_folder>`.
3. Install the dependencies with `yarn install`.
4. Start the local development server with `yarn run dev`.
5. The application will launch a local server at `localhost:3000`.

## Folder Structure

- `components/`: This directory contains all the reusable components used across different pages.
- `app/`: Here you can find the app directory components.
- `styles/`: This directory contains all global styles.
- `sanity/`: This directory houses the configuration and schema for Sanity.io.
- `lib/`: This is where we keep utility functions, custom hooks, and library code.

## Working with Sanity.io

To interact with Sanity.io, you need to set up a Sanity project. Follow these steps:

1. Create a new Sanity project at [https://www.sanity.io/get-started](https://www.sanity.io/get-started).
2. As the setup has been completed on this use the default dataset but don't create any folders, etc or run the `npm create sanity@latest` command.
3. Copy your Sanity project ID and dataset name from the Sanity dashboard to a new `.env.local` file in the root of the project. Feel free to use the `example.env.local` file as a template.
4. If you want to use the Google Maps selection component in the Sanity Studio get your [Google Maps API Key](https://developers.google.com/maps/documentation/javascript/get-api-key) and add this to the `.env.local`.
5. After running your dev/production server you can navigate to `/studio` to access the Sanity Studio.
6. You may be prompted to setup CORS so just follow the prompts.
7. You can now add content to your Sanity project and it will be available in your Next.js application.

## Draft Mode (Previously _Preview Mode_)

There are two API routes for entering and leaving preview mode. These are `/api/preview` and `/api/preview-exit`. These routes are used by the Sanity Studio to enter and leave preview mode. You can also use these routes to enter and leave preview mode manually.

## Building for Production

To create a production build of your application, run `yarn run build`. The output will be in the `.next/` directory.

## Deployment

The project is ready to be deployed with any provider that supports Next.js, such as Vercel or Netlify.

## Contributing

Contributions are welcome. Please fork this repository and create a pull request with your changes.

## License

This project is licensed under the MIT License - see the `LICENSE.md` file for details.
