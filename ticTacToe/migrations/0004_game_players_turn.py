# Generated by Django 3.2 on 2021-04-17 16:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ticTacToe', '0003_alter_game_player'),
    ]

    operations = [
        migrations.AddField(
            model_name='game',
            name='playerS_turn',
            field=models.CharField(max_length=4, null=True),
        ),
    ]
