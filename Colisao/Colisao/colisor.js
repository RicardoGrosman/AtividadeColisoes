function Colisor() {
   this.sprites = [];
   this.aoColidir = null;
   this.colisoesBolas = 0; // Contador de colisões entre bolas específicas
}

Colisor.prototype = {
   novoSprite: function(sprite) {
      this.sprites.push(sprite);
   },
   processar: function() {
      // Inicia com um objeto vazio
      var jaTestados = new Object();

      for (var i in this.sprites) {
         for (var j in this.sprites) {
            if (i == j) continue;

            var id1 = this.stringUnica(this.sprites[i]);
            var id2 = this.stringUnica(this.sprites[j]);

            if (!jaTestados[id1]) jaTestados[id1] = [];
            if (!jaTestados[id2]) jaTestados[id2] = [];

            if (!(jaTestados[id1].indexOf(id2) >= 0 ||
                  jaTestados[id2].indexOf(id1) >= 0)) {

               // Verifica a colisão entre os sprites
               if (this.testarColisao(this.sprites[i], this.sprites[j])) {

                  // Verifica se a colisão é entre duas bolas específicas
                  if (this.sprites[i] instanceof Bola && this.sprites[j] instanceof Bola) {
                     this.colisoesBolas += 1; // Incrementa a contagem apenas para colisões entre bolas

                     // Alterna as cores das bolas envolvidas
                     this.sprites[i].cor = this.sprites[i].cor === 'blue' ? 'red' : 'yellow';
                     this.sprites[j].cor = this.sprites[j].cor === 'blue' ? 'red' : 'yellow';
                     
                     // Exibe "Game Over" na terceira colisão entre as bolas
                     if (this.colisoesBolas === 3) {
                        alert("Game Over");
                        return; // Interrompe o processamento após "Game Over"
                     }
                  }

                  // Notifica os sprites da colisão
                  this.sprites[i].colidiuCom(this.sprites[j]);
                  this.sprites[j].colidiuCom(this.sprites[i]);

                  // Executa o tratamento geral de colisão, se definido
                  if (this.aoColidir) this.aoColidir(this.sprites[i], this.sprites[j]);
               }

               // Registra a colisão entre os objetos
               jaTestados[id1].push(id2);
               jaTestados[id2].push(id1);
            }
         }
      }
   },
   testarColisao: function(sprite1, sprite2) {
      var rets1 = sprite1.retangulosColisao();
      var rets2 = sprite2.retangulosColisao();

      for (var i in rets1) {
         for (var j in rets2) {
            if (this.retangulosColidem(rets1[i], rets2[j])) {
               return true;
            }
         }
      }
      return false;
   },
   retangulosColidem: function(ret1, ret2) {
      return (ret1.x + ret1.largura) > ret2.x &&
             ret1.x < (ret2.x + ret2.largura) &&
             (ret1.y + ret1.altura) > ret2.y &&
             ret1.y < (ret2.y + ret2.altura);
   },
   stringUnica: function(sprite) {
      var str = '';
      var retangulos = sprite.retangulosColisao();

      for (var i in retangulos) {
         str += 'x:' + retangulos[i].x + ',' +
                'y:' + retangulos[i].y + ',' +
                'l:' + retangulos[i].largura + ',' +
                'a:' + retangulos[i].altura + '\n';
      }

      return str;
   }
};
