from django.conf.urls import url
from django.urls import path

from hangman.views import HangmanView, get_words

urlpatterns = [
    path('', HangmanView.as_view(), name='hangman'),
    url(r'^getwords/', get_words, name='game'),
]
