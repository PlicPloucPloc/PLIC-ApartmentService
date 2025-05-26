import Elysia from "elysia";
import { aptRoutes } from "./routes";
import swagger from "@elysiajs/swagger";

const app = new Elysia();

app.group("", (app) => app.use(aptRoutes))
    .use(swagger())
    .listen(process.env.PORT || 3000);

console.log('Server is listening port ' + (process.env.PORT || 3000));
