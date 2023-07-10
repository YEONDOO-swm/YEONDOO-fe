import { setupWorker } from "msw";
import { apiHandlers } from "./handlers";

export const worker = setupWorker(...apiHandlers);