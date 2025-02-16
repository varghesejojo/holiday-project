import axios from 'axios';

export const fetchHolidays = async (country, year, month, search, type) => {
    try {
        const params = {
            country,
            year,
            ...(month && { month }),   
            ...(search && { search }), 
            ...(type && { type })      
        };

        const response = await axios.get("http://127.0.0.1:8000/holidays/", { params });

        console.log(response.data, "data from backend");
        return response.data;
    } catch (error) {
        console.error("Error fetching holidays:", error);
        return [];
    }
};
