import Elysia, { t } from "elysia";

const aptRoutes = new Elysia({prefix: '/apt'});

aptRoutes.get('/:id', ({params}) => {
    return 'APT Routes' + params.id;
  });

aptRoutes.get('', ({query}) => {
    const offset = query.offset || 0;
    const limit = query.limit || 10;
    return 'List of APTs with offset: ' + offset + ' and limit: ' + limit;
});

aptRoutes.post('/', ({body}) => {
    return `APT created with name: ${body.name}`;
    },
    {
        body: t.Object ({
            name: t.String({
                required: true,
            })
        })
    });

aptRoutes.put('/:id', ({params, body}) => {
    return `APT with ID ${params.id} updated with name: ${body.name}`;
  },
  {
    body: t.Object({
      name: t.String({
        required: true,
      })
    }),
    params: t.Object({
      id: t.String({
        required: true,
      })
    })
});

export {aptRoutes};
