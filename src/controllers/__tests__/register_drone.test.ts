import { registerDrone } from "../DispatchController";

describe("Drone registration api", () => {
  it("Should add a new drone to sqlite3 in-memory database", async () => {
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
            expect(response).toEqual({ message: "PILAY21JD register success" });
          },
        }),
      }
    );
  });
});
