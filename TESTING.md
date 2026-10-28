# Verificação da primeira versão

## Automatizado

`npm test`: 5 testes passaram. Cobrem posição de PDF, conclusão de leitura, busca com acentos, combinação de filtros/ordenação e mensagens para arquivos protegidos ou falta de espaço.

`npm run build`: bundle estático e service worker gerados com sucesso.

`npm audit --omit=dev`: nenhuma vulnerabilidade informada nas dependências de produção nesta implementação.

## Navegador Chromium

- Importação do PDF fornecido (208 páginas), capa gerada da página 1 e autor ajustado para Marcia Tiburi.
- Avanço de página e navegação direta até a página 17.
- Saída para a biblioteca e recarregamento: página 17 e 8% mantidos.
- Importação de um AZW3 real de teste (documentação Spring, via repositório regueiro/spring-reference-ebook), abertura e virada de páginas.
- Recarregamento do AZW3 preservou a posição de texto (posição 5 de 3558 no tamanho de tela usado).
- Layout de biblioteca e leitura conferidos em área de 390 × 844 px; modo Noite aplicado no PDF e retorno à posição salva.
- O arquivo AZW3 usado nos testes não está incluído na distribuição.

## Limites da verificação

Não houve teste em aparelho físico ou navegador Safari/iOS. A instalação PWA, o uso prolongado offline e arquivos com variantes de AZW3 diferentes do exemplar testado ainda merecem testes nesses ambientes. O salvamento local não sincroniza aparelhos e depende do armazenamento mantido pelo navegador.
