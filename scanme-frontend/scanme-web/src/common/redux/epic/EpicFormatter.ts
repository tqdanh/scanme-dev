export class EpicFormatter {
  public static formatEpicComponents(epicComponents) {
    const arrResult = [];
    if (epicComponents) {
      epicComponents.forEach(element => {
        const actionKeys = Object.keys(element);
        for (const key of actionKeys) {
          arrResult.push(element[key]);
        }
      });
    }
    return arrResult;
  }
}
