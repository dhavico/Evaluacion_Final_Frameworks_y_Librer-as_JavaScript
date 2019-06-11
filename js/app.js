//Parametros para el juego
var parametros = {
    cantFilas: 7,
    cantColumnas: 8
}
//Animación del titulo
function loop(){
    $(".main-titulo").animate({
        opacity: '1',
        color: 'yellow'
    },1000,'linear', function(){
        $(".main-titulo").animate({
            color: 'white'
        },800,'linear', function(){
            loop();
        });
    });
}

$(".btn-reinicio").on("click", function(){
    var text = $(this).text();
    if(text == "Reiniciar"){
        document.location.reload();
    }
    else{
        $(this).text("Reiniciar");
        $('#timer').text('');
        $('#timer').startTimer({
            onComplete: function(){
                $('div.panel-tablero, div.time').effect('fold');
                $('h1.main-titulo').addClass('title-over')
                $('h1.main-titulo').text('Gracias por jugar!');
                $('div.score, div.moves, div.panel-score').width('100%');
            }
        })
        loop();
        init();
        verificarCaramelos();
    }
});
/*=====================*/
//Inicia el juego
function init(){
    for (let columna = 1; columna <= parametros.cantColumnas; columna++) {
        var cantCaramelos = parametros.cantFilas - $(".col-" + columna).children().length;
        for (let fila = 1; fila <= cantCaramelos; fila++) {
            $(".panel-tablero>.col-" + columna).prepend('<img id="' + fila + columna + '" src="image/' + (Math.floor(Math.random()*5)+1) + '.png" width="92%"/>')
        }    
    }
    $('img').draggable({
		containment: '.panel-tablero',
		droppable: 'img',
		revert: true,
		revertDuration: 500,
        grid: [100,100],
		zIndex: 10,
		drag: function(event, candyDrag) {
            if(candyDrag.position.top>0){
                candyDrag.position.top = Math.min($(".col-1>img")[0].height, candyDrag.position.top);
                candyDrag.position.bottom = 0;
                candyDrag.position.left = 0;
                candyDrag.position.right = 0;
            }else if(candyDrag.position.bottom>0){
                candyDrag.position.top = 0;
                candyDrag.position.bottom = Math.min($(".col-1>img")[0].height, candyDrag.position.bottom);
                candyDrag.position.left = 0;
                candyDrag.position.right = 0;
            }else if(candyDrag.position.left>0){
                candyDrag.position.top = 0;
                candyDrag.position.bottom = 0;
                candyDrag.position.left = Math.min($(".col-1").width(), candyDrag.position.left);
                candyDrag.position.right = 0;
            }else if(candyDrag.position.right>0){
                candyDrag.position.top = 0;
                candyDrag.position.bottom = 0;
                candyDrag.position.left = 0;
                candyDrag.position.right = Math.min($(".col-1").width(), candyDrag.position.right);
            }
        }
	});
	$('img').droppable({
		drop: function(event, ui){
            var srcDrag = $(ui.draggable).attr("src")
            var srcDrop = $(this).attr("src");
            $(ui.draggable).attr("src", srcDrop);
            $(this).attr("src", srcDrag);
            movimientos();
            verificarCaramelos();
            if($("img.eliminar2").length==0)
            {
                $(ui.draggable).attr("src", srcDrag);
                $(this).attr("src", srcDrop);
            }
            else{
                eliminarCaramelos();
            }
		}
	});
}
//Contador de movimientos
function movimientos(){
    var mov = $("#movimientos-text").text();
    mov++;
    $("#movimientos-text").text(mov);
}
//Acumulador de puntaje
function puntuacion(numCaramelos){
    var score = parseInt($("#score-text").text());
    switch (numCaramelos) {
        case 3:
            score = score + 30;//10
            break;
        case 4: 
            score = score + 60;//15
            break;
        case 5: 
            score = score + 100;//20
            break;
        case 6: 
            score = score + 150;//25
            break;
        case 7: 
            score = score + 210;//30
            break;
    }
    $("#score-text").text(score);
}
//Verifica columnas
function verificaColumnas(){
    var cont = 0;
    for (let columna = 1; columna <= parametros.cantColumnas; columna++) {
        var carameloColumna = $(".col-" + columna).children().eq(0);
        var arrCaramelos = [];
        for (let fila = 1; fila < parametros.cantFilas; fila++) {
            if(cont==0) {arrCaramelos.push(carameloColumna);carameloColumna.addClass("eliminar");}
            var carameloFila = $(".col-" + columna).children().eq(fila);
            if(carameloColumna.attr("src") == carameloFila.attr("src")){
                carameloFila.addClass("eliminar");
                cont++;
                arrCaramelos.push(carameloFila);
            }
            else{
                cont = 0;
                if(arrCaramelos.length<3){
                    arrCaramelos.map(function(a){return a.removeClass('eliminar')});
                    arrCaramelos.splice(0);
                }
                else{
                    puntuacion(arrCaramelos.length);
                	arrCaramelos.map(function(a){return a.addClass('eliminar2') && a.removeClass('eliminar')});
                    arrCaramelos.splice(0);
                }
            }
            carameloColumna = carameloFila;
            if(arrCaramelos.length<3 && fila==parametros.cantFilas-1){
            	arrCaramelos.map(function(a){return a.removeClass('eliminar')});
                arrCaramelos.splice(0);
                cont=0;
            }
            else if(fila==parametros.cantFilas-1){
                puntuacion(arrCaramelos.length);
            	arrCaramelos.map(function(a){return a.addClass('eliminar2') && a.removeClass('eliminar')});
            	cont=0;
            }
        }
    }
}
//Verifica filas
function verificaFilas(){
    var cont = 0;
    for (let fila = 1; fila <= parametros.cantFilas; fila++) {
        var carameloFila = $($(".panel-tablero").children()).eq(0).children().eq(fila-1);
        var arrCaramelos = [];
        for (let columna = 1; columna < parametros.cantColumnas; columna++) {
        	if(cont==0) {arrCaramelos.push(carameloFila);carameloFila.addClass("eliminar");}
            var carameloColumna = $($(".panel-tablero").children()).eq(columna).children().eq(fila-1);
            if(carameloColumna.attr("src") == carameloFila.attr("src")){
                carameloColumna.addClass("eliminar");
                cont++;
                arrCaramelos.push(carameloColumna);
            }
            else{
                cont = 0;
               	if(arrCaramelos.length<3){
                    arrCaramelos.map(function(a){return a.removeClass('eliminar')});
                    arrCaramelos.splice(0);
                }
                else{
                    puntuacion(arrCaramelos.length);
                	arrCaramelos.map(function(a){return a.addClass('eliminar2') && a.removeClass('eliminar')});
                	arrCaramelos.splice(0);
                }
            }
            carameloFila = carameloColumna;
            if(arrCaramelos.length<3 && columna==parametros.cantColumnas-1){
            	arrCaramelos.map(function(a){return a.removeClass('eliminar')});
                arrCaramelos.splice(0);
                cont=0;
            }
            else if(columna==parametros.cantColumnas-1){
                puntuacion(arrCaramelos.length);
                arrCaramelos.map(function(a){return a.addClass('eliminar2') && a.removeClass('eliminar')});
            	cont=0;
            }
        }
    }
}
//Verifica caramelos en filas y columnas
function verificarCaramelos(){
    verificaColumnas();
    verificaFilas();
    eliminarCaramelos();
    return 0;
}
//Eliminar caramelos
function eliminarCaramelos(){
    if($("img.eliminar2").length>0){
        $("img.eliminar2").effect('pulsate', 600);
        $("img.eliminar2").animate({
			opacity: '0'
		}, {
			duration: 300,
            complete: function(){
                $("img.eliminar2").remove();
                setTimeout(() => {
                    init();
                    verificarCaramelos();
                }, 500);
            },
            queue: true
        })
    }
    else{
        return;
    }
}