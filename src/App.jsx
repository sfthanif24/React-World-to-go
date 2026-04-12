import React, { Suspense } from "react";
import Countries from "./components/Countries/Countries";

const countriesPromise = fetch(
  "https://openapi.programming-hero.com/api/all",
).then((res) => res.json());
const App = () => {
  return (
    <>
      <Suspense fallback={<h1>Loading...</h1>}>
        <Countries countriesPromise={countriesPromise}></Countries>
      </Suspense>
    </>
  );
};

export default App;
