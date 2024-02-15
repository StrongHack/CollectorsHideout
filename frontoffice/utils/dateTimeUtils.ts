export class DateTimeUtils {
  /**
   * Converts date to YYYYMMDD format
   *
   * @param dateString string of date to convert
   * @returns date in YYYYMMDD format
   */
  public static convertDateTime(dateString: string) {
    try {
      const dateObject = new Date(dateString);

      if (isNaN(dateObject.getTime())) {
        throw new Error('Invalid date');
      }

      const year = dateObject.getFullYear();
      const month = (dateObject.getMonth() + 1).toString().padStart(2, "0");
      const day = dateObject.getDate().toString().padStart(2, "0");
      const hours = dateObject.getHours().toString().padStart(2, "0");
      const minutes = dateObject.getMinutes().toString().padStart(2, "0");

      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch (error) {
      return "0000-00-00T00:00";
    }
  }

  /**
   *  Returns the seconds left in the auction
   *
   * @param endDate - Date string to format
   * @returns secondsRemaining
   */
  public static calculateTimeRemaining = (endDate: string) => {
    try {
      const dateNow = new Date();
      const dateEnd = new Date(endDate);

      if (isNaN(dateEnd.getTime())) {
        throw new Error('Invalid date');
      }


      const timeRemaining = dateEnd.getTime() - dateNow.getTime();
      const secondsRemaining = Math.floor(timeRemaining / 1000);

      return secondsRemaining;
    } catch (error) {
      return -1;
    }
  };
}
