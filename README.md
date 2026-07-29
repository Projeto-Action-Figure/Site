# Integrantes:
- Kauã Ribeiro Sales
- Laura Gonçalves de Carvalho
- Rafael Lopes Ribeiro
- Dominic Gorostiaga Vitorino

# Site de acessibilidade

# Pesquisa
## Lei Brasileira de Inclusão (Lei 13.146/2015)
### O que é essa lei?
A LBI (Lei Brasileira de Inclusão) é uma lei de Inclusão de Pessoa com Deficiência para promover a inclusão, igualdade, cidadania e acessibilidade das pessoas em diversos contextos, incluindo ambientes digitais.
- educação
- trabalho
- transporte
- tecnologia
No contexto digital, a lei assegura que **sites, aplicativos e sistemas sejam utilizáveis por qualquer pessoa, independentemente de suas limitações**.

### Quais as consequências?
De acordo com o **Art. 63** é obrigatório a acessibilidade em sistemas digitais, seguindo as melhores práticas internacionais de acessibilidade.
Na prática, isso impacta diretamente os desenvolvedores de sistemas:
- interfaces devem ser **perceptíveis, operáveis e compreensíveis**
- sistemas precisam ser compatíveis com **tecnologias assistivas** (ex: leitores de tela, sistema de áudio)
- deve existir **navegação por teclado e autonomia de uso**
- elementos visuais precisam ter **contraste adequado e alternativas textuais**

O desenvolvedor não pode focar apenas em estética ou funcionalidade — é necessário garantir que o sistema seja **acessível para todos os usuários**.

### Quais políticas uma empresa deve seguir?
Após a implementação dessa lei e sendo obrigatória em janeiro de 2016, muitas empresas tiveram que mudar drasticamente a acessibilidade e a logística da própria infraestrutura, como a implementação de:
- Estrutura física adaptada.
- Sistema da empresa acessível e autônomo.
- Comunicação acessível.
- Proibição da discriminação desde o recrutamento até o salário da pessoa.
- Treinamento acessível.

Além dessas mudança, as empresas também devem ter um certo número de cotas de pessoas deficientes, que não está na LBI, mas que está vetado na Lei 8.213/1991 no **Art. 93**, que varia de acordo com a quantidade de empregados na empresa.

#### Fontes
[Planalto (Lei 13.146/2015)](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13146.htm)

[Planalto (Lei 8.213/1991)](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13146.htm)

## Como um desenvolvedor jr no picpay deveria se proteger legalmente? Quais documentos e processos de trabalho evidenciam conformidade com a LBI?

### O que é essa lei?
A LBI (Lei Brasileira de Inclusão) garante os direitos das pessoas com deficiência no Brasil na internet, ela estabelece que a acessibilidade é obrigatória, isso significa que sites e aplicativos de órgãos públicos e empresas com atuação no país devem ser acessíveis.

### Quais as consequências?
De acordo com o **Art. 63** é obrigatório a acessibilidade em sistemas digitais, seguindo as melhores práticas internacionais de acessibilidade.

No entanto, a LBI não explica como um dev deve implementar essa acessibilidade na prática, é necessário utilizar diretrizes reconhecidas.

Na prática, isso impacta diretamente os desenvolvedores de sistemas:
- interfaces devem ser **perceptíveis, operáveis e compreensíveis**
- sistemas precisam ser compatíveis com **tecnologias assistivas** (ex: leitores de tela, sistema de áudio)
- deve existir **navegação por teclado e autonomia de uso**
- elementos visuais precisam ter **contraste adequado e alternativas textuais**

O desenvolvedor não pode focar apenas em estética ou funcionalidade — é necessário garantir que o sistema seja **acessível para todos os usuários**.

### Quais políticas uma empresa deve seguir?
Aí entra o **eMAG (Modelo de Acessibilidade em Governo Eletrônico)**, que adapta para o Brasil as recomendações da **WCAG (Web Content Accessibility Guidelines)**, um padrão internacional criado pelo W3C para orientar a acessibilidade na web.

Para um dev jr, não basta dizer que pensou em acessibilidade, é necessário provar. Essa comprovação vem do próprio processo de desenvolvimento:
- código bem estruturado
- critérios de aceitação que incluam acessibilidade
- checklists em pull requests
- registros de melhorias no sistema

A conformidade com a LBI não depende apenas da intenção, mas da aplicação prática de padrões como a WCAG e da capacidade de demonstrar isso de forma clara.

### Observação
Não encontrei artigos que respondiam a minha pergunta, mas pesquisei e encontrei os sites do WCAG, W3C, eMAG, da cartilha de acessibilidade digital e LBI, acho que isso já comprova o texto.

#### Fontes
[LBI](http://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13146.htm)  
[WCAG](https://www.w3.org/WAI/WCAG21/quickref/)  
[eMAG](https://www.gov.br/governodigital/pt-br/acessibilidade-e-usuario/emag)  
[Cartilha](https://www.gov.br/governodigital/pt-br/acessibilidade/cartilha-de-acessibilidade-digita)  
[W3C](https://www.w3.org/WAI/fundamentals/accessibility-intro/)

## Modelo de acessibilidade do governo eletrônico

### O que é?
O e-Mag é um conjunto de diretrizes e recomendações do Governo Federal brasileiro, cujo principal objetivo é garantir que os portais, sites e serviços digitais do governo sejam acessíveis a todos os cidadãos, incluindo pessoas com deficiência. O eMAG foi estabelecido em conformidade com o **Decreto nº 5.296**, de 2 de dezembro de 2004.  Mas o modelo não foi uma inovação do Governo Federal. na verdade, o eMAG segue os padrões de acessibilidade usados pelo mundo todo, como as Diretrizes de Acessibilidade para Conteúdo Web (WCAG) do Consórcio World Wide Web (W3C) 

### Aplicação
As quatro principais situações vivenciadas por usuários com deficiência são: 
- **Acesso ao computador sem mouse:** no caso de pessoas com deficiência visual, dificuldade de controle dos movimentos, paralisia ou amputação de um membro superior;
- **Acesso ao computador sem teclado**: no caso de pessoas com amputações, grandes limitações de movimentos ou falta de força nos membros superiores;
- **Acesso ao computador sem monitor**: no caso de pessoas com cegueira;
- **Acesso ao computador sem áudio**: no caso de pessoas com deficiência auditiva.

Muitas pessoas também apresentam outras limitações relacionadas à memória, resolução de problemas, atenção, compreensão verbal, leitura e linguística, compreensão matemática e compreensão visual. Para garantir a acessibilidade de pessoas com deficiência, a página deve ser desenvolvida de acordo com os padrões Web.


### Como desenvolver um site acessível?
Há 3 passos principais:
- Padrões Web: O site precisa estar em conformidade com as regras de HTML, CSS, XHTML e XML. **Seguindo as normas de de formatação e sendo semanticamente correto**
- Recomendações de acessibilidade: As recomendações de acessibilidade **(que incluem marcação, comportamento, informação, design, multimídia e formulário)** mostram como tornar o conteúdo Web acessível a todas as pessoas
- Avaliação de acessibilidade: Após a criação do site de acordo com os padrões Web e as diretrizes de acessibilidade, é necessário testá-lo para garantir sua acessibilidade. Deve-se lembrar que após cada teste, **os ajustes devidos devem ser feitos e novamente testados.**

#### Fontes
[eMAG](https://emag.governoeletronico.gov.br/)

[GOV.BR](https://www.gov.br/governodigital/pt-br/acessibilidade-e-usuario/acessibilidade-digital/modelo-de-acessibilidade)

## ADA — Americans with Disabilities Act
### O que é?
A ADA é uma lei federal dos Estados Unidos, criada em 1990, que proíbe a discriminação contra pessoas com deficiência e garante igualdade de acesso em diversas áreas, como trabalho, serviços públicos, empresas e ambientes digitais.
Como funciona?
A ADA é dividida em partes chamadas Titles, que organizam suas regras de acordo com o tipo de instituição:


- Title I: trata do emprego e garante igualdade de oportunidades, exigindo adaptações razoáveis quando necessário.


- Title II: regula governos estaduais e locais, incluindo serviços públicos e acessibilidade em sites e aplicativos.


- Title III: regula empresas abertas ao público, como lojas, bancos e e-commerces, sendo o principal foco da acessibilidade digital no setor privado.


### Acessibilidade digital
Mesmo sendo criada antes da internet, a ADA passou a ser aplicada ao ambiente digital, exigindo que sites, aplicativos e sistemas sejam acessíveis, especialmente nos Titles II e III.
Processos em 2023
Em 2023, foram registradas 2.794 ações federais relacionadas à acessibilidade de websites nos EUA, mostrando que o tema se tornou uma questão jurídica relevante.

### Governo Trump
Durante o governo Trump, a ADA não foi revogada, mas em 2017 foram retiradas propostas de regulamentação sobre acessibilidade web, o que reduziu a clareza na aplicação da lei no ambiente digital.

#### Fontes
ADA.gov — Introduction to the ADA

ADA.gov — Web Accessibility Guidance

EEOC — ADA Title I

Seyfarth Shaw — Website Accessibility Lawsuits 2023

Federal Register — Withdrawal of ADA web rules (2017)
