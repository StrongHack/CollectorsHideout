# Collectors Hidout API

Collectors Hidout API is a [.net core7](https://dotnet.microsoft.com/), with [Entity Framework core 7] and connection with [MongoDB](https://mongodb.com/) database. Developed as a college project for LDS.

# Table of Contents:

- [Overview](#overview)
- [Run Project](#run-project)
- [Test Project](#test-project)
- [Build Project](#build-project)
- [Build Project as Docker Image](#building-as-docker-image)

# Overview

This project contains a API banckend environment built with [.net core7](https://dotnet.microsoft.com/) to help manage Collectors Hideout bussiness website. This project is divided into 3 main folders and 1 folder to images storage:

- **Context:** Contains the connection to MongoDB and the mapping of model entities to collections in the database.

- **Controllers** \* Contains the API controllers, which are responsible for receiving HTTP requests, processing them, and returning appropriate responses. We have controllers fo all entitie. Contains CRUD operations (Create, Read, Update, Delete) and other actions, for Auctions, Collectables, Collections, Images, Orders, Publications and Users.

- **Models** \* Contains the classes that represent the data models or entities that will be stored in the database, for Auctions, Collectables, Collections, Images, Orders, Publications and Users.

- **wwwroot** \* Is a special directory designed to store static resources like images and other user interface assets

# Run Project

To run project do it in solution project, run one of the following commands:

```bash
dotnet run
```

# Test Project

To run project do it in solution project, run one of the following commands:

```bash
dotnet test
```

# Build Project

To run project do it in solution project, run one of the following commands:

```bash
dotnet build
```

# Building as docker image

To build as docker image and start container, run the following commands from within the project folder:

```bash
docker build -t collectors_hidout .

docker run -p 8080:80 collectors_hidout
# or
docker run -d -p 8080:80 collectors_hidout
```

In case of changes in the API

- Generate new Build

```bash
docker build -t collectors_hidout 
```

- Generate new Tag to identificate

```bash
docker tag collectors_hidout:latest grupo6lds/collectors_hidout:<NewTag>
```

- New container push

```bash
docker push grupo6lds/collectors_hidout:<NewTag>
```

- On WinSCP login and pull container

```bash
docker pull grupo6lds/collectors_hidout:<NewTag>
```

- Run the container

```bash
docker run -d -p 8080:80 grupo6lds/collectors_hidout:<NewTag>
```
