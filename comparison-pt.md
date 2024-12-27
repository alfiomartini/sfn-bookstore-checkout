### Tabela: Aspectos e Step Functions

| **Aspecto**                    | **Step Functions**                                                                                |
| ------------------------------ | ------------------------------------------------------------------------------------------------- |
| **Estilo de Implementação**    | Code-first, declarativo via templates SAM                                                         |
| **Gerenciamento de Estado**    | Estado é gerenciado nativamente no Step Functions (via InputPath, OutputPath, etc.)               |
| **Tratamento de Erros**        | Avançado, com Catch, Retry e Caminhos de Falha para cada estado                                   |
| **Integração com AWS**         | Integração nativa com serviços AWS como Lambda, SNS, SQS                                          |
| **Execução Assíncrona**        | Tokens de tarefa e invocações desacopladas permitem execução assíncrona                           |
| **Escalabilidade**             | Escalabilidade automática com a infraestrutura da AWS, sem necessidade de gerenciar workers       |
| **Representação Visual**       | O fluxo de trabalho do Step Functions é definido em templates SAM e visualizado no Console da AWS |
| **Curva de Aprendizado**       | Requer familiaridade com serviços da AWS e templates SAM                                          |
| **Flexibilidade na Definição** | Altamente flexível com funções Lambda personalizadas e outros serviços AWS                        |
| **Stateful vs Stateless**      | Stateful – o fluxo de trabalho mantém o estado                                                    |
| **Paralelismo e Concorrência** | Suporta paralelismo via estado Parallel e espera por tarefas                                      |

### Tabela: Aspectos e Camunda 8 SaaS

| **Aspecto**                    | **Camunda 8 SaaS**                                                                                       |
| ------------------------------ | -------------------------------------------------------------------------------------------------------- |
| **Estilo de Implementação**    | Baseado em modelos, BPMN visual com tarefas predefinidas                                                 |
| **Gerenciamento de Estado**    | Estado é armazenado em variáveis de processo, facilmente manipuladas via Script Tasks                    |
| **Tratamento de Erros**        | Tratado por meio de eventos de erro e limites de erro BPMN (Catch Events)                                |
| **Integração com AWS**         | Integração via conectores, como Conector Lambda para invocação direta                                    |
| **Execução Assíncrona**        | Tarefas de serviço com conectores podem ser assíncronas, usando workers externos ou o worker do conector |
| **Escalabilidade**             | Gerenciado pela Camunda, escalabilidade automática, mas workers personalizados podem ser necessários     |
| **Representação Visual**       | Camunda 8 fornece um diagrama BPMN visual totalmente editável                                            |
| **Curva de Aprendizado**       | Requer entendimento de BPMN e modelagem de processos na Camunda                                          |
| **Flexibilidade na Definição** | Modelagem BPMN flexível com tarefas avançadas, subprocessos e conectores                                 |
| **Stateful vs Stateless**      | Stateful – o estado é armazenado nas variáveis do processo                                               |
| **Paralelismo e Concorrência** | Suporta paralelismo por meio de tarefas multi-instância, gateways baseados em eventos, etc.              |
