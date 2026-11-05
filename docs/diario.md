# Diário de desenvolvimento — Lombada Sonora

Registro do que construí, das decisões que tomei e dos problemas que resolvi em cada etapa do projeto.

Modelo para as próximas entradas:

```markdown
## AAAA-MM-DD — Sessão X: título

**O que fiz**
**Decisões**
**Problemas e soluções** (o que acontecia → por que → o que fiz)
**Aprendi**
**Dúvidas**
```

---

## Planejamento (23/09 a 08/10)

**O que fiz**

- Escolhi a ideia: uma coleção de discos em que os álbuns aparecem pelas lombadas numa estante, em vez da grade de capas comum em catálogos de música.
- Fiz uma primeira versão de treino (`estante-de-discos`), com tema escuro, e depois recomecei do zero com um visual novo.

**Decisões**

- **Visual "sala de escuta":** fundo verde-sálvia com textura pontilhada, madeira, cores desbotadas nas lombadas e um único destaque laranja (`ember`). Fontes sem serifa: Bricolage Grotesque (títulos), DM Sans (texto) e DM Mono (etiquetas e metadados).
- **Layout em tela dividida:** painel fixo à esquerda com o toca-discos e a ficha do disco; estante à direita. Escolhi esse layout por ser diferente da referência e do meu portfolio.
- **Função real do projeto:** catálogo pessoal com prévia de áudio de 30 segundos (API do iTunes). Um player completo, tipo Spotify, exigiria login e conta premium.
- **Versão 1 sem usuários:** tudo no navegador. Login e banco de dados (Supabase) ficam para uma versão 2, com um link público da estante de cada pessoa.

---

## Sessão 1: fundação

**O que fiz**

- Projeto com Vite, React e Tailwind CSS v4.
- Tema no `@theme` do `index.css`: cada variável vira classe automaticamente (`--color-ember` gera `bg-ember`, `text-ember`...).
- Esqueleto de duas colunas com `grid-cols-[320px_1fr]`.

**Decisões**

- Tags semânticas: `aside` para o painel e `main` para a estante.
- A linha que separa as colunas é uma `div` com `absolute`, que não encosta no topo nem na base. Como é só decoração, tem `aria-hidden="true"`.

**Aprendi**

- Valores arbitrários do Tailwind com colchetes, e `_` no lugar de espaço.
- `@layer base` com `@apply` para estilos globais.

---

## Sessão 2: a estante

**O que fiz**

- `Spine` (lombada), `Shelf` (prateleira) e `Collection` (estante inteira).
- Função `chunk` para dividir os discos em prateleiras de 6.

**Decisões**

- Texto da lombada lido de baixo para cima (`rotate-180`), como nas lombadas brasileiras.
- Nomes longos cortados com reticências (`truncate`). O nome completo aparece no painel.
- Cada componente com uma responsabilidade: o `Shelf` desenha uma prateleira; o `Collection` decide quantas prateleiras existem.

**Problemas e soluções**

- **Título e artista lado a lado em vez de em pontas opostas** → com `writing-mode` vertical, os eixos do flex giram, e o `flex-col` passa a ser horizontal → troquei por `flex`.
- **Cantos arredondados embaixo da lombada** → o `rotate-180` gira o elemento inteiro, inclusive os cantos → usei `rounded-b-sm`, que depois de girar fica em cima.
- **Hover cortado no topo da lombada** → o `overflow-x-auto` obriga o `overflow-y` a esconder o que vaza → removi, porque com várias prateleiras a rolagem horizontal deixou de ser necessária.
- **Os grupos de discos ficavam todos numa prateleira só** → o `chunk` estava no `Shelf`, que desenhava todos os grupos lado a lado → movi a divisão para o `Collection` (refatoração).
- **Cor dinâmica não funcionava com classe** → o Tailwind gera as classes antes do código rodar e não enxerga valores vindos dos dados → cor e altura vão pelo `style`.

**Aprendi**

- Props, `.map()` e `key`.
- `shrink-0` e `min-h-0` em itens de flex.
- `key={index}` é seguro quando os itens não mudam de ordem nem guardam estado.

---

## Sessão 3: selecionar um disco

**O que fiz**

- Estado `selectedId` no `App`, com o clique subindo da lombada por uma função (`onSelect`).
- Clicar de novo no disco selecionado o devolve à estante.
- Lombada selecionada levantada e com contorno laranja.

**Decisões**

- **Guardar só o `id`, e não o objeto do disco:** uma única fonte da verdade. Se guardasse o objeto, teria duas cópias do mesmo disco, e uma poderia ficar desatualizada.
- **O estado mora no `App`** porque a estante (onde acontece o clique) e o painel (onde o disco aparece) precisam dele. Isso se chama elevar o estado.
- **O `Shelf` entrega ao `Spine` um `isSelected` pronto** (`true`/`false`), e não o `id`. O `Spine` só exibe e avisa cliques.
- **Lombada como `button`**, e não `div`: funciona com teclado e leitor de tela. Com `focus-visible` e `aria-pressed`.

**Problemas e soluções**

- **Barra de rolagem vertical que nunca sumia** → `mt-4` somado ao `min-h-screen` deixava a página com 100% da tela + 1rem → troquei por `pt-4`.

**Aprendi**

- `useState`, atualização com função (`setX((atual) => ...)`) quando o novo valor depende do anterior.
- `onClick={() => fn(id)}` e não `onClick={fn(id)}`, que executaria na hora.
- _Prop drilling_: componentes do meio repassando props que não usam.

---

## Sessão 4: o painel "tocando agora"

**O que fiz**

- `NowPlaying`, `AlbumDetails` e `Turntable` (toca-discos todo em CSS).
- Nota pessoal em cada disco e botão para devolver o disco à estante.
- Projeto no GitHub e renomeado para **Lombada Sonora**.

**Decisões**

- O toca-discos é feito todo em porcentagem, para escalar junto com o painel.
- O vinil gira a 33⅓ rpm, ou seja, uma volta a cada 1,8 segundo.
- Sequência da animação: o disco pousa e, depois, o braço desce (`delay-300` só na descida).
- `motion-safe:` para respeitar quem ativou "reduzir movimento".
- Painel `sticky`, que fica parado enquanto a estante rola.
- `aria-live` só na ficha do disco, para o leitor de tela anunciar a troca sem ler o painel inteiro.

**Problemas e soluções**

- **O vinil parecia parado** → o DevTools mostrou que a animação estava rodando; o problema é que um círculo simétrico girando parece parado → coloquei um arco claro no selo (borda só em cima), que dá referência ao olho.
- **A animação de entrada só rodava no primeiro disco** → ao trocar de disco, o React reaproveitava o mesmo elemento → `key={album.id}` faz o React criar um elemento novo a cada disco.
- **A nota não aparecia na tela** → código e dados estavam certos, e o `console.log` mostrou o objeto sem a nota → o servidor do Vite estava preso numa versão antiga; reiniciar resolveu.
- **Aviso de conflito entre `sticky` e `relative`** → as duas classes mexem na mesma propriedade (`position`) → removi o `relative`; o `sticky` também serve de referência para filhos `absolute`.
- **Renomeei a pasta errada** → o terminal mostrou um caminho e datas de criação do projeto de treino → renomeei a pasta certa; o histórico do Git estava intacto.

**Aprendi**

- Três jeitos de renderização condicional: retorno antecipado, ternário e `&&`.
- Fragment (`<> </>`) para agrupar sem criar elemento no HTML.
- `@keyframes`, `@utility` e `--animate-*` no tema.
- Git: `init`, `add`, `commit`, `remote`, `push` e Conventional Commits (`feat`, `fix`, `docs`, `chore`).

---

## Sessão 5: a prévia de áudio

**O que fiz**

- Busca da prévia na API do iTunes a cada disco escolhido.
- O disco começa a tocar ao entrar no toca-discos; botão de play/pausa na base da radiola.
- O vinil gira só enquanto a música toca.
- Mensagens de "buscando a faixa", "prévia indisponível" e o nome da faixa tocando.
- O foco volta para a lombada quando o disco é devolvido pelo teclado.

**Decisões**

- Cada disco tem uma faixa escolhida por mim (`track`), e a busca usa artista + faixa.
- A função de busca fica em `services/itunes.js`; os componentes não conhecem URLs.
- **Etiqueta no estado:** o link da prévia é guardado junto com o `id` do disco a que pertence (`{ albumId, url }`). Carregando, indisponível e pronto são calculados a partir disso, sem estados extras.
- Botão de play com efeito de "afundar" no clique, sem mudar de cor, porque o laranja é reservado para destaque.
- Botão "Devolver" no topo do painel, ao lado do "Tocando agora", com a seta apontando para a estante.

**Problemas e soluções**

- **O `&` no nome do artista quebraria a URL** → o `&` separa parâmetros → `URLSearchParams` codifica o texto.
- **Ao trocar de disco, o link do disco anterior aparecia por um instante** → o estado guardava só o link, sem saber de qual disco era → passei a guardar o `albumId` junto e conferir antes de usar.
- **Clicando rápido, a resposta de um disco antigo podia sobrescrever a do novo** → as respostas chegam fora de ordem → `let ignore` e a função de limpeza do `useEffect`.
- **Erro "cannot access before initialization"** → o `isPlaying` usava o `previewUrl` antes de ele ser declarado → organizei o componente em blocos: hooks, efeitos, valores derivados, funções.
- **O vinil não pausava** → a classe `motion-safe:animate-spin-record` redefinia o `animation-play-state` e vencia a minha classe de pausa → usei `style={{ animationPlayState }}`, que tem prioridade sobre classes.
- **Sem internet, o painel ficaria "buscando" para sempre** → a promessa rejeitada não era tratada → `.catch`, e `throw` quando a resposta não é `ok`.
- **Não conseguia ver o "buscando" no teste com 3G lento** → o navegador entregava a resposta guardada no cache → marquei "Desativar cache" na aba Rede.
- **O disco do Otto sempre "indisponível"** → a aba Rede mostrou zero resultados; no console, a mesma busca encontrava a música. A diferença era o `limit`: com 1, a API descartava o resultado → passei a pedir 5 e escolher o primeiro com prévia (`.find`).
- **O painel ficava maior que a tela** e o botão de devolver sumia → movi o botão para o topo, limitei o toca-discos pela altura da tela (`max-w-[38vh]`, só nele, não no texto) e diminuí títulos longos.
- **O "Devolver" parecia maior que o "Tocando agora"** com o mesmo `text-xs` → o ícone tinha 14px, mais alto que as letras maiúsculas → ícone em `size-3` e etiqueta em `text-sm`.
- **Pelo teclado, o foco se perdia ao devolver o disco** → o botão some e o foco volta para o início da página → um "caderno" (`Map` dentro de um `useRef`) com a lombada de cada disco, preenchido por um ref de callback; ao devolver, `.focus()` na lombada.

**Aprendi**

- `fetch`, promessas, `async/await`, `.then` e `.catch`.
- `useEffect`, array de dependências e função de limpeza.
- `useRef` para comandar elementos (`.play()`, `.pause()`, `.focus()`).
- Atributo `ref` (canal de entrega do elemento) é diferente do `useRef` (caixa que sobrevive entre renderizações).
- No React 19, `ref` chega como prop comum; antes era preciso `forwardRef`.
- Investigar pela aba Rede, pelo console e pela aba Computed.

---

## Sessão 6: filtros por gênero

**O que fiz**

- Botões de filtro com todos os gêneros da coleção, gerados a partir dos dados.

**Decisões**

- **Só o gênero escolhido é estado.** A lista de gêneros, os discos visíveis e as prateleiras são calculados. Regra: se dá para calcular a partir do que já existe, não é estado.
- **O estado do filtro mora no `Collection`**, o componente mais baixo que enxerga todos que precisam dele. O painel não sabe nada do filtro, então a música continua tocando ao filtrar.
- Os botões ativos e inativos têm borda nos dois estados, só muda a cor, para não "pularem" de tamanho.
- Ao devolver um disco escondido pelo filtro, o foco vai para o botão do filtro ativo. Assim a decisão da pessoa é respeitada e o leitor de tela explica por que o disco não aparece.

**Problemas e soluções**

- **`aria-label` numa `div` sem efeito** → elementos genéricos não podem ter nome → `role="group"`.
- **O foco não chegava ao filtro ativo** → dois `console.log` mostraram que a lombada não estava no caderno (certo) e que a caixa do filtro estava vazia → o `Collection` não repassava o `activeFilterRef`. Um `ref={undefined}` não dá erro nenhum, por isso o bug era silencioso.
- **`git push` falhando com frequência** → `Test-NetConnection` mostrou que o ping funcionava, mas a conexão na porta 443 falhava num endereço específico do GitHub → problema de rede, não do Git; os commits ficam salvos e insistir no push resolve.

**Aprendi**

- `Set` para tirar repetidos, _spread_ (`[...set]`), `.filter()`, `localeCompare`.
- `ref` condicional: `ref={isActive ? minhaRef : null}`.
- Investigar um caminho de props dividindo em etapas.

---

## Sessão 7: busca e novos discos (em andamento)

**O que fiz**

- Função `searchAlbums` e componente `AlbumSearch`, com campo de busca e lista de resultados.
- Botão "Adicionar" em cada resultado: o disco ganha uma lombada na estante, com cor e altura sorteadas. Discos que já estão na estante mostram "Na estante".
- Os discos adicionados tocam a prévia de uma faixa do próprio álbum.
- Os meus discos originais também são reconhecidos como "Na estante" na busca.
- A busca fecha com a tecla Esc ou com o botão "Limpar", e o foco volta para o campo.
- Ao adicionar um disco pelo teclado, o foco fica no "Na estante" daquele resultado.
- Modo de remover discos: o botão "Remover discos" faz as lombadas balançarem e ganharem um "×"; nesse modo, clicar numa lombada não toca a música.

**Decisões**

- O estado da busca fica no próprio `AlbumSearch`, porque só ele usa.
- A função de busca "traduz" os dados da API para o formato do projeto (adaptador). Se um dia trocar de API, só o `itunes.js` muda.
- Busca só a partir de 2 caracteres e só depois de 400ms sem digitar (debounce).
- Resultados também com "etiqueta" (`{ term, results, failed }`).
- A coleção virou estado no `App`; o `albums.js` passou a ser só o valor inicial.
- "Na estante" é calculado com `.some()` a partir da coleção, então muda sozinho quando um disco é adicionado.
- Os gêneros novos aparecem nos filtros automaticamente, porque a lista de gêneros é calculada a partir da coleção.
- **A prévia é buscada na hora de tocar, e não ao adicionar.** Uma única função, `getPreview`, decide o caminho: discos com faixa buscam por artista + faixa; discos sem faixa consultam o álbum pelo id (lookup). As duas devolvem o mesmo formato, `{ url, track }`.
- **Dois discos são o mesmo** se tiverem o mesmo id, ou o mesmo título e artista depois de normalizados (minúsculas, sem acentos, sem espaços extras e sem o que está entre parênteses). A mesma função (`isSameAlbum`) é usada no "Na estante" e na proteção contra duplicados.
- Depois de "Adicionar", a lista de resultados continua aberta: é ali que aparece o "Na estante", e dá para adicionar vários discos da mesma busca.
- O botão se chama "Remover discos", e não "Organizar": o rótulo deve dizer exatamente o que o modo faz. Se um dia o modo ganhar outras ações, o nome muda.

**Problemas e soluções**

- **Uma busca saía a cada palavra digitada** → o efeito dependia do texto já sem espaços (`trim`), então o espaço não reiniciava o tempo do debounce → o efeito passou a depender do texto exato do campo, com o `trim` feito dentro dele.
- **Os dois arquivos da `src/utils` foram apagados sem querer** → o `git status` mostrou `deleted:` → recuperei com `git restore src/utils`. Nunca usar `git restore .` com mudanças que ainda não estão num commit, porque ele desfaz tudo.
- **Erro `albums.some is not a function`** → o `albums` chegava ao componente, mas não era uma lista. Diferente de `Cannot read properties of undefined`, que significa que a prop não chegou.
- **Os discos novos tocavam música de outro artista** → eles têm `track: null`, e numa template string o `null` vira o texto `"null"`; a busca ia como "Alabama Shakes null" → para os discos sem faixa, a prévia passou a ser buscada pelo id do álbum (lookup do iTunes), que traz as faixas exatas daquele disco.
- **Disco adicionado offline ficava sem música para sempre** → a faixa era buscada só no momento de adicionar; se a busca falhasse, o `null` ficava gravado e ninguém tentava de novo → a prévia passou a ser buscada na hora de tocar. Assim uma falha momentânea nunca vira permanente, e o "Adicionar" ficou instantâneo.
- **Os meus discos originais não apareciam como "Na estante"** → eles têm ids de 1 a 18, inventados por mim, e a busca traz os ids do iTunes → a comparação passou a considerar também título e artista.
- **Transa não era reconhecido como "Na estante"** → no catálogo, o título vinha como "Transa (2012 Remaster)" e "Transa (Remasterizado)" → a normalização passou a ignorar o que está entre parênteses e colchetes. O Nevermind não é reconhecido porque não está na loja brasileira do iTunes.
- **Gêneros duplicados em idiomas diferentes** ("Alternativo" e "Alternative") → a loja BR do iTunes dá os gêneros em português, e alguns dos meus estavam em inglês → pendente.
- **ESLint avisou `no-useless-assignment`** → o `track` começava como `null` e era sobrescrito tanto no `try` quanto no `catch`, então o valor inicial nunca era usado → o aviso deixou de existir quando o `handleAdd` voltou a ser simples.
- **O foco se perdia ao adicionar um disco pelo teclado** → o botão "Adicionar" é trocado pelo texto "Na estante", e no momento do clique o "Na estante" ainda não existe → guardo o id do disco adicionado num estado (`justAddedId`) e um `useEffect`, que roda depois da tela atualizar, dá o foco no "Na estante" daquele disco, achado num caderno de refs.
- **Depois de renomear com F2, o modo parou de aparecer nas lombadas** → o VS Code renomeou a variável no `Spine` mas manteve o nome antigo da prop (`isOrganizing: isRemoving`), enquanto o `Shelf` já enviava `isRemoving` → deixei o mesmo nome dos dois lados. A sintaxe `{ nomeQueChega: nomeQueUso }` renomeia durante a desestruturação.

**Aprendi**

- Input controlado: o estado é o dono do texto (`value` + `onChange`).
- `label` com `htmlFor` e `sr-only`; o placeholder não substitui o rótulo.
- Debounce com `setTimeout` e `clearTimeout` na limpeza do `useEffect`.
- Escopo: as variáveis de uma função só existem dentro dela.
- Nunca modificar o estado com `push`; criar uma lista nova com `[...current, novo]`.
- `.some()`: "algum item da lista passa nesta condição?".
- `import { x as y }` para renomear um import.
- `ml-auto` dentro de um `flex` empurra o elemento para o fim da linha.
- `try`/`catch` com `async/await`, e `.catch(() => null)` direto numa promessa.
- Funções sem `export` ficam "internas" ao arquivo.
- Buscar um dado no momento em que ele é necessário, e não antes.
- Normalizar textos para comparar: `toLowerCase`, `normalize("NFD")` e expressões regulares.
- Funções criadas com `function` podem ser usadas antes da linha onde estão (_hoisting_); variáveis com `const`, não.
- Limpar o console e reproduzir o problema, para ver só os erros atuais.
- `onKeyDown` e `event.key` para reagir a uma tecla específica.
- Usei `useRef` e `.focus()` sozinho pela primeira vez, para devolver o foco ao campo de busca depois de limpar.
- `tabIndex={-1}`: o elemento pode receber foco pelo código, mas não entra na ordem do Tab.
- O `useEffect` roda depois de a tela atualizar, então serve para dar foco num elemento que acabou de aparecer.
- Arrow function sem chaves devolve o resultado; com chaves, só devolve se tiver `return`. Num ref de callback, o que é devolvido vira a função de limpeza.

**Dúvidas**

- Nenhuma por enquanto.

---

## Pendências

- **Nota dos discos:** permitir escrever ou editar a nota de qualquer disco, inclusive os adicionados pela busca. Provável lugar: no painel "Tocando agora", abaixo da ficha, um botão "Adicionar nota" (ou "Editar nota") que abre um campo de texto. Depende da sessão 8 para a nota ficar salva depois de recarregar a página.
- **Remover disco (etapas 2 a 4):** modal (`<dialog>`) "Remover 'X' da estante?", aberto ao clicar numa lombada no modo de remover, com o foco começando no "Cancelar". A função `handleRemove` no `App` tira o disco da coleção e do toca-discos. Depois de remover, o foco vai para o botão "Concluir"; tratar o caso de remover o último disco do gênero filtrado.
- **Para pensar:** o disco deveria começar a tocar sozinho ao ser selecionado, ou só ao apertar o play?
- **Gêneros:** padronizar os nomes em português, como a loja BR do iTunes.
- **Filtros de gênero:** mostrar só os 6 a 8 gêneros com mais discos e um botão "+N gêneros" para expandir. O gênero ativo aparece sempre, mesmo se não estiver entre os mais frequentes. Fazer junto com a padronização dos gêneros.
- **Parte 4:** atalho de teclado para focar a busca.
- **Sessão 8:** salvar a coleção no navegador.
- Reescrever as notas dos discos com frases pessoais.
- Corrigir a nota do disco _Nação Zumbi_ (o primeiro de estúdio pós-Chico Science foi _Rádio S.Amb.A_, de 2000).
- Conhecer o Context para reduzir o _prop drilling_.
- Layout para celular.
- Seção "Desafios e aprendizados" no README, a partir deste diário.
