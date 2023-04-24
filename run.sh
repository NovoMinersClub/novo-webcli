#!/bin/bash

# Build the Docker image
docker build -t novo-app .

# Run the Docker container
docker run -it -p 3000:3000 --rm --name novo-container novo-app

