$(function(){

   var resetaTeclado = [];
   var DJANGO_STATIC_IMG = "/static/hangman/img/";
// -------------------------------------------------------------------------------------------
	function Hangman(word){
	    this.guessed_letters = '';
	    this.missed_letters = '';
	    this.word = word.toUpperCase();   
	    rtn = '';    
	    maximum_missed_letters = 7;   
	    
	    // Method for guessing the letter     
	    this.guess = function (letter) {            
	    	this.letter = letter.toUpperCase();
		if (this.word.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').indexOf(this.letter) > -1
		    && this.guessed_letters.toUpperCase().indexOf(this.letter) == -1){
		    this.guessed_letters += this.letter;
		    this.hide_word();
		    this.hangman_over();
		    return true;
		} else if (this.word.indexOf(this.letter) == -1 && this.missed_letters.indexOf(this.letter) == -1){
		    this.missed_letters += this.letter;
		    this.hangman_over();
		    return true;
		}
		return false;			
	     }
	    
	    // Método para verificar se o jogador venceu
	    this.hangman_won = function (){
		if (this.hide_word().indexOf('_') > -1)
		    return false;
		return true;
	    }
	    
	    // Método para verificar se o jogo terminou 
	    this.hangman_over = function (){
	   	if (this.hangman_won() || this.missed_letters.length >= maximum_missed_letters)
	   	    return true;
	   	return false;
	    }

	    //  Método para não mostrar a letra no board
	    this.hide_word = function (){       
	       if (!rtn)
		   for (var i = 0; i < this.word.length; i++)
		       rtn += '_';        	       	

	       
	       if (this.guessed_letters.indexOf(this.letter) > -1)
		   for (var i = 0; i < this.word.length; i++)
		       if (this.letter == this.word.normalize('NFD').replace(/[\u0300-\u036f]/g, '').substring(i, i + 1)){
			   rtn = rtn.substring(0, i) + rtn.replace(rtn.substring(i + 1, 0), this.word.toUpperCase().substring(i, i + 1));
		       }
	       return rtn; 	       	   
	   }     
	}


// -------------------------------------------------------------------------------------------

    var dict = new Map();

    // Carrega as palavras e inicia o jogo ( startGame)
    $(window).load(function() {
        $.ajax({
            "type": "POST",
            "dataType": "json",
            "url": "getwords/",
            "data": 'newGame',
            "success": function(message) {
            for (var i = 0; i < message.length; i++ )
               dict.set(message[i]['word'], message[i]['tip'] );
            console.log(dict);
            startGame();

            },
     });
    });

	var word = '';
	var tip = ''
	// Máximo de erros
	maxError = 7;






        // Gera um número aleatório entre o min e máximo 
        // para sorteio da palavra que será advinhada

        function randomInteger(min, max) {
 	     return Math.floor(Math.random() * (max - min + 1)) + min;
	    }
	

	// Mostra a letras advinhadas
	             
        function hide_wordView(){
            this.hide_word = hangman.hide_word();
            for (i = 1 ; i <= hide_word.length; i++)
               if (hide_word.substring(i -1 , i) != '_'){
		    $("#letter" + i).empty();                   
                   $("#letter" + i).append(hide_word.substring(i -1 , i));   	  	
               }    
        }
        

        // Avança o desenho do enforcado a cada erro
        function hangs(){
            currentBackGround = parseInt($("#game").css("background-image").slice(-7, -6 ));            
            newBackGround = hangman.missed_letters.length;
            if (currentBackGround < newBackGround && newBackGround <= maxError){
                var fig = "url(" + DJANGO_STATIC_IMG + "/Error" + newBackGround + ".png)";
                $(".appendMember").css("background", fig);   
                $(".appendMember").css("background-size", "contain");
                $(".appendMember").css("background-repeat", "no-repeat");
                $(".appendMember").css("background-position", "left");
            }    
        }

        // verifica se o jogo terminou
        function game_over(){
            if (hangman.hangman_over()){
            	 $(".message").empty();             	 
	         if (hangman.hangman_won()){
                    $(".message").append("<h4>Parab&eacute;ns!! Voc&ecirc; Venceu.</h4>");
                    $(".message").css("color", "black");
                    var fig = "url(" +DJANGO_STATIC_IMG + "/venceu.png)";
                    $(".message").css("color", fig);
                    $(".winWon").css("background", fig); 
                    $(".winWon").css("background-size", "contain");
                    $(".winWon").css("background-repeat", "no-repeat");   
                 }
                 else {
                    $(".message").append("<h4> Voc&ecirc; perdeu! A palavra &eacute;: " + hangman.word + "</h4>");
                    $(".message").css("color", "red");
  
                 }
                 $(".dict").css("pointer-events", "none");
                 $("#newGame").css("pointer-events", 'auto');
            }
        }

        // Inicia o Jogo
        function startGame(){
            position = randomInteger(0, dict.size -1);
            if (position > 0){
                word = Array.from(dict.keys())[position];
                tip = dict.get(word);

            
                for (var i = 1; i <= word.length; i++){
                    $("#letter" + i).css("border", "solid");
                    $("#letter" + i).css({"borderWidth": "0px 0px 1px 0px" });
                }
                            	    
                hangman = new Hangman(word);
            } else window.location.reload();
        }

    // Reinicia a partida após jogo finalizado, não recarrrega a página
    // até esgotado o dicionário de palavras
	function newGame(){
	    
	    $(".message").empty();
	    $(".message").css("color", "white");
	    $(".message").append("<h4>.</h4>");

	    // reseta letras advinhadas
	    for (var i = 1; i <= word.length; i++){
                $("#letter" + i).css("border", "none");
                $("#letter" + i).empty();
            }

	    $(".appendMember").css("background", '');
	    
	    
	    // reseta o teclado	    
	    $(".dict").css("pointer-events", 'auto');
	    for (var i = 0; i < resetaTeclado.length; i++){	    
	            div = "#" + resetaTeclado[i];
	            console.log(div)
	            $(div).css("color", "white");
		    $(div).css("background-color", "#2e6da4");
	            
	            $(div).hover(function(){
		    	$(this).css("background-color", "white");
	    	    	$(this).css("color", "#2e6da4");    
		    },function(){
		    	$(this).css("background-color", "#2e6da4");
	    	    	$(this).css("color", "white"); 
		    });
	            
            }
            resetaTeclado = [];
           
           //---------------------
	    
	    startGame();
	}

	// retorna uma letra ainda não adivinhada para ajudar o jogador
	function dica(){
	    hide_word = hangman.hide_word();
	    this.word = hangman.word;
	    position = randomInteger(0, word.length -1);
	    while (hide_word[position] != '_')
	        position = randomInteger(0, word.length -1);
	    return word[position];
	}



	$(".dict").click(function(){
	    if ($(this).text() == "DICA"){
	       hangman.guess(dica());
	       $(this).css("pointer-events", "none");
	       $(this).css("color", "#2e6da4");
	       $(this).css("background-color", "white");
	       if (tip != null){
               $(".message").empty();
               $(".message").append("<h4>" + tip +"</h4>");
               $(".message").css("color", "black");
               resetaTeclado.push("tip");
	       }

	    }
	    else if ($(this).text() == "NOVO JOGO")
	    	newGame();
	    else		    
	     {
            resetaTeclado.push($(this).text());
            $(this).css("color", "#2e6da4");
            $(this).css("background-color", "white");
            $(this).unbind('hover');
	        hangman.guess($(this).text());
	    }
	    hide_wordView();  
	    hangs(); 	
	    game_over(); 
	    
        });


	// ----------------------------------

    // Testes automatizados para a lógica do jogo
	function tests (){
	    hangman = new Hangman('Aline');
	    
	    !hangman.guess('l')    
	    if (hangman.guessed_letters != 'L')
	    	return "ERRO - Existe, não repetido";    

	    hangman.guess('m');    
	    if (hangman.missed_letters != 'M')
		return "Erro - Não existe, não repetido";          
		
	    if (hangman.guess('l'))
		return "Erro - Existe, repetido";    
	      
	    if (hangman.guess('m'))
		return "Erro - Não existe, repetido";	    	
		
	    if (hangman.hide_word() != "_L___")          
	    	return "Erro - var 'hide_word' não confere";   
	    
	    hangman.guess('a');
	    hangman.guess('i');
	    hangman.guess('n');
	    hangman.guess('e');

	    if (!hangman.hangman_won())             
	    	return "Erro - hagman_won";    
	    
	    hangman = new Hangman('Julia');
	    
	    hangman.guess('x');
	    hangman.guess('p');
	    hangman.guess('t');
	    hangman.guess('o');
	    hangman.guess('m');
	    hangman.guess('k');
	    
	    if (!hangman.hangman_over())             
	    	return "Erro - hagman_over";

	    return "No Erros";                
	    
	}

});
//tests();


