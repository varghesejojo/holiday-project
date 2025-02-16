import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { Dialog } from '@headlessui/react';
import { X, Search, Calendar, Loader2 } from 'lucide-react';
import { fetchHolidays } from '../api/api';

const HolidayList = () => {
  const [country, setCountry] = useState({ value: 'US', label: 'United States' });
  const [year, setYear] = useState({ value: '2024', label: '2024' });
  const [month, setMonth] = useState(null);
  const [search, setSearch] = useState('');
  const [holidays, setHolidays] = useState([]);
  const [modalHoliday, setModalHoliday] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [holidayType, setHolidayType] = useState(null);

  const ITEMS_PER_PAGE = 10;
  const customStyles = {
    option: (baseStyles, state) => ({
      ...baseStyles,
      color: 'black',
      backgroundColor: state.isFocused ? '#f3f4f6' : 'white',
      '&:hover': {
        backgroundColor: '#f3f4f6'
      }
    }),
    menu: (baseStyles) => ({
      ...baseStyles,
      backgroundColor: 'white'
    }),
    control: (baseStyles) => ({
      ...baseStyles,
      backgroundColor: 'transparent',
      borderColor: '#d1d5db',
      '&:hover': { borderColor: '#9ca3af' }
    }),
    singleValue: (baseStyles) => ({
      ...baseStyles,
      color: 'black'
    })
  };
  

  const countries = [
    { value: 'US', label: 'United States' },
    { value: 'IN', label: 'India' },
    { value: 'GB', label: 'United Kingdom' },
    { value: 'CA', label: 'Canada' },
    { value: 'AU', label: 'Australia' }
  ];

  const years = Array.from({ length: 5 }, (_, i) => {
    const yearValue = `${2024 - i}`;
    return { value: yearValue, label: yearValue };
  });

  const months = Array.from({ length: 12 }, (_, i) => {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
    return { value: `${i + 1}`, label: monthNames[i] };
  });

  const holidayTypes = [
    { value: "national", label: "National Holiday" },
    { value: "local", label: "Local Holiday" },
    { value: "religious", label: "Religious Holiday" },
    { value: "observance", label: "Observance" }
  ];
  
  

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError(null);
  
      console.log("Selected Holiday Type:", holidayType?.value); // Debugging log
  
      const data = await fetchHolidays(
        country.value,
        year.value,
        month?.value,
        search,
        holidayType?.value  
      );
  
      console.log("Received Data:", data);
  
      if (!Array.isArray(data)) {
        throw new Error("Invalid API response format");
      }
  
      setHolidays(data);
      setCurrentPage(1);
    } catch (err) {
      console.error("API Fetch Error:", err);
      setError("Failed to fetch holidays. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  
  

  // Pagination logic
  const totalPages = Math.ceil(holidays.length / ITEMS_PER_PAGE);
  const paginatedHolidays = holidays.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const isFormValid = country && year;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Holiday Calendar</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <Select
              options={countries}
              value={country}
              onChange={setCountry} 
               styles={customStyles}
              className="w-full"
              placeholder="Select Country"
            />
           
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <Select
              options={years}
              value={year}
              onChange={setYear}               
              styles={customStyles}
              className="w-full"
              placeholder="Select Year"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Month (Optional)</label>
            <Select
              options={months}
              value={month}
              onChange={setMonth}
              styles={customStyles}
              isClearable
              className="w-full"
              placeholder="Select Month"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-1">Holiday Type (Optional)</label>
            <Select
              options={holidayTypes}
              value={holidayType}
              onChange={setHolidayType}
              styles={customStyles}
              isClearable
              className="w-full"
              placeholder="Holiday Type"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search holidays..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && isFormValid) {
                  handleSearch();
                }
              }}
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={!isFormValid || loading}
            className={`px-6 py-2 rounded-lg flex items-center gap-2 ${
              isFormValid && !loading
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-gray-300 cursor-not-allowed text-gray-500'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Searching...
              </>
            ) : (
              <>
                <Search size={20} />
                Search
              </>
            )}
          </button>
        </div>

        {/* Required Fields Note */}
        <p className="text-sm text-gray-500 mt-2">
          * Country and Year are required
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Results Section */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
        </div>
      ) : (
        <>
          {/* Results Count */}
          {holidays.length > 0 && (
            <p className="text-gray-600 mb-4">
              Found {holidays.length} holidays
            </p>
          )}

          {/* Holiday Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {paginatedHolidays.map((holiday) => (
              <div
                key={`${holiday.name}-${holiday.date.iso}`}
                className="border rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow bg-white"
                onClick={() => setModalHoliday(holiday)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{holiday.name}</h3>
                    <p className="text-gray-600">{holiday.date.iso}</p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {holiday.type}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* No Results Message */}
          {holidays.length === 0 && !loading && (
            <div className="text-center py-12 text-gray-500">
              No holidays found. Try adjusting your search criteria.
            </div>
          )}

          {/* Pagination */}
{totalPages > 1 && (
  <div className="flex justify-center items-center space-x-2 mt-6">
    {/* Previous Button */}
    <button
      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
      disabled={currentPage === 1}
      className={`px-4 py-2 rounded-lg border ${
        currentPage === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"
      }`}
    >
      Previous
    </button>

    {/* Page Numbers with Ellipsis */}
    {Array.from({ length: totalPages }, (_, i) => i + 1)
      .filter((page) => page === 1 || page === totalPages || (page >= currentPage - 2 && page <= currentPage + 2))
      .map((page, index, arr) => (
        <React.Fragment key={page}>
          {index > 0 && page !== arr[index - 1] + 1 && <span className="px-2">...</span>}
          <button
            onClick={() => setCurrentPage(page)}
            className={`px-4 py-2 rounded-lg border ${
              currentPage === page ? "bg-blue-600 text-white font-bold" : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {page}
          </button>
        </React.Fragment>
      ))}

    {/* Next Button */}
    <button
      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
      disabled={currentPage === totalPages}
      className={`px-4 py-2 rounded-lg border ${
        currentPage === totalPages ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"
      }`}
    >
      Next
    </button>
  </div>
)}

        </>
      )}

      {/* Holiday Detail Modal */}
      {modalHoliday && (
        <Dialog
          open={!!modalHoliday}
          onClose={() => setModalHoliday(null)}
          className="fixed inset-0 z-50 overflow-y-auto"
        >
          <div className="flex items-center justify-center min-h-screen p-4">
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
            
            <div className="relative bg-white rounded-lg max-w-lg w-full p-6">
              <button
                onClick={() => setModalHoliday(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
              
              <div className="mb-4">
                <h3 className="text-2xl font-bold">{modalHoliday.name}</h3>
                <div className="flex items-center gap-2 text-gray-600 mt-2">
                  <Calendar size={16} />
                  <span>{modalHoliday.date.iso}</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold">Description</h4>
                  <p className="text-gray-600">{modalHoliday.description || 'No description available.'}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold">Type</h4>
                  <p className="text-gray-600 capitalize">{modalHoliday.type}</p>
                </div>
              </div>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default HolidayList;
