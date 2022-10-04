import { arrToChainOfSQLOR, arrToString } from "../converters";

describe("Tests converter functions", () => {
    it ("Should return comma separated string generated from arra", () => {
        const testData = ["Penycillin", "Gabapentin", "Azithromycin"];
        const expected = "Penycillin, Gabapentin, Azithromycin";

        const received = arrToString(testData);

        expect(received).toBe(expected);
    });

    it ("Should return SQL OR statements for a WHERE clause", () => {
        const testData = ["DRONE1", "DRONE2", "DRONE3"];
        const expected = `NAME = "DRONE1" OR NAME = "DRONE2" OR NAME = "DRONE3"`;

        const received = arrToChainOfSQLOR(testData);

        expect(received).toBe(expected);
    });
});
