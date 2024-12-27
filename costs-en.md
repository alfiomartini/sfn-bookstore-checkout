| **Aspect**                  | **AWS Step Functions**                                 | **Camunda 8 SaaS (Start Plan)**                     |
| --------------------------- | ------------------------------------------------------ | --------------------------------------------------- |
| **Pricing Model**           | Pay-per-use (state transitions and Lambda invocations) | Monthly subscription with limits and per-PI pricing |
| **Metric**                  | State transitions and Lambda invocations               | Process Instances (PI)                              |
| **Base Monthly Cost**       | No fixed monthly cost                                  | US$ 99/month (10 users, 50 PIs)                     |
| **State Transitions**       | US$ 0.025 per 1,000 transitions                        | N/A                                                 |
| **Lambda Invocations**      | US$ 0.20 per 1 million invocations                     | N/A                                                 |
| **Cluster Cost**            | N/A                                                    | ~US$ 720/month (production cluster)                 |
| **Cost per Additional PI**  | N/A                                                    | US$ 2.00 per PI above the 50 included               |
| **Cost for ~400 PIs/Month** | N/A                                                    | ~US$ 1,500/month (350 PI \* US$ 2 + US$ 720)        |
| **Scalability**             | Highly scalable automatically                          | Scalability depends on the plan and cluster limits  |
