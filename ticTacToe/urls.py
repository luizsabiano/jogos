from django.conf.urls import url
from django.urls import path

from ticTacToe.views import OneHostView, TwoHostsView, game

urlpatterns = [
    path('one_host/', OneHostView.as_view(), name='ticTacToe_one_host'),
    path('two_hosts/', TwoHostsView.as_view(), name='ticTacToe_two_hosts'),
    url(r'^two_hosts/game/', game, name='game'),
]
