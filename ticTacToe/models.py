from django.db import models


class Player(models.Model):
    name = models.CharField(max_length=255)
    email = models.CharField(max_length=255, null=True, blank=True)
    password = models.CharField(max_length=50)
    how_many_victories = models.IntegerField(null=True, blank=True, default=0)
    how_many_matches = models.IntegerField(null=True, blank=True, default=0)

    def __str__(self):
        return self.name


PLAYER_DEFAULT_PK = 1


class Game(models.Model):
    player = models.ManyToManyField(Player, default=PLAYER_DEFAULT_PK)
    player1_movies = models.CharField(max_length=40, null=True, blank=True)   # movimentos do player (armazenados em uma string)
    player2_movies = models.CharField(max_length=40, null=True, blank=True)   # no formato "['0', '0', '0', '0', '0', '0', '0', '0', '0', ]"
    player_champion = models.CharField(max_length=10, null=True, blank=True)  # Options: player1 or player2
    game_date = models.DateTimeField(auto_now_add=True, blank=True)
    playerS_turn = models.CharField(max_length=4, null=True)

    # -------------------------------------------------------------------
    # game_date = models.DateTimeField(auto_now_add=True, blank=True)
    # auto_now_add --> set date with now when the object is first created (for each new record)
    # auto_now --> set date with now when the object is first created or update

    # The auto_now and auto_now_add options will always use the
    # date in the default timezone at the moment of creation or update.
    # -------------------------------------------------------------------
    # game_date = models.DateTimeField(default=datetime.now, blank=True)
    # datetime.now() --> is evaluated when the class is created,
    # not when new record is being added to the database.
    # To achieve what you want define this field as:
    # -------------------------------------------------------------------

    #def __str__(self):
    #    return self.game_date, self.player.name

