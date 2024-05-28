### Build the docker compose with the following command

```bash
docker compose build
```
After using the docker command and the build is completed you can use the following docker command 
to run the containers and start the app. It creates the tables in the database and inserts some 
default data that you can find in the data.sql file inside the assets.database folder. Also it inserts 
three default users in the database, 1 administrator and 2 managers.

### Run the containers with the following command

```bash
docker compose up
```

### Stop the containers with the following command

```bash
docker compose down
```

### Stop the containers and clean the tables in the database with the following command

```bash
docker compose down -v
```

## Connect to database 

| Host      | Port     | User     | Password |
|-----------|----------|----------|----------|
| localhost | 5432     | postgres | pass123  |

## Inserted users

| USERNAME | PASSWORD | ROLES   |
|----------|----------|---------|
| admin    | 12345678 | ADMIN   |
| manager  | 12345678 | MANAGER |
| manager2 | 12345678 | MANAGER |

## Links:
* [install docker](https://docs.docker.com/get-docker/)
* [install docker compose](https://docs.docker.com/compose/install/)
