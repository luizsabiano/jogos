from django import forms

from ticTacToe.models import Player


class PlayerForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput())

    class Meta:
        model = Player
        fields = '__all__'