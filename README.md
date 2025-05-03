# Task Manager API

## Overview

The Task Manager API is a simple RESTful API for managing tasks. It allows users to create, update, delete, and retrieve tasks. Each task includes attributes such as title, description, completion status, priority level, and creation date. The getTasks API also supports filtering, sorting, and retrieving tasks by priority.

## Setup Instructions

1. **Clone the Repository**:

   ```bash
   git clone <repository-url>
   cd task-manager-api-WorkVanshika
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Start the Server**:

   ```bash
   node app.js
   ```

4. **Run Tests** (optional):
   ```bash
   npm run test
   ```

## API Endpoints

### 1. Get All Tasks

**Endpoint**: `GET /tasks`

**Query Parameters**:

- `completed` (optional): Filter tasks by completion status (`true` or `false`).
- `sortBy` (optional): Sort tasks by `createdAt`.

**Example**:

```bash
curl -X GET "http://localhost:3000/api/v1/tasks?completed=true&sortBy=createdAt"
```

### 2. Get Task by ID

**Endpoint**: `GET /tasks/:id`

**Example**:

```bash
curl -X GET "http://localhost:3000/api/v1/tasks/1"
```

### 3. Create a Task

**Endpoint**: `POST /api/v1/tasks`

**Request Body**:

```json
{
  "title": "New Task",
  "description": "Task description",
  "completed": false,
  "priority": "medium"
}
```

**Example**:

```bash
curl -X POST -H "Content-Type: application/json" -d '{"title":"New Task","description":"Task description","completed":false,"priority":"medium"}' "http://localhost:3000/api/v1/tasks"
```

### 4. Update a Task

**Endpoint**: `PUT /tasks/:id`

**Request Body**:

```json
{
  "title": "Updated Task",
  "description": "Updated description",
  "completed": true,
  "priority": "high"
}
```

**Example**:

```bash
curl -X PUT -H "Content-Type: application/json" -d '{"title":"Updated Task","description":"Updated description","completed":true,"priority":"high"}' "http://localhost:3000/api/v1/tasks/1"
```

### 5. Delete a Task

**Endpoint**: `DELETE /tasks/:id`

**Example**:

```bash
curl -X DELETE "http://localhost:3000/api/v1/tasks/1"
```

### 6. Get Tasks by Priority

**Endpoint**: `GET /tasks/priority/:level`

**Path Parameter**:

- `level`: Priority level (`low`, `medium`, `high`).

**Example**:

```bash
curl -X GET "http://localhost:3000/api/v1/tasks/priority/high"
```
