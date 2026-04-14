# Explore the World

A React application built with Vite for exploring different countries, viewing their details, and planning or tracking visits.

## About the Project

"Explore the World" is a comprehensive learning and tracking platform for global geography. It fetches dynamic country data (like flags, population, and currencies) to render interactive geography cards. Users can seamlessly search for specific nations, filter details, and interactively build a personalized travel portfolio.
The application logic features:

- **Travel Tracking**: Using local storage (`travelStorage.js`), the application persists your "Visited" and "Planned" countries across sessions, displaying them effectively on a dedicated Profile tab.
- **Theme Management**: Employs React Context (`ThemeContext.jsx`) to provide a global dark/light mode toggle that updates UI elements consistently.
- **Interactive UI**: Contains a tailored user interface featuring specialized components like Navigation, Hero section, and dynamically generated layout lists.

## Features

- Browse and search for countries around the world
- View detailed country information (flags, capitals, population, currencies, etc.)
- Mark countries as visited or add them to your planned trips
- Track your travel progress on the Profile page

## Tech Stack

- Frontend: React (with Vite)
- Styling: Custom CSS
- Routing: React Router
- Data: LocalStorage for persisting travel plans and visits

## Running the Application

To run the application locally:

```bash
npm install
npm run dev
```

## Project Structure

```text
Explore the World/
├── public/                # Static assets
│   └── world.avif
├── src/                   # Source files
│   ├── components/        # Reusable UI components
│   │   ├── ChatBot/
│   │   ├── Countries/
│   │   ├── Country/
│   │   ├── Footer/
│   │   ├── Hero/
│   │   ├── Layout/
│   │   └── Navigation/
│   ├── context/           # React context provider (ThemeContext)
│   ├── pages/             # Route mapping pages
│   │   ├── CountriesPage.jsx
│   │   ├── HomePage.jsx
│   │   └── ProfilePage.jsx
│   ├── utils/             # Helper utilities (travelStorage.js)
│   ├── App.jsx            # Main app router
│   ├── main.jsx           # App entry point
│   └── index.css          # Global styling
├── eslint.config.js
├── package.json
└── vite.config.js
```
