import json

from django.http import HttpResponse

from django.views.generic import TemplateView

from hangman.models import HangmanGame


class HangmanView(TemplateView):
    template_name = "hangman/index.html"


def get_words(request):
    words = list(HangmanGame.objects.filter(level='childhood').values('word', 'tip'))  # or simply .values() to get all fields
    return HttpResponse(
        json.dumps(words),
        content_type="application/json"
    )