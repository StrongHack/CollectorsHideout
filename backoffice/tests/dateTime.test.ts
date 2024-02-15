import { DateTimeUtils } from "../utils/dateTimeUtils"

//test if convertDateTime returns 0000-00-00T00:00 when string isn't of DateTime format
test("convertDateTime should return 0000-00-00T00:00 when string isn't of DateTime format", () => {
    const stringifiedDate = DateTimeUtils.convertDateTime("randomString");

    expect(stringifiedDate).toBe("0000-00-00T00:00");
})

//test if calculateRemainingTime returns -1 when string isn't of DateTime format
test("calculateRemainingTime should return -1 when string isn't of DateTime format", () => {
    const remainingTime = DateTimeUtils.calculateTimeRemaining("randomString");

    expect(remainingTime).toBe(-1);
})