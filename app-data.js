export default class AppData {
  constructor() {
    this.food = [];
  }

  addFood(carbs = 0, protein = 0, fat = 0) {
    this.food.push({
      carbs: Number.parseInt(carbs, 10),
      protein: Number.parseInt(protein, 10),
      fat: Number.parseInt(fat, 10),
    });
  }

  getTotalCarbs() {
    return this.food.reduce((total, current) => {
      return total + current.carbs;
    }, 0);
  }

  getTotalProtein() {
    return this.food.reduce((total, current) => {
      return total + current.protein;
    }, 0);
  }

  getTotalFat() {
    return this.food.reduce((total, current) => {
      return total + current.fat;
    }, 0);
  }

  getTotalCalories() {
    return (
      this.getTotalCarbs() * 4 +
      this.getTotalProtein() * 4 +
      this.getTotalFat() * 9
    );
  }
}
