from django.db import models


LEVEL_CHOICES = (
    ('childhood', 'Infância'),
    ('adolescence', 'Adolecência'),
    ('adult', 'Adulto'),
)


class HangmanGame(models.Model):
    word = models.CharField(max_length=255)
    level = models.CharField(max_length=15, choices=LEVEL_CHOICES)
    tip = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return self.word
