# Teste-NodeJS
API REST de agendamento de serviços

## EndPoints
```
GET /servicos
GET /servicos?descricao=bla&titulo=bla&id_tipo_servico
POST /servicos
DELETE /servicos
```

Obs: Criei um 'backup' do banco de dados, que está na pasta database, para caso queira usar no seu computador.

# Demonstração
### GET /servicos
O que retorna: <br>
![image](https://user-images.githubusercontent.com/65639478/168200340-e82d1c8e-1a26-449c-8655-19a509d07c0d.png)
![image](https://user-images.githubusercontent.com/65639478/168200319-2dd95410-f73c-42d4-b7be-03c6de50e703.png)

### GET /servicos?descricao=bla&titulo=bla&id_tipo_servico
O que retorna: <br>
![image](https://user-images.githubusercontent.com/65639478/168200393-4d94a9f7-92fd-4c1c-91cb-57a071801551.png)
![image](https://user-images.githubusercontent.com/65639478/168200409-ce723321-dae7-4a87-a149-f400f8b00937.png)

### POST /servicos
<strong>Sem agendamento </strong>
![image](https://user-images.githubusercontent.com/65639478/168200881-06bd8b47-0cb6-4fc0-a88f-8b49782683b8.png)

<strong>Com agendamento </strong>
![image](https://user-images.githubusercontent.com/65639478/168200908-b4e95cac-e35f-494a-8665-d09678b76271.png)

### DELETE /servicos
![image](https://user-images.githubusercontent.com/65639478/168201009-c8a02793-ed65-47ab-8dd9-2972e7b95514.png)
