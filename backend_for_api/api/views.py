from django.core.cache import cache
import os
from rest_framework.response import Response
from rest_framework.views import APIView
import requests

API_KEY = os.getenv("API_KEY")
BASE_URL = os.getenv("BASE_URL")

class HolidayView(APIView):
    def get(self, request):
        country = request.GET.get("country", "US")
        year = request.GET.get("year", "2024")
        month = request.GET.get("month", None)
        search = request.GET.get("search", None)
        holiday_type = request.GET.get("type", None)  
        cache_key = f"holidays_{country}_{year}_{month or 'all'}_{holiday_type or 'all'}_{search or 'all'}"
        cached_data = cache.get(cache_key)
        if cached_data:
            print("Data retrieved from cache:", cache_key)
            return Response(cached_data)

       
        api_url = f"{BASE_URL}?api_key={API_KEY}&country={country}&year={year}"
        if month:
            api_url += f"&month={month}"
        if holiday_type:
            api_url += f"&type={holiday_type}"

        try:
            response = requests.get(api_url, timeout=10)
            print("API Response Status:", response.status_code)
            print("API Response Content:", response.text)

            json_data = response.json()
            holidays = json_data.get("response", {}).get("holidays", [])
            if search:
                holidays = [h for h in holidays if search.lower() in h["name"].lower()]  
            cache.set(cache_key, holidays, timeout=86400)
            print("Data cached successfully:", cache_key)
            return Response(holidays)

        except requests.exceptions.RequestException as e:
            print("API Request Failed:", str(e))
            return Response({"error": "Failed to fetch data from Calendarific API"}, status=500)
