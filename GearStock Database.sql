CREATE DATABASE gearstock;

use gearstock;

CREATE TABLE usuario (
id_usuario INT PRIMARY KEY AUTO_INCREMENT NOT NULL, 
nome varchar(255) NOT NULL,
email varchar(100) unique NOT NULL,
senha varchar(100) NOT NULL,
cargo varchar(50) NOT NULL,
permissao varchar(255) NOT NULL
);

CREATE TABLE filial (
id_filial INT PRIMARY KEY AUTO_INCREMENT NOT NULL, 
nome varchar(255) unique NOT NULL,
endereco varchar(255) NOT NULL,
telefone char(14) NOT NULL 
);

CREATE TABLE pecas (
id_peca INT PRIMARY KEY AUTO_INCREMENT NOT NULL, 
nome varchar(50) not null,
descricao varchar(255) NOT NULL,
codigo varchar(100) unique NOT NULL,
categoria varchar(50) NOT NULL,
fabricante varchar(50) NOT NULL,
preco_custo decimal(8,2) NOT NULL,
preco_venda decimal(8,2) NOT NULL,
quantidade int NOT NULL,
localizacao varchar(255),
imagem varchar(255),
ficha_tecnica varchar(255) NOT NULL,
estoque_minimo int NOT NULL
);

CREATE TABLE movimentacao (
id_movimentacao INT PRIMARY KEY AUTO_INCREMENT NOT NULL, 
dataHora timestamp NOT NULL,
tipo varchar(20) NOT NULL,
quantidade int NOT NULL,
valor decimal(8,2) NOT NULL,
origem varchar(255) NOT NULL,
destino varchar(255) NOT NULL,
fk_id_peca int NOT NULL,
FOREIGN KEY (fk_id_peca) REFERENCES pecas(id_peca)
);

CREATE TABLE ordem_servicos (
id_ordem INT PRIMARY KEY AUTO_INCREMENT NOT NULL, 
dataAbertura timestamp NOT NULL,
dataFechamento timestamp NULL,
status varchar(20) NOT NULL,
descricaoProblema varchar(255) NOT NULL,
solucaoAplicada varchar(255) NOT NULL,
placa char(8) NOT NULL
);

CREATE TABLE relatorios (
id_relatorio INT PRIMARY KEY AUTO_INCREMENT NOT NULL, 
tipo varchar(20) NOT NULL,
dataInicial timestamp NOT NULL,
dataFinal timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
dataGeracao timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

SELECT * FROM usuario;

