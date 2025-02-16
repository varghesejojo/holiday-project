import React from "react";
import HolidayList from "./UI/HolidayList";


function App() {
    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-center mb-6">Holiday Management App</h1>
            <HolidayList/>
        </div>
    );
}

export default App;
