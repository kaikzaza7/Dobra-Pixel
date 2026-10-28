# Dobra Pixel

Um espaço pessoal de leitura para smartphone e desktop. Biblioteca sem conta, com a identidade **Página Viva**, verde de capa `#243D34` e papel creme `#F3EBDD`.

## O que funciona

- Importação múltipla de PDF e AZW3 sem DRM, por seletor de arquivos ou arrastar e soltar.
- Capa de PDF gerada da primeira página e capa incorporada de AZW3 quando disponível.
- Filtros Todos, Lendo, Lidos e Não iniciados; busca por título/autor; grade/lista e ordenação.
- Leitura de PDF por página, zoom, navegação direta, setas do teclado e gesto horizontal no celular.
- AZW3 com paginação fluida, ajuste de tamanho de texto e restauração por CFI (posição de texto, inclusive após redimensionar).
- Temas Cinza (padrão), Papel e Noite, luminosidade e modo de concentração.
- Arquivos e progresso persistidos em IndexedDB, preferências locais, remoção, reinício de leitura e download do original.
- PWA instalável, ícones próprios e cache offline da aplicação. A primeira abertura exige conexão; recursos pesados de PDF são guardados após uso.
- O PDF fornecido pelo proprietário, **Complexo de vira-lata**, inicia a biblioteca uma única vez por navegador. Se removido, não reaparece sozinho. Esse arquivo é conteúdo pessoal e não recebe uma licença de distribuição do código.

## Rodar

Requisitos: Node.js 22.12+ (recomendado 24) e npm.

```sh
npm ci
npm run dev
```

```sh
npm test
npm run build
npm run preview
```

A saída de produção fica em `dist/`. Pode ser hospedada em qualquer servidor estático HTTPS. O projeto usa caminhos a partir da raiz do domínio; em uma subpasta, é necessário adaptar os caminhos dos assets, do manifesto e do service worker.

## Dados e privacidade

Não existe backend de livros nem login no aplicativo. Os arquivos importados não são enviados a um servidor. Cada navegador e aparelho tem sua própria biblioteca. Limpar os dados do navegador ou usar outro aparelho não transfere a estante: mantenha os arquivos originais. O PDF de exemplo incluído no código é servido na mesma origem e importado localmente na primeira abertura. Mantenha a hospedagem e este repositório privados enquanto esse conteúdo pessoal estiver incluído.

## Compatibilidade e limites

Navegadores atuais com IndexedDB, Canvas e módulos JavaScript (Chrome/Edge, Firefox, Safari). PDFs são páginas fixas: o zoom amplia a página, sem reorganizar os parágrafos. A opção Cinza é um tratamento visual de uma tela comum, não simula fisicamente e-ink. PDFs com senha e livros com DRM não são suportados. Limite de importação: 200 MB por arquivo, sujeito ao espaço e à memória disponíveis no aparelho. No AZW3, o progresso é uma estimativa por posição de texto e não corresponde às páginas de uma edição impressa.

## Estrutura

- `src/main.js`: biblioteca e fluxo de leitura.
- `src/books.js`: importação, capas, validação e limpeza de HTML de livros.
- `src/readers.js`: renderizadores PDF e AZW3.
- `src/storage.js`: persistência e gravações atômicas de progresso.
- `src/model.js`: filtros, busca, progresso e mensagens.
- `public/brand/`: identidade vetorial aprovada.
- `public/vendor/foliate/`: Foliate JS fixado no commit `78914aef4466eb960965702401634c2cb348e9b1`, licença MIT e licenças das dependências preservadas.
- `scripts/prepare-assets.mjs`: copia fontes, CMaps e WASM do PDF.js instalado.
- `scripts/build-sw.mjs`: gera o cache offline com versão baseada no conteúdo.
- `tests/model.test.mjs`: regras de progresso, busca, filtros e erros.

PDF.js é Apache-2.0, Foliate JS e fflate são MIT, zip.js é BSD-3-Clause. Os arquivos SVG do logotipo possuem letras em curvas e não exigem fonte instalada. As fontes de interface DejaVu têm sua licença em `public/fonts/LICENSE.txt`.
