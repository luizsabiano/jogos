$(function(){
dois_segundos = 1000 * 2;
var extraTime = 60;
var stopVar = null;
var casaJogada = "";
var vez = 1;
var player = 1;
var vencedor = "";
var combinacao_vencedora = [];
var counthouse = 0;
var DJANGO_STATIC_IMG = "/static/ticTacToe/img/";


// Carrega Jogo
$(window).load(function() {
      player = 1;
      Dados = {
        "message":"StartGame",
        "player":player,
      };
      sendajax(Dados);
      tempoRestante();
});

// Envia Dados e Recebe Dados do servidor
// Chama funcoes de acordo com a resposta do servidor
function sendajax(Dados){
    $.ajax({
            "type": "POST",
            "dataType": "json",
            "url": "game/",
            "data": Dados,
            "success": function(message) {

                // Define player (no else)
                if (Dados['message'] == "StartGame"){
                    player = message['player'];
                }

                // Desabilita o click para o jogador atual
                // Inicia um loop e a cada passada verifica se o
                // Jogador Oponente já entrou na partida ou
                // realizou sua jogada
                if (message['message'] == "waitPlayer" + message['vez']){
                    tempoRestante();
                    $(".casa").off("click");
                    stopVar  = setInterval(checkAdversary, dois_segundos);
                    $("#resultado").html("<h1> Aguardando Jogador " + message['vez'] +"</h1>");
                }

                // Para o loop de verificação
                // habilita o click e aguarda a jogada do jogador atual
                else if ( message['message'] == "yourTurn"){
                    clearInterval(stopVar);
                    tempoRestante();
                    var bg = $('#casa'+message['last_movie']).css("background-image");
                    if(bg == "none" || bg == "")
                       fillBackground('#casa'+message['last_movie']);

                    if (!verificarFimDeJogo()){
                        yourTurnClickOn();
                        $("#resultado").html("<h1> Aguardando sua Jogada </h1>");
                    }

                }
                console.log(message);
            },
     });
}


// preenche background da div com imagem X ou 0
function fillBackground(casa){
   var fig = "url(" + DJANGO_STATIC_IMG + vez.toString() + ".jpg)";
   $(casa).css("background", fig);
   $(casa).css("background-size", "contain");
   $(casa).css("background-repeat", "no-repeat");
   switchPlayer();
   counthouse++;
}

// Contagem de tempo caso queira finalizar jogo
// por falta de movimentação
function tempoRestante(){
    data = date_format(extraTime);
    $('#clock').countdown(data)
        .on('update.countdown', function(event) {
            var format = '%H:%M:%S';
            if(event.offset.totalDays > 0)
                format = '%-d Dia%!d ' + format;
            if(event.offset.weeks > 0)
                format = '%-w Semana%!w ' + format;
        $(this).html(event.strftime(format));
    })
        .on('finish.countdown', function(event) {
            $(this).html('Jogo expirado, sem movimentação à '+ extraTime + ' segundos')
            .parent().addClass('disabled');
    });
}

// alterna a vez para o próximo jogador
function switchPlayer(){
    vez = (vez == 1? 2:1);
}

// Após um clique, envia a casa escolhida para o servidor / sendajax(Dados) /
// preenche o background  / fillBackground(this) /
// e verifica se houve um vencedor / verificarFimDeJogo() /
function yourTurnClickOn(){
    $('.casa').on(  {
      click: function(e) {
        e.preventDefault();
        var bg = $(this).css("background-image");
        if(bg == "none" || bg == "")
        {
           fillBackground(this);

           casaJogada = $(this).attr('id');
           if (!verificarFimDeJogo()){
                Dados = {
              "message":"Playing",
              "player":player,
              "casaJogada": casaJogada.substring(4),
              };
           } else if (verificarFimDeJogo()){
                Dados = {
              "message":"fimDoJogo",
              "player":player,
              "casaJogada": casaJogada.substring(4),
              };
           }
              sendajax(Dados);
        }
      }
    });
}


// Enquanto aguarda o movimento do proximo jogador
// verifica de tempos em tempos se esta jogada já foi efetuada
function checkAdversary(){
    Dados = {
        "message":"checkAdversary",
        "player":player,
      };
      sendajax(Dados);
}


// Passado uma combinação de três casas
// o 1º if verifica se as três casa possuem o mesmo background
// em caso positivo existe um vencedor
// o 2º if identifica baseado no background quem venceu (player 1 ou 2)

function casasIguais(a, b, c){
    var bgA = $("#casa"+a).css("background-image");
    var bgB = $("#casa"+b).css("background-image");
    var bgC = $("#casa"+c).css("background-image");
    if( (bgA == bgB) && (bgB == bgC) && (bgA != "none" && bgA != "")){
        if(bgA.indexOf( "img/1.jpg") >= 0)
            vencedor = "1";
        else
            vencedor = "2";
        combinacao_vencedora = [a,b,c];
        return true;
    }
    return false;
}


// Caso exista uma jogada campeã
// Diminui a opacidade de todas as div's (casa)
function low_opacity(){
    for (var i = 0; i <= 9; i++)
	$("#casa" + i).css("opacity", "0.4");
}


// aqui é identificado visualmente as casa vencedoras
// todas as outras tem sua opacidade diminuida
function realcaJogadaVencedora(){
	low_opacity();
	$("#casa" + combinacao_vencedora[0]).css("opacity", "1");
	$("#casa" + combinacao_vencedora[1]).css("opacity", "1");
	$("#casa" + combinacao_vencedora[2]).css("opacity", "1");
}


// Utiliza as funções acima para interagir visualmente quando houver um vencedor,
// quando o jogo acabar ou indicando quem é o próximo jogador
function verificarFimDeJogo(){
    if( casasIguais(1, 2, 3) || casasIguais(4, 5, 6) || casasIguais(7, 8, 9) ||
        casasIguais(1, 4, 7) || casasIguais(2, 5, 8) || casasIguais(3, 6, 9) ||
        casasIguais(1, 5, 9) || casasIguais(3, 5, 7)){
        $("#resultado").html("<h1>O jogador " + vencedor + " venceu! </h1>");
        $("#novoJogo").html("<di><a href='/jogos/ticTacToe/two_hosts/'><button class='btn btn-blue btn-effect btn-round btn-shadow'>Novo Jogo</button></a></di>");
        $(".casa").off("click");
        realcaJogadaVencedora();
        clearInterval(stopVar);
        return true;
    }
    else if (counthouse == 9){
    	low_opacity()
    	$("#resultado").html("<h1>Fim do Jogo! N&atilde;o houve Vencedor. </h1>");
    	$("#novoJogo").html("<di><a href='/jogos/ticTacToe/two_hosts/'><button class='btn btn-blue btn-effect btn-round btn-shadow'>Novo Jogo</button></a></di>");
    	return true;
    }
    return false;
}
});
