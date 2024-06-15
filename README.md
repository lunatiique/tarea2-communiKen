To be able to run the project :
- Install bun (https://bun.sh/docs/installation)
- Install python

Dependencies api :
- bun add pg
- bun add fs

To run web server : 
- cd api
- bun run src/index.t
- go to http://localhost:3000 to see result
  
To run client prompt :
- cd client
- py prompt.py

To run database :
- Install PostgreSQL
- Run on your localhost
- Set the password of postgres user to 020202 (or modify config in db.js)
- Create a database named 'communiken'
- execute the initialize_database.js script to create the tables and fill them with example data for test purposes.