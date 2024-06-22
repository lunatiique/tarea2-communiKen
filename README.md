## Project Setup

To be able to run the project, you first need to install these three softwares on your device :

- [bun](https://bun.sh/docs/installation)
- [Python](https://www.python.org/downloads/)
- [PostgreSQL](https://www.postgresql.org/download/)

### Dependencies to add for api

Execute the following command in your shell to install the necessary dependencies for the project :

```bash
cd api
bun install
```

### Dependencies to add for client

Execute the following command in your shell to install the necessary dependencies for the project :

```bash
pip install -r requirements.txt
```

### Setting Up the Database

Set the environement variable DATABASE_URL in the .env file to connect the database with prisma :

```bash
DATABASE_URL="postgresql://postgres:020202@localhost:5432/communiken"
```

- Run PostgreSQL on your localhost.
- Set the password of the `postgres` user to `020202` (or modify the environement variable to match).
- Create a database named `communiken`.
- Execute the two SQL scripts to create the tables and insert data for test purposes. (you can find them in api/database)
  
### Run the Web Server

To start the web server, execute the following commands:

```bash
bun run api/src/index.ts
```

#### Available Endpoints

- **POST /api/registrar**
  ```json
  {
    "direccion_correo": "alice@example.com",
    "nombre": "Alice",
    "clave": " alice123 ",
    "descripcion": "Descripcion de alice"
  }
  ```

- **POST /api/bloquear**
  ```json
  {
    "direccion_correo": "alice@example.com",
    "clave": "alice123",
    "direccion_bloqueada": "bob@example.com"
  }
  ```

- **GET /api/infomacion/:correo:**
  - Replace `:correo:` with an email address, e.g., `GET /api/informacion/alice@example.com`
  
- **GET /api/listadofavoritos/:correo**
  - Replace `:correo:` with an email address, e.g., `GET /api/listadofavoritos/alice@example.com`
  
- **POST /api/autenticar**
  ```json
  {
    "direccion_correo": "alice@example.com",
    "clave": "alice123"
  }
  ```

- **POST /api/marcarcorreo**
  ```json
  {
    "direccion_correo": "alice@example.com",
    "clave": "alice123",
    "direccion_favorita": 2,
    "categoria": "friends"
  }
  ```

- **DELETE /api/desmarcarcorreo**
  ```json
  {
    "direccion_correo": "alice@example.com",
    "clave": "alice123",
    "direccion_favorita": 2
  }
  ```

### Running the Client Prompt

Don't forget to start the webserver before using the client.
Navigate to the client directory and run `prompt.py`:

```bash
py client/prompt.py
```
or (depending on your OS)
```bash
python client/prompt.py
```