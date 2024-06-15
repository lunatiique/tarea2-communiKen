## Project Setup

To be able to run the project, follow these steps:

- Install [bun](https://bun.sh/docs/installation)
- Install Python

### API Dependencies to Add

```bash
bun add pg
bun add typescript @types/node @types/pg
```

### Running the Web Server

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
    "direccion_bloqueada": 3
  }
  ```

- **GET /api/infomacion/:correo:**
  - Replace `:correo:` with an email address, e.g., `GET /api/informacion/alice@example.com`

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

Navigate to the client directory and run `prompt.py`:

```bash
cd client
python prompt.py
```

### Setting Up the Database

- Install PostgreSQL and run it on your localhost.
- Set the password of the `postgres` user to `020202` (or modify the configuration in `db.ts`).
- Create a database named `communiken`.
- Execute the two SQL scripts to create the tables and insert data for test purposes.
