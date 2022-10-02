// eslint-disable quotes
import { connect, query } from "../../util/DbRunner";
import { registerDrone } from "../DispatchController";

describe("Drone registration api", () => {

  beforeAll(() => connect());

  it("Should add a new drone to sqlite3 in-memory database", async () => {
    return new Promise((resolve) => {
      registerDrone(
        {
          body: {
            serialNumber: "PILAY21JD",
            model: "1",
            weightLimit: 400,
            batteryPercentage: 90,
          },
        },
        {
          status: (statusCode: number) => ({
            json: async (response: any) => {
              expect(statusCode).toBe(200);
              expect(response).toEqual({ message: "New drone added" });

              const queryResult = await query("SELECT COUNT(*) FROM DRONE");
              expect(queryResult).toHaveLength(1);

              resolve(true);
            },
          }),
        }
      );
    });
  });
});
