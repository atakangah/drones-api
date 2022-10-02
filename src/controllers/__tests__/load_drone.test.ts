import { loadDrone } from "../DispatchController";

describe("Loading drone with medications api", () => {

  it("Should fill drone with medications having specified Ids", () => {
      loadDrone(
        {
          body: {
            droneSerialNumber: "DRONE1",
            medicationsNames: ["Penycillin", "Chropromazim"],
          },
        },
        {
          status: (statusCode: number) => ({
            json: async (response: any) => {
              expect(statusCode).toBe(200);
              expect(response).toEqual({ message: "DRONE1 load success" });
            },
          }),
        }
      );
  });
});
