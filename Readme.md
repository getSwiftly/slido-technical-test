Steps to run:
1. Make sure to create a .env file

2. After running docker compose up

NOTE: There was some issue in exposing port for database to nodejs, hence I made the demo using nodejs backend running directly and docker runs the postgreSQL database.

3. Run 'npm run migrate up' this will run all the db migrations

4. Make sure logs say database connection is successful

5. Using the given postman collection json, import it and run the APIs as per requirements.

6. Socket IO can also be tested via Postman