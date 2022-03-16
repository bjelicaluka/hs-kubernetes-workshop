# Homesourcing Kubernetes workshop

## Running the project
- `npm i`
- `export DATABASE_URL=dburl`
- `export DATABASE_NAME=dbname`
- `npm start`

## Building the project
- `docker build -t <tag> .`

## Deploying the project
- `kubectl apply -f message-generator.yaml`
- `kubectl apply -f ravendb.yaml`
