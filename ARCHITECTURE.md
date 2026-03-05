# Architecture

## Overview

This project implements a **distributed API rate-limiting microservice** that enforces request limits per client and endpoint.

The service acts as a **gatekeeper** in front of backend APIs and determines whether a request should be allowed or rejected based on configured rate limits.

The system is designed to be **stateless**, allowing multiple instances of the service to run simultaneously while maintaining consistent rate-limiting state using Redis.


## High-Level Architecture

```
Client
   │
   ▼
API Gateway / Proxy
   │
   ▼
Rate Limiting Microservice
   │
   ├── Redis (Rate Limit State)
   └── MongoDB (Client Configuration)
   │
   ▼
Backend APIs
```

### Request Flow

1. A client sends a request through an API gateway or proxy.
2. The gateway calls the **Rate Limiting Service**.
3. The service retrieves the client configuration from **MongoDB**.
4. The service checks the current rate limit state stored in **Redis**.
5. The **Token Bucket algorithm** determines if the request is allowed.
6. If allowed → the request proceeds to the backend service.
7. If the limit is exceeded → the service returns **HTTP 429 Too Many Requests**.


## System Components

### 1. API Service

The core service implemented using **Node.js and Express**.

Responsibilities:

* Expose REST APIs for rate limiting
* Handle request validation
* Execute rate-limiting logic
* Communicate with Redis and MongoDB
* Return appropriate HTTP responses

### 2. Redis

Redis acts as the **distributed in-memory data store** for rate-limiting state.

Responsibilities:

* Store token bucket state
* Maintain request counters
* Ensure atomic operations for rate limiting
* Enable multiple service instances to share state

Example Redis key format:

```
clientId:path
```

Example:

```
amazon:/orders
```

### 3. MongoDB

MongoDB stores **registered API client configurations**.

Stored data includes:

* clientId
* hashedApiKey
* maxRequests
* windowSeconds
* timestamps

MongoDB ensures that rate-limit configurations are **persistent and manageable**.


### 4. Docker & Docker Compose

Docker is used to **containerize the application**, ensuring consistent environments across development and deployment.

Docker Compose orchestrates the system locally:

* API service container
* MongoDB container
* Redis container

This allows the entire system to start with one command:

```
docker-compose up --build
```

### 5. GitHub Actions

GitHub Actions provides the **CI pipeline** for the project.

The workflow automatically:

1. Installs project dependencies
2. Starts MongoDB and Redis services
3. Runs unit tests
4. Runs integration tests

This ensures code quality and prevents broken code from being merged.


## Rate Limiting Algorithm

The service uses the **Token Bucket algorithm**.

### How It Works

1. Each client has a bucket containing a fixed number of tokens.
2. Every request consumes one token.
3. Tokens refill gradually over time.
4. If tokens are available → request is allowed.
5. If no tokens remain → request is rejected with **HTTP 429**.

### Advantages

* Allows short bursts of traffic
* Prevents sustained abuse
* Efficient for distributed systems
* Works well with Redis atomic operations

## Scalability

The service is designed to scale horizontally.

Key scalability features:

* Stateless API service
* Shared rate-limit state in Redis
* Containerized deployment
* Independent database and cache services

Because Redis stores the rate-limit state, multiple instances of the rate-limiting service can run simultaneously without inconsistent counters.


## Fault Tolerance

Basic resilience is achieved through:

* Redis persistence of rate-limit state
* MongoDB persistent client configuration
* Docker health checks
* CI pipeline validation before deployment
