import { medicationCodeValid, medicationNameValid } from "../validators";

describe("Test api inputs validators", () => {
  it("Should return true for valid medication name", () => {
    const name = "Clindamycin";
    const received = medicationNameValid(name);
    expect(received).toBe(true);
  });

  it("Should return false for invalid medication name", () => {
    const name = "Clindamycin_-?";
    const received = medicationNameValid(name);
    expect(received).toBe(false);
  });

  it("Should return true for valid medication code", () => {
    const code = "CLINDA200_2022";
    const received = medicationCodeValid(code);
    expect(received).toBe(true);
  });

  it("Should return false for invalid medication code", () => {
    const code = "clinda200_2022";
    const received = medicationCodeValid(code);
    expect(received).toBe(false);
  });
});
