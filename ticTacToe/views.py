import json

from django.http import HttpResponse
from django.views.generic import TemplateView

from ticTacToe.models import Player, Game


class IndexHostView(TemplateView):
    template_name = "ticTacToe/index.html"


# Apenas carrega um tamplate
class OneHostView(TemplateView):
    template_name = "ticTacToe/one_host.html"


# Apenas carrega um tamplate
class TwoHostsView(TemplateView):
    template_name = "ticTacToe/two_hosts.html"


# Entry a list of integer e return a string
# to save on bd
def list_int_to_string(list_of_ints):
    list_of_strings = [str(integer) for integer in list_of_ints]
    string_of_ints = ",".join(list_of_strings)
    return string_of_ints


# Python code to convert string to integer list
# to restore from bd
def string_to_list_of_integer(string):
    li = list(string.split(","))  # list of string
    li = [int(i) for i in li]     # list of integer - using list comprehension
    return li


# Toda mágica acontece aqui
# recebe as requisições jquery (ajax)
# Trata e devolve
def game(request):
    message_slice = request.POST.get('message')
    player_id = request.POST.get('player')
    vez = 1
    last_move = ""

    if message_slice == "StartGame":
        global game
        game = start_game()

        # caso a quantidade de jogadores seja igual a 1
        # playe_id recebe pk, "pk" porque um dia os players não forem anonimos
        # o pk poderá ser outros valores
        # alterna a vez pq se não o fizesse o player poderia jogar enquanto espera
        # a entrada do outro jogador
        # quem bloqueia é o jquery
        if game.player.count() == 1:
            player_id = str(game.player.all()[0].pk)
            vez = 2
            message_slice = "waitPlayer2"
        else:
            player_id = str(game.player.all()[1].pk)
            message_slice = "waitPlayer1"
            vez = 1

    # fica checando o movimento do adversário
    # na verdade verifica a vez ( game.playerS_turn )
    # Caso seja a vez do usuário que está aguardando e verificando
    # quer dizer o oponente já efetuou a jogada
    # então verifica o último movimento do jogador oponente para
    # identificar a ultima jogada
    if message_slice == "checkAdversary":
        if game.player.count() > 1 and player_id == str(game.playerS_turn):
            message_slice = "yourTurn"
            if player_id == str(game.player.all()[0].pk) and game.player2_movies is not None:
                list_move = string_to_list_of_integer(game.player2_movies)
                last_move = list_move[len(list_move) - 1]

            if player_id == str(game.player.all()[1].pk) and game.player1_movies is not None:
                list_move = string_to_list_of_integer(game.player1_movies)
                last_move = list_move[len(list_move) - 1]

    # Recebe a jogado do player da vez
    # grava a jogado no banco de dados
    # alterna a vez
    if message_slice == "Playing":
        jogada = request.POST.get('casaJogada')
        if game.playerS_turn == str(player_id):
            if game.playerS_turn == str(game.player.all()[0].pk):
                list_movies = []
                if game.player1_movies is not None:
                    list_movies = string_to_list_of_integer(game.player1_movies)
                list_movies.append(jogada)
                game.player1_movies = list_int_to_string(list_movies)
                game.playerS_turn = str(game.player.all()[1].pk)
                vez = game.playerS_turn
            else:
                list_movies = []
                if game.player2_movies is not None:
                    list_movies = string_to_list_of_integer(game.player2_movies)
                list_movies.append(jogada)
                game.player2_movies = list_int_to_string(list_movies)
                game.playerS_turn = str(game.player.all()[0].pk)
                vez = game.playerS_turn
        game.save()
        message_slice = "waitPlayer" + game.playerS_turn

    # só finaliza, da para criar uma funçao e
    # evitar repetição de código
    # a diferença entre este if e o anterior
    # é somente a mensagem de retorne e a mudança da vez
    # o segundo não muda a vez do player ja que o jogo acabou
    if message_slice == "fimDoJogo":
        jogada = request.POST.get('casaJogada')
        if game.playerS_turn == str(player_id):
            if game.playerS_turn == str(game.player.all()[0].pk):
                list_movies = []
                if game.player1_movies is not None:
                    list_movies = string_to_list_of_integer(game.player1_movies)
                list_movies.append(jogada)
                game.player1_movies = list_int_to_string(list_movies)
                game.playerS_turn = str(game.player.all()[1].pk)

            else:
                list_movies = []
                if game.player2_movies is not None:
                    list_movies = string_to_list_of_integer(game.player2_movies)
                list_movies.append(jogada)
                game.player2_movies = list_int_to_string(list_movies)
                game.playerS_turn = str(game.player.all()[0].pk)
        game.save()
        message_slice = "fimDoJogo"

    message = {"message": message_slice, "player": player_id, "vez": vez, "last_movie": last_move}
    return HttpResponse(
        json.dumps(message),
        content_type="application/json"
    )


# Caso não exista nada no bd (ainda sem nenhuma partida)
# ou a última partina ja possua dois jogadores
# cria um jogo e adiciona o player 1
# (elif) caso já possua uma partina com 1 player
# adiciona o player 2
def start_game():
    if not Game.objects.all().exists() or Game.objects.last().player.count() > 1:
        blank_game = Game()
        blank_game.save()
        player1 = Player.objects.get(pk=1)
        blank_game.player.add(player1)
        blank_game.playerS_turn = player1.pk
        blank_game.save()
        return blank_game
    elif Game.objects.last().player.count() == 1:
        blank_game = Game.objects.last()
        player2 = Player.objects.get(pk=2)
        blank_game.player.add(player2)
        return blank_game
