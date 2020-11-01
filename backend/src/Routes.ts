import DB from './DB'
import HttpMethod from './HttpMethod'

const routes = (
  route: (
    routeMethod: HttpMethod,
    routeVerb: string,
    routeAction: ({ params, data }: { params: string[]; data: object }) => Promise<any>,
    parsedData?: object
  ) => Promise<any>,
  parsedData: object = {}
) => {
  route(HttpMethod.POST, 'create', ({ data }) => DB.create(data), parsedData)
  route(HttpMethod.GET, 'readAll', () => DB.readAll())
  // params[0]: _id
  route(HttpMethod.GET, 'read', ({ params }) => DB.read(params[0]))
  route(HttpMethod.PUT, 'update', ({ params, data }) => DB.update(params[0], data), parsedData)
  route(HttpMethod.DELETE, 'delete', ({ params }) => DB.delete(params[0]))
}

export default routes
