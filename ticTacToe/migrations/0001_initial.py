# Generated by Django 3.2 on 2021-04-15 22:46

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Player',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('email', models.CharField(blank=True, max_length=255, null=True)),
                ('password', models.CharField(max_length=50)),
                ('how_many_victories', models.IntegerField(blank=True, default=0, null=True)),
                ('how_many_matches', models.IntegerField(blank=True, default=0, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Game',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('player1_movies', models.CharField(max_length=40)),
                ('player2_movies', models.CharField(max_length=40)),
                ('player_champion', models.CharField(max_length=10)),
                ('game_date', models.DateTimeField(auto_now_add=True)),
                ('player', models.ManyToManyField(to='ticTacToe.Player')),
            ],
        ),
    ]
