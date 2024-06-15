To be able to run the project :
- Install bun (https://bun.sh/docs/installation)
- Install python

Dependencies api to add :
- bun add pg
- bun add typescript @types/node @types/pg    

To run web server : 
- bun run api/src/index.ts
- Here are the endpoints available :
  - POST /api/registrar 
    - {
"direccion_correo": "alice@example.com",
"nombre": "Alice",
"clave": " alice123 ",
"descripcion": "Descripcion de alice"
}
  - POST /api/bloquear
      - {
"direccion_correo": "alice@example.com",
"clave": "alice123",
"direccion_bloqueada": 3
}
  - GET /api/infomacion/:correo:
    - You have to replace correo by an email adress, for example : GET /api/informacion/alice@example.com
  - POST /api/marcarcorreo
    - {
"direccion_correo": "alice@example.com",
"clave": "alice123",
"direccion_favorita": 2,
"categoria": "friends"
}
  - DELETE /api/desmarcarcorreo
    - {
"direccion_correo": "alice@example.com",
"clave": "alice123",
"direccion_favorita": 2
}
  
To run client prompt :
- cd client
- py prompt.py

To run database :
- Install PostgreSQL
- Run on your localhost
- Set the password of postgres user to 020202 (or modify config in db.js)
- Create a database named 'communiken'
- compile typescript to javascript with the command : 