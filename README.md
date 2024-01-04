
# Note-Taking API Documentation

This API allows users to create, retrieve, update, and delete notes. Each note includes a title, content, and timestamps for creation and last modification.

## API Endpoints

### Authorization

All API endpoints are protected with Basic Auth. Provide the following credentials with your requests:

- **Username**: `admin`
- **Password**: `password`

### Create Note

- **URL**: `/notes`
- **Method**: `POST`
- **Auth Required**: Yes
- **Data Constraints**:
  ```json
  {
      "title": "[title of the note in plain text]",
      "content": "[content of the note in plain text]"
  }
  ```
- **Success Response**:
  - **Code**: 201 CREATED
  - **Content**:
    ```json
    {
        "id": "60af924ef0a8b15d30c4ee2b",
        "title": "[title of the note]",
        "content": "[content of the note]",
        "createdAt": "2021-05-26T09:00:00.000Z",
        "updatedAt": "2021-05-26T09:00:00.000Z"
    }
    ```

### Retrieve All Notes

- **URL**: `/notes`
- **Method**: `GET`
- **Auth Required**: Yes
- **Success Response**:
  - **Code**: 200 OK
  - **Content**: An array of notes
    ```json
    [
      {
          "id": "60af924ef0a8b15d30c4ee2b",
          "title": "[title of the note]",
          "content": "[content of the note]",
          "createdAt": "2021-05-26T09:00:00.000Z",
          "updatedAt": "2021-05-26T09:00:00.000Z"
      },
      // ... other notes
    ]
    ```

### Retrieve Single Note

- **URL**: `/notes/:id`
- **Method**: `GET`
- **Auth Required**: Yes
- **URL Parameters**: Replace `:id` with the unique ID of the note.
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
        "id": "60af924ef0a8b15d30c4ee2b",
        "title": "[title of the note]",
        "content": "[content of the note]",
        "createdAt": "2021-05-26T09:00:00.000Z",
        "updatedAt": "2021-05-26T09:00:00.000Z"
    }
    ```

### Update Note

- **URL**: `/notes/:id`
- **Method**: `PUT`
- **Auth Required**: Yes
- **URL Parameters**: Replace `:id` with the unique ID of the note you want to update.
- **Data Constraints**:
  ```json
  {
      "title": "[new title of the note in plain text]",
      "content": "[new content of the note in plain text]"
  }
  ```
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
        "id": "60af924ef0a8b15d30c4ee2b",
        "title": "[updated title of the note]",
        "content": "[updated content of the note]",
        "createdAt": "2021-05-26T09:00:00.000Z",
        "updatedAt": "2021-05-26T09:00:00.000Z"
    }
    ```

### Delete Note

- **URL**: `/notes/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **URL Parameters**: Replace `:id` with the unique ID of the note you want to delete.
- **Success Response**:
  - **Code**: 200 OK
  - **Content**: A message indicating successful deletion.

## Error Handling

The API uses standard HTTP response codes to indicate success or failure of an API request. In general:

- `2xx` codes indicate success.
- `4xx` codes indicate an error resulting from the provided information (e.g., a required parameter was omitted, a deletion failed, etc.).
- `5xx` codes indicate an error with our servers.

Some common responses include:

- **400 Bad Request**: The request was unacceptable, often due to missing a required parameter or invalid input.
- **401 Unauthorized**: No valid API key provided or failed Basic Auth credentials.
- **404 Not Found**: The requested resource doesn't exist.
- **500, 502, 503, 504 Server errors**: Something went wrong on our end.

To add information about the test cases to your `README.md` file, you'll want to describe what each test case does, what it's validating, and any assumptions or prerequisites for running the tests. Here's an example of how you might document the test cases:

### Testing Section


# Testing

The API includes a series of automated test cases to ensure each endpoint functions as expected. These tests are written using Mocha and Supertest.

## Running Tests

Ensure that all dependencies are installed and that your MongoDB instance is running. Then, execute the tests with the following command:

```bash
npm test
```

## Test Cases

### Authentication Tests

- **Require Basic Authentication**: Verifies that accessing the `/notes` endpoint requires basic authentication.

### GET /notes

- **Return All Notes**: Checks that the GET `/notes` endpoint correctly returns a 200 status code and an array of all notes when provided with valid authentication.

### POST /notes

- **Create New Note**: Validates that the POST `/notes` endpoint correctly creates a new note with a 201 status code when provided with a valid title and content.
- **Invalid Data**: Ensures that attempting to create a new note with invalid data (missing title or content) results in a 400 status code.

### GET /notes/:id

- **Retrieve Specific Note**: Confirms that GET `/notes/:id` returns the specific note matching the given ID.
- **Non-existent ID**: Verifies that trying to retrieve a note with a non-existent ID returns a 404 status code.

### PUT /notes/:id

- **Update Specific Note**: Checks that PUT `/notes/:id` correctly updates an existing note and returns the updated note.
- **Non-existent ID**: Ensures that trying to update a non-existent note returns a 400 status code.

### DELETE /notes/:id

- **Delete Specific Note**: Confirms that DELETE `/notes/:id` correctly removes the note with the specified ID.
- **Non-existent ID**: Verifies that trying to delete a non-existent note returns a 500 status code.

