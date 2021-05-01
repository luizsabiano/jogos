$(function(){

var vez = 1;
var vencedor = "";
var combinacao_vencedora = [];
var counthouse = 0;

var DJANGO_STATIC_IMG = "/static/ticTacToe/img/";

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
    else
        return false;    
}


function low_opacity(){
    for (var i = 0; i <= 9; i++)
	$("#casa" + i).css("opacity", "0.4");
}


// aqui é identificado visualmente as casa vencedoras
// todas as outras tem sua opacidade diminuida
function identificaVencedor(){
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
        casasIguais(1, 5, 9) || casasIguais(3, 5, 7)
        ){
        $("#resultado").html("<h1>O jogador " + vencedor + " venceu! </h1>");
        $("#novoJogo").html("<di><a href='/jogos/ticTacToe/one_host/'><button class='btn btn-blue btn-effect btn-round btn-shadow'>Novo Jogo</button></a></di>");
        $(".casa").off("click");
        identificaVencedor();
    }
    else if (counthouse == 9){     
    	low_opacity()
    	$("#resultado").html("<h1>Fim do Jogo! N&atilde;o houve Vencedor. </h1>  <p> Recarregue a p&aacute;gina para continuar!");
    	$("#novoJogo").html("<di><a href='/jogos/ticTacToe/one_host/'><button class='btn btn-blue btn-effect btn-round btn-shadow'>Novo Jogo</button></a></di>");
    }
    else{
    	$("#resultado").html("<h1>Aguardando movimento do Jogador  " + vez + ". </h1");
    }
}


$(".casa").click(function(){
    var bg = $(this).css("background-image");
    if(bg == "none" || bg == "")
    {
       var fig = "url(" + DJANGO_STATIC_IMG + vez.toString() + ".jpg)";
       $(this).css("background", fig);
       $(this).css("background-size", "contain");
       $(this).css("background-repeat", "no-repeat");
       vez = (vez == 1? 2:1);
       counthouse++;
       verificarFimDeJogo();
    }
});


});
