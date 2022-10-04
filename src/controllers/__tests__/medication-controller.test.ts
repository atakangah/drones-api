import { MedicationController } from "../MedicationController";

describe("Tests medication controller methods", () => {
  let medicationController: MedicationController;
  const medicationFunction = jest.fn();
  const medicationRetrieveValue: any[] = [
    { name: "Paracetamol", weight: 500, code: "PARA500_TEST", image: null },
    { name: "Chropromazim", weight: 300, code: "MAZIM_30", image: null },
    {
      name: "Hydroxychloroquine",
      weight: 50,
      code: "HYDROXYCHLORO_300",
      image: null,
    },
  ];
  const medicationRetrieveFunction = jest
    .fn()
    .mockResolvedValue(medicationRetrieveValue);

  beforeEach(() => {
    medicationController = new MedicationController({
      insertMedication: medicationFunction,
      getAllMedications: medicationRetrieveFunction,
    });

    medicationFunction.mockClear();
    medicationRetrieveFunction.mockClear();
  });

  it("Should add a new medication to database", () => {
    const requestBody: any = {
      body: {
        name: "Paracetamol",
        weight: 500,
        code: "PARA500_TEST",
        image: null,
      },
    };
    medicationController.addMedication(requestBody, {
      status: (status: number) => ({
        json: (response: any) => {
          expect(status).toBe(200);
          expect(response).toEqual({ message: "medication add success" });
        },
      }),
    });

    expect(medicationFunction).toHaveBeenCalled();
    expect(medicationFunction).toHaveBeenCalledWith(requestBody);
    expect(medicationRetrieveFunction).toHaveBeenCalledTimes(0);
  });

  it("Should fail to add new medication due to invalid medication code", () => {
    const requestBodyFail: any = {
      body: {
        name: "Paracetamol...",
        weight: 500,
        code: "!$PARA500_TEST_-?",
        image: null,
      },
    };
    medicationController.addMedication(requestBodyFail, {
      status: (status: number) => ({
        json: (response: any) => {
          expect(status).toBe(400);
          expect(response).toEqual({
            message: "Invalid medication code or medication name supplied",
          });
        },
      }),
    });

    expect(medicationFunction).toHaveBeenCalledTimes(0);
    expect(medicationRetrieveFunction).toHaveBeenCalledTimes(0);
  });

  it("Should return all medications", () => {
    medicationController.getMedications(
      {},
      {
        status: (status: number) => ({
          json: (response: any) => {
            expect(status).toBe(200);
            expect(response).toEqual({
              message: "Medications retrieve success",
              payload: medicationRetrieveValue,
            });
          },
        }),
      }
    );

    expect(medicationRetrieveFunction).toHaveBeenCalled();
    expect(medicationRetrieveFunction).toHaveBeenCalledWith();
  });
});
