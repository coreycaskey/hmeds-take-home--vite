# Henry Meds Assessment - Web Application

This repository contains the client-side Single Page Application (SPA) for the Henry Meds assessment.

It permits you to assume one of two roles: `Provider` or `Client`. The specific `Provider` or `Client` you use is hardcoded in the application via its associated GUID in the mock database. Setting up authentication and permission roles seemed beyond the scope of the assessment, but would be a useful and immediate addition were this to go to production.

The `Provider` has the ability to:

- Navigate through a work calendar
- Select a date to either (1) set their start and end hours for that day or (2) view their existing schedule and any appointments for that day

The `Client` has the ability to:

- View their available providers
- Navigate through the work calendar of a specific provider
- Select a date to either (1) view their existing appointment(s) for that day and `Provider` or (2) schedule an appointment from a `Provider`'s availability

## Technologies

This project is built with:

- [Vite](https://vitejs.dev/)
- [Redux Toolkit Query](https://redux-toolkit.js.org/rtk-query/overview)
- [Material UI](https://mui.com/material-ui/)
- [useHooks-ts](https://usehooks-ts.com/)
- [DayJs](https://day.js.org/)

Vite has become a widely used build tool, especially for React SPAs now that Create React App (CRA) has been "deprecated". The use of Redux Toolkit (Query) and Material UI was to mirror the tech stack of Henry Meds and gain a better understanding of their implementations. useHooks-ts and DayJs are third-party libraries to simplify some logic related to date / time checking.

## Future Considerations

There are some notes sprinkled throughout the application of items I would return to in the future, but the following highlights some of the larger considerations:

- Account login / authentication for `Provider`s and `Client`s
- More fleshed out theming (e.g. colors, customization, etc.)
- Race conditions that may arise with many users on the platform (e.g. `Client` A confirming a time slot that `Client` B just confirmed before them)
- Integrating client-side routing with [React Router](https://reactrouter.com/en/main) to avoid navigation via buttons and to move querying to `loader` calls which will prevent waterfall UI
- Integrating a SSR framework, like [Remix](https://remix.run/), which React Router is based on, to take advantage of `loader` calls that can access the DB directly, instead of calling APIs

## Tradeoffs / Assumptions

- I established a 15 minute increment for the Provider schedule to simplify the creation of time slots for `Client`s
- I didn't store the active user ID in a Redux global store (instead opting for prop drilling) just for immediate simplicity, but definitely a change I would consider in hindsight
- I opted for RTK Query for purposes of familiarizing myself with Redux more, but because it wasn't an app with heavy global state, I might've opted for [React Query](https://tanstack.com/query/latest/docs/framework/react/overview) or React Router `loader`s as mentioned above (if routing was added) in hindsight

## Known Issues

There are some persisting issues with cache invalidation in the RTK Queries that I was unable to figure out in reasonable time (e.g. after confirming an appointment, you would expect that list to update but it doesn't until a hard refresh is done).

## Running

The following terminal commands should get you up and running. This application runs on Node v21.7.1, so the first two commands will get you on that version.

- `nvm install`
- `nvm use`
- `npm i`
- `npm run dev`

This will kick off the local server. The application will render an error UI after navigating into one of the assumed roles if you do not have the Node.js Express server running locally as well.

[See Express Instructions]()

## Available Types

```TypeScript
export type DayJS = dayjs.Dayjs;

export interface Provider {
  id: string;
  name: string;
  profile: string;
}

export interface Client {
  id: string;
  name: string;
  profile: string;
}

export interface Availability {
  providerId: string;
  date: string;
  timeSlot: TimeSlot;
}

export interface AppointmentRequest {
  providerId: string;
  clientId: string;
  date: string;
  timeSlot: TimeSlot;
}

export interface Appointment {
  id: string;
  provider: Provider;
  client: Client;
  date: string;
  timeSlot: TimeSlot;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
}

export interface WorkHours {
  startTime: string | undefined;
  endTime: string | undefined;
}

export const Persona = {
  Provider: 'Provider',
  Client: 'Client',
} as const;

export type Persona = (typeof Persona)[keyof typeof Persona];
```

....

Happy Running! 👋
