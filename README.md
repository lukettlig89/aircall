# TestAircall

## Development

Run `yarn start` for a dev server. Navigate to `http://localhost:4200/`.
The app will automatically reload if you change any of the source files.

## Build

Run `yarn build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `yarn test` to execute the unit tests via Jest.

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Routes
The UI has 3 different routes: 

- / - first page of the app
- /calls - landing page after log in. It is protected by AuthGuard (user needs to authenticate).
- /call - details of a single call. It is protected by AuthGuard (user needs to authenticate).

## Project structure

The project has been made with Angular 11.

- /components - all the components used in the project (hierarchical inclusion).
- /core - folder containing all the configs, guards, interceptors, models, shared utils and services.
- /store - folder containing the ngRx store (reducers, effects, selectors and actions). The store is accessible trough a facade that mask the implementation to the consumer (app).
  
This project has been generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.1.1.

## Rest calls

All interactions with the backend are done by passing through the ngRx store. 
The component dispatch an action and through a side effect the rest call will be performed, the data will be pushed in the state, and the selectors will propagate the data to the presentational components.
In case the call returns an error this will be catch and notified to the ui trough the ErrorService.

Note: JWT token received from the backend will be injected through an interceptor which intercepts all the http requests and inject the token if the request is not the login one.
In case where the token expired the interceptor will perform a new login in order to retrieve the new token (which will be added to the state as well).
