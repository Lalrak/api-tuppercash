// const usuario = {
//   nome: "Joao",
//   idade: 23,
//   email: "j@j.com",
// };

// const { nome, idade, email } = usuario;

// console.log(nome, idade, email);

// const linguagens = ["JS", "C#", "Puthon"];

// const [ling1, ling2, ling3] = linguagens;
// console.log(ling1, ling2, ling3);

// function somarTudo(...numeros) {
//   return numeros.reduce((total, num) => total + num, 0);
// }
// console.log(somarTudo(1, 2, 3, 4, 5, 6, 7));

// const frutas1 = ["uva", "pera", "maça"];
// const frutas2 = ["mamao", "banana", "goiaba"];

// const tudo = [...frutas1, ...frutas2];
// console.log(tudo);

// const dados1 = { nome: "joao", idade: 22 };
// const dados2 = { solteiro: true };
// const perfil = { ...dados1, ...dados2 };
// console.log(perfil);

// const hoje = new Date();
// const dia = hoje.getDay();
// const mes = hoje.getMonth() + 1;
// const ano = hoje.getFullYear();

// console.log(`hoje é ${dia}/${mes}/${ano}`);

class Livro {
  constructor(titulo, autor) {
    ((this.titulo = titulo), (this.autor = autor));
  }
  descrever() {
    console.log(this.titulo + " - " + this.autor);
  }
}

const livro1 = new Livro("As cronicas de narnia", "Lewis");
livro1.descrever();
