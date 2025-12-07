Logging é o ato de registar informações importantes do funcionamento de um sistema, como:

* Erros execeções; 
* Processos críticos; 
* Performance e métricas; 
* Eventos de negócio importantes

- Facilitia a identificação de erros e problemas em produção;
- Permite monitoramento e auditoria; 
- Ajuda em otimização de performance


O NestJS já vem com um logger interno. 
Nivel de log no NestJS: 

- log() -> informação geral
- error() -> Erros
- warn() -> avisos
- debug() -> depuração 
- verbose() -> logs muito detalhados

Num projeto precisamos de: 

- Logging middleware para todas as requisicoes http
- configuracao do winstons
- Logging de eventos de negocios