export default async driver =>
    driver.executeScript(() => window.store.getState());
