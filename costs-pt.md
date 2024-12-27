| **Aspecto**                | **AWS Step Functions**                                    | **Camunda 8 SaaS (Plano Start)**                        |
| -------------------------- | --------------------------------------------------------- | ------------------------------------------------------- |
| **Modelo de Preço**        | Pay-per-use (transições de estado e invocações de Lambda) | Assinatura mensal com limites e preços por PI           |
| **Métrica**                | Transições de estado e invocações de Lambda               | Instâncias de processo (PI)                             |
| **Custo Base Mensal**      | Sem custo fixo mensal                                     | US$ 99/mês (10 usuários, 50 PI)                         |
| **Transições de Estado**   | US$ 0,025 por 1.000 transições                            | N/A                                                     |
| **Invocações de Lambda**   | US$ 0,20 por 1 milhão de invocações                       | N/A                                                     |
| **Custo de Cluster**       | N/A                                                       | ~US$ 720/mês (cluster de produção)                      |
| **Custo por PI Adicional** | N/A                                                       | US$ 2,00 por PI acima dos 50 incluídos                  |
| **Custo para ~400 PI/Mês** | N/A                                                       | ~US$ 1.500/mês (350 PI \* US$ 2 + US$ 720)              |
| **Escalabilidade**         | Altamente escalável automaticamente                       | Escalabilidade dependente do plano e limites do cluster |
