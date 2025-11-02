# Diagrama Banco de Dados ComandAI documentation
## Summary

- [Introduction](#introduction)
- [Database Type](#database-type)
- [Table Structure](#table-structure)
	- [status_mesa](#status_mesa)
	- [mesa](#mesa)
	- [ocupacao_mesa](#ocupacao_mesa)
	- [garcom](#garcom)
	- [cardapio](#cardapio)
	- [categoria_produto](#categoria_produto)
	- [produto](#produto)
	- [pedido](#pedido)
	- [itens_do_pedido](#itens_do_pedido)
	- [adicionais](#adicionais)
	- [item_pedido_adicional](#item_pedido_adicional)
	- [unidade_medida](#unidade_medida)
	- [ingredientes](#ingredientes)
	- [produto_ingrediente](#produto_ingrediente)
	- [adicional_ingrediente](#adicional_ingrediente)
- [Relationships](#relationships)
- [Database Diagram](#database-diagram)

## Introduction

## Database type

- **Database system:** SQLite
## Table structure

### status_mesa

| Name        | Type          | Settings                      | References                    | Note                           |
|-------------|---------------|-------------------------------|-------------------------------|--------------------------------|
| **id** | INTEGER | 🔑 PK, null, unique, autoincrement | fk_status_mesa_id_mesa | |
| **nome** | TEXT | not null |  |livre, ocupada, reserva, fechada, limpeza |
| **cor** | TEXT | null |  | |
| **descricao** | TEXT | null |  | | 


### mesa

| Name        | Type          | Settings                      | References                    | Note                           |
|-------------|---------------|-------------------------------|-------------------------------|--------------------------------|
| **id** | INTEGER | 🔑 PK, null, unique, autoincrement | fk_mesa_id_ocupacao_mesa | |
| **numero** | INTEGER | not null |  |Número físico da mesa |
| **status_id** | INTEGER | not null |  | |
| **capacidade** | INTEGER | null |  |Quantidade de lugares estimada (opcional) |
| **ativa** | BOOLEAN | null, default: true |  | |
| **observacoes** | TEXT | null |  | |
| **tempo_total_ocupada** | INTEGER | null |  |Soma histórica em minutos/segundos |
| **total_ocupacoes** | INTEGER | null |  |Total de vezes usada | 


### ocupacao_mesa

| Name        | Type          | Settings                      | References                    | Note                           |
|-------------|---------------|-------------------------------|-------------------------------|--------------------------------|
| **id** | INTEGER | 🔑 PK, null, unique, autoincrement | fk_ocupacao_mesa_id_pedido | |
| **mesa_id** | INTEGER | not null |  | |
| **garcom_id** | INTEGER | null |  | |
| **aberto_em** | DATETIME | not null |  | |
| **fechado_em** | DATETIME | null |  | |
| **tempo_ocupada** | INTEGER | null |  |Duração calculada no fechamento (min/seg) |
| **pessoas** | INTEGER | null |  | |
| **valor_total** | DECIMAL(10,2) | null |  | |
| **observacoes** | TEXT | null |  | | 


### garcom

| Name        | Type          | Settings                      | References                    | Note                           |
|-------------|---------------|-------------------------------|-------------------------------|--------------------------------|
| **id** | INTEGER | 🔑 PK, null, unique, autoincrement | fk_garcom_id_ocupacao_mesa,fk_garcom_id_pedido | |
| **nome** | TEXT | not null |  | |
| **telefone** | TEXT | null |  | |
| **ativo** | BOOLEAN | null, default: true |  | | 


### cardapio

| Name        | Type          | Settings                      | References                    | Note                           |
|-------------|---------------|-------------------------------|-------------------------------|--------------------------------|
| **id** | INTEGER | 🔑 PK, null, unique, autoincrement | fk_cardapio_id_produto | |
| **nome** | TEXT | not null |  | |
| **descricao** | TEXT | null |  | |
| **ativo** | BOOLEAN | null, default: true |  | |
| **data_inicio** | DATE | null |  | |
| **data_fim** | DATE | null |  | | 


### categoria_produto

| Name        | Type          | Settings                      | References                    | Note                           |
|-------------|---------------|-------------------------------|-------------------------------|--------------------------------|
| **id** | INTEGER | 🔑 PK, null, unique, autoincrement | fk_categoria_produto_id_produto | |
| **nome** | TEXT | not null |  | |
| **descricao** | TEXT | null |  | |
| **ordem_exibicao** | INTEGER | null |  | | 


### produto

| Name        | Type          | Settings                      | References                    | Note                           |
|-------------|---------------|-------------------------------|-------------------------------|--------------------------------|
| **id** | INTEGER | 🔑 PK, null, unique, autoincrement | fk_produto_id_itens_do_pedido,fk_produto_id_produto_ingrediente | |
| **nome** | TEXT | not null |  | |
| **preco** | DECIMAL(10,2) | not null |  | |
| **preco_meia** | DECIMAL(10,2) | null |  | |
| **aceita_meia** | BOOLEAN | null, default: false |  | |
| **categoria_id** | INTEGER | null |  | |
| **cardapio_id** | INTEGER | null |  | |
| **ativo** | BOOLEAN | null, default: true |  | |
| **descricao** | TEXT | null |  | | 


### pedido

| Name        | Type          | Settings                      | References                    | Note                           |
|-------------|---------------|-------------------------------|-------------------------------|--------------------------------|
| **id** | INTEGER | 🔑 PK, null, unique, autoincrement | fk_pedido_id_itens_do_pedido | |
| **ocupacao_id** | INTEGER | null |  | |
| **garcom_id** | INTEGER | null |  | |
| **data_hora** | DATETIME | null, default: CURRENT_TIMESTAMP |  | |
| **status** | PEDIDO_STATUS | not null, default: pendente |  | |
| **valor_total** | DECIMAL(10,2) | null |  | |
| **observacoes** | TEXT | null |  | | 


### itens_do_pedido

| Name        | Type          | Settings                      | References                    | Note                           |
|-------------|---------------|-------------------------------|-------------------------------|--------------------------------|
| **id** | INTEGER | 🔑 PK, null, unique, autoincrement | fk_itens_do_pedido_id_item_pedido_adicional | |
| **pedido_id** | INTEGER | null |  | |
| **produto_id** | INTEGER | null |  | |
| **quantidade** | INTEGER | null, default: 1 |  | |
| **preco_unitario** | DECIMAL(10,2) | null |  | |
| **subtotal** | DECIMAL(10,2) | null |  | |
| **adicionais** | TEXT | null |  |Snapshot textual (exibição/cozinha). Para granularidade, ver item_pedido_adicional | 


### adicionais

| Name        | Type          | Settings                      | References                    | Note                           |
|-------------|---------------|-------------------------------|-------------------------------|--------------------------------|
| **id** | INTEGER | 🔑 PK, null, unique, autoincrement | fk_adicionais_id_item_pedido_adicional,fk_adicionais_id_adicional_ingrediente | |
| **nome** | TEXT | not null |  | |
| **preco** | DECIMAL(10,2) | null |  | |
| **ativo** | BOOLEAN | null, default: true |  | | 


### item_pedido_adicional

| Name        | Type          | Settings                      | References                    | Note                           |
|-------------|---------------|-------------------------------|-------------------------------|--------------------------------|
| **id** | INTEGER | 🔑 PK, null, unique, autoincrement |  | |
| **item_pedido_id** | INTEGER | null |  | |
| **adicional_id** | INTEGER | null |  | |
| **quantidade** | INTEGER | null, default: 1 |  | | 


### unidade_medida

| Name        | Type          | Settings                      | References                    | Note                           |
|-------------|---------------|-------------------------------|-------------------------------|--------------------------------|
| **id** | INTEGER | 🔑 PK, null, unique, autoincrement | fk_unidade_medida_id_ingredientes | |
| **nome** | TEXT | not null |  | |
| **sigla** | TEXT | not null |  | | 


### ingredientes

| Name        | Type          | Settings                      | References                    | Note                           |
|-------------|---------------|-------------------------------|-------------------------------|--------------------------------|
| **id** | INTEGER | 🔑 PK, null, unique, autoincrement | fk_ingredientes_id_produto_ingrediente,fk_ingredientes_id_adicional_ingrediente | |
| **nome** | TEXT | not null |  | |
| **quantidade** | DECIMAL(10,2) | null |  | |
| **unidade_id** | INTEGER | null |  | |
| **ativo** | BOOLEAN | null, default: true |  | | 


### produto_ingrediente

| Name        | Type          | Settings                      | References                    | Note                           |
|-------------|---------------|-------------------------------|-------------------------------|--------------------------------|
| **id** | INTEGER | 🔑 PK, null, unique, autoincrement |  | |
| **produto_id** | INTEGER | null |  | |
| **ingrediente_id** | INTEGER | null |  | |
| **quantidade** | DECIMAL(10,2) | null |  | | 


### adicional_ingrediente

| Name        | Type          | Settings                      | References                    | Note                           |
|-------------|---------------|-------------------------------|-------------------------------|--------------------------------|
| **id** | INTEGER | 🔑 PK, null, unique, autoincrement |  | |
| **adicional_id** | INTEGER | null |  | |
| **ingrediente_id** | INTEGER | null |  | |
| **quantidade** | DECIMAL(10,2) | null |  | | 


## Relationships

- **status_mesa to mesa**: one_to_many
- **mesa to ocupacao_mesa**: one_to_many
- **garcom to ocupacao_mesa**: one_to_many
- **categoria_produto to produto**: one_to_many
- **cardapio to produto**: one_to_many
- **ocupacao_mesa to pedido**: one_to_many
- **garcom to pedido**: one_to_many
- **pedido to itens_do_pedido**: one_to_many
- **produto to itens_do_pedido**: one_to_many
- **itens_do_pedido to item_pedido_adicional**: one_to_many
- **adicionais to item_pedido_adicional**: one_to_many
- **unidade_medida to ingredientes**: one_to_many
- **produto to produto_ingrediente**: one_to_many
- **ingredientes to produto_ingrediente**: one_to_many
- **adicionais to adicional_ingrediente**: one_to_many
- **ingredientes to adicional_ingrediente**: one_to_many

## Database Diagram

```mermaid
erDiagram
	status_mesa ||--o{ mesa : references
	mesa ||--o{ ocupacao_mesa : references
	garcom ||--o{ ocupacao_mesa : references
	categoria_produto ||--o{ produto : references
	cardapio ||--o{ produto : references
	ocupacao_mesa ||--o{ pedido : references
	garcom ||--o{ pedido : references
	pedido ||--o{ itens_do_pedido : references
	produto ||--o{ itens_do_pedido : references
	itens_do_pedido ||--o{ item_pedido_adicional : references
	adicionais ||--o{ item_pedido_adicional : references
	unidade_medida ||--o{ ingredientes : references
	produto ||--o{ produto_ingrediente : references
	ingredientes ||--o{ produto_ingrediente : references
	adicionais ||--o{ adicional_ingrediente : references
	ingredientes ||--o{ adicional_ingrediente : references

	status_mesa {
		INTEGER id
		TEXT nome
		TEXT cor
		TEXT descricao
	}

	mesa {
		INTEGER id
		INTEGER numero
		INTEGER status_id
		INTEGER capacidade
		BOOLEAN ativa
		TEXT observacoes
		INTEGER tempo_total_ocupada
		INTEGER total_ocupacoes
	}

	ocupacao_mesa {
		INTEGER id
		INTEGER mesa_id
		INTEGER garcom_id
		DATETIME aberto_em
		DATETIME fechado_em
		INTEGER tempo_ocupada
		INTEGER pessoas
		DECIMAL(10,2) valor_total
		TEXT observacoes
	}

	garcom {
		INTEGER id
		TEXT nome
		TEXT telefone
		BOOLEAN ativo
	}

	cardapio {
		INTEGER id
		TEXT nome
		TEXT descricao
		BOOLEAN ativo
		DATE data_inicio
		DATE data_fim
	}

	categoria_produto {
		INTEGER id
		TEXT nome
		TEXT descricao
		INTEGER ordem_exibicao
	}

	produto {
		INTEGER id
		TEXT nome
		DECIMAL(10,2) preco
		DECIMAL(10,2) preco_meia
		BOOLEAN aceita_meia
		INTEGER categoria_id
		INTEGER cardapio_id
		BOOLEAN ativo
		TEXT descricao
	}

	pedido {
		INTEGER id
		INTEGER ocupacao_id
		INTEGER garcom_id
		DATETIME data_hora
		PEDIDO_STATUS status
		DECIMAL(10,2) valor_total
		TEXT observacoes
	}

	itens_do_pedido {
		INTEGER id
		INTEGER pedido_id
		INTEGER produto_id
		INTEGER quantidade
		DECIMAL(10,2) preco_unitario
		DECIMAL(10,2) subtotal
		TEXT adicionais
	}

	adicionais {
		INTEGER id
		TEXT nome
		DECIMAL(10,2) preco
		BOOLEAN ativo
	}

	item_pedido_adicional {
		INTEGER id
		INTEGER item_pedido_id
		INTEGER adicional_id
		INTEGER quantidade
	}

	unidade_medida {
		INTEGER id
		TEXT nome
		TEXT sigla
	}

	ingredientes {
		INTEGER id
		TEXT nome
		DECIMAL(10,2) quantidade
		INTEGER unidade_id
		BOOLEAN ativo
	}

	produto_ingrediente {
		INTEGER id
		INTEGER produto_id
		INTEGER ingrediente_id
		DECIMAL(10,2) quantidade
	}

	adicional_ingrediente {
		INTEGER id
		INTEGER adicional_id
		INTEGER ingrediente_id
		DECIMAL(10,2) quantidade
	}
```