import { DispatchController } from "../DispatchController";

describe("Tests dispatch controller methods", () => {
  let dispatchController: DispatchController;
  let dispatchFunction = jest.fn();

  beforeEach(() => {
    dispatchController = new DispatchController({
      insertDrone: dispatchFunction,
    });
  });

  it("Should register a drone to database", () => {
    dispatchController.registerDrone(
      {
        body: {
          serialNumber: "DRONE13",
          weightLimit: 500,
          model: "4",
          state: "1",
          batteryPercentage: 100,
        },
      },
      {
        status: (status: number) => ({
          json: (response: any) => {
            expect(status).toBe(200);
            expect(response).toEqual({ message: "DRONE13 register success" });
          },
        }),
      }
    );

    expect(dispatchFunction).toHaveBeenCalled();
  });

  it("Should fail to register drone due to invalid request parameters", () => {
    dispatchController.registerDrone(
      {
        body: {
          serialNumber: "DRONE13",
          WEIGHTLIMITS: 500,
          model: "4",
          state: "1",
          batteryPercentage: 100,
        },
      },
      {
        status: (status: number) => ({
          json: (response: any) => {
            expect(status).toBe(400);
            expect(response).toEqual({
              message: "All required request parameters not provided",
            });
          },
        }),
      }
    );
  });
});
