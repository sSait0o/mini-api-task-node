const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Todolist API',
    version: '1.0.0',
    description: 'Simple TODO list API (GET, POST, PUT, DELETE)'
  },
  servers: [{ url: 'http://localhost:3000' }],
  paths: {
    '/api/todos': {
      get: {
        summary: 'List all todos',
        responses: {
          '200': {
            description: 'A list of todos',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Todo' }
                }
              }
            }
          }
        }
      },
      post: {
        summary: 'Create a new todo',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TodoCreate' }
            }
          }
        },
        responses: {
          '201': { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Todo' } } } },
          '400': { description: 'Bad Request' }
        }
      }
    },
    '/api/todos/{id}/complete': {
      put: {
        summary: 'Mark a todo as complete',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'OK' }, '404': { description: 'Not Found' } }
      }
    },
    '/api/todos/{id}': {
      delete: {
        summary: 'Delete a todo',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Deleted' }, '404': { description: 'Not Found' } }
      }
    }
  },
  components: {
    schemas: {
      Todo: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          titre: { type: 'string' },
          fait: { type: 'boolean' }
        }
      },
      TodoCreate: {
        type: 'object',
        properties: { titre: { type: 'string' } },
        required: ['titre']
      }
    }
  }
};

export default swaggerSpec;
