# Booking API
A simple **REST** **API** for managing bookings, built with Node.js, Express, PostgreSQL and Docker. The **API** supports full **CRUD** operations and is designed to run as multiple instances behind an **NGINX** reverse proxy.

## Features

- Create, read, update, and delete bookings

- Persistent storage in PostgreSQL

- Environment-based configuration for port, database, and instance name

- `GET /api/instance` endpoint to identify the running instance

- Docker Compose setup with PostgreSQL, multiple **API** instances, and **NGINX** load balancer

- Passive failover: if one instance stops, **NGINX** routes requests to another

## Tech Stack

- Node.js

- Express

- PostgreSQL

- pg (Node.js PostgreSQL client)

- Docker / Docker Compose

- NGINX
- Bruno or any other prefered tool (for **API** testing)

## Project Structure

```
booking-api/
├── api/
│   ├── .env.example
│   ├── .gitignore
│   ├── db.js
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   └── routes/
│       └── bookings.js
├── database
│   └── init.sql
├── nginx
│   └── nginx.conf
├── README.MD
├── Dockerfile
├── .dockerignore
├── compose.yaml
└── package-lock.json
```
## API Endpoints





| Method | Endpoint | Description |
|---|---|---|
| GET | `/bookings` | Get all bookings. |
| GET | `/bookings/:id` | Get a booking by ID. |
| POST | `/bookings` | Create a new booking. |
| PUT | `/bookings/:id` | Update an existing booking. |
| DELETE | `/bookings/:id` | Delete a booking. |
| GET | `/api/instance` | Show which instance is running. |
## Booking Fields
| Field | Type | Required | Description |
|---|---|---|---|
| name | string | Yes | Name of the person booking |
|email|string|Yes|Email address |
|date_time|timestamp|Yes|Date and time of the booking |
|number_of_people|integer|Yes|Number of people (must be > 0) |
|status|string|No|**PENDING**, **CONFIRMED**, or **CANCELLED** (default: **PENDING**) |
## Environment Variables
Copy `.env.example` to `.env` and adjust values if needed.

```
PORT=
INSTANCE_NAME=
DB_HOST=
DB_PORT=
DB_NAME=
DB_USER=
DB_PASSWORD=
``` 
- **PORT** – Port the **API** listens on inside the container (default **3000**)

- **INSTANCE_NAME** – Name shown by `GET /api/instance`

- **DB_HOST** – Database host (use db inside Docker)

- **DB_PORT** – Database port (default **5432**)

- **DB_NAME** – Database name

- **DB_USER** – Database user

- **DB_PASSWORD** – Database password

## Running with Docker

Start all services:

```bash 
docker compose up --build -d 
```
This starts:

**db** – PostgreSQL with the `bookings` table created from `init.sql`

**API** instances

**nginx** – Reverse proxy on port **8080**

Check running containers:

```bash
docker compose ps
```
Stop everything:

```bash
docker compose down 
```
Stop and remove the database volume (deletes all data):

```bash
docker compose down -v
``` 

## Testing the **API** with Bruno (or any other prefered API tool)

Create a Bruno collection and set the environment variable:

```text
baseUrl = http://localhost:8080
```

### Create a booking 

- Method: **POST**

- **URL**: {{baseUrl}}/bookings

- Body (**JSON**):

```json
{
    "name": "John",
    "email": "john.johnson@test.se,
    "date_time": "2026-11-05T14:00:00Z",
    "number_of_people": 2,
    "status": "PENDING"
}
```
Expected response: `201 Created` with the created booking including its `id`.

### Get all bookings 

Method: **GET**

**URL**: {{baseUrl}}/bookings

Expected response: `200 OK` with a list of bookings.

### Get a single booking 

Method: **GET**

**URL**: {{baseUrl}}/bookings/1

Expected response: `200 OK` with the booking, or `404 Not Found` if it does not exist.

### Update a booking 

Method: **PUT**

**URL**: {{baseUrl}}/bookings/1

Body (**JSON**):

```json
{
    "name": "John",
    "email": "john.johnson@test.se",
    "date_time": "2026-11-05T15:00:00Z",
    "number_of_people": 3,
    "status": "CONFIRMED"
}
```
Expected response: `200 OK` with the updated booking, or `404 Not Found` if it does not exist.

### Delete a booking 

Method: **DELETE**

**URL**: {{baseUrl}}/bookings/1

Expected response: `204 No Content`, or `404 Not Found` if it does not exist.

### Check the instance

Method: **GET**

**URL**: {{baseUrl}}/api/instance

Expected response:

```json
{
    "instance": "api-1"
}
```
### Notes 

The database volume pgdata ensures data persists across container restarts.

Running `docker compose down -v` deletes the volume and all booking data.

The `init.sql` script runs only the first time the database volume is created.

If you change `init.sql` after the first run, you must run `docker compose down -v` and start again to apply changes.