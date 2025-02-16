from django.urls import include, path
from . views import *
urlpatterns = [
    path('holidays/',HolidayView.as_view(),name='holidays')
]