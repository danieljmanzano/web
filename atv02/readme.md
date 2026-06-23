# Atividade 2
Repositório referente aos arquivos da Atividade 2 da disciplina, representando um Web Service para a loja de poções "Poções e Soluções".

## Execução
Tenha este repositório clonado localmente. Após isso:

```bash
cd atv02
npm install
node server.js
```

O servidor iniciará em **http://localhost:3000**. A página de administração fica em `/admin.html`.

> O banco de dados é SQLite em memória. Os dados são recriados a cada reinício do servidor com 6 poções pré-cadastradas.

## Organização
- A raiz da pasta contém o servidor (`server.js`), o `package.json` e este readme.
- `\info`: contém as especificações da atividade.
- `\public`: contém as páginas html e imagens do projeto.
- `\script`: contém os arquivos js (loja e admin).
- `\style`: contém os arquivos css.
