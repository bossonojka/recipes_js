import Recipe from './Recipe';

export default class RecipesContainer {
  constructor(apiPath) {
    this.apiPath = apiPath;
  }

  async addRecipe(recipe) {
    const options = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: recipe.name,
        image: recipe.image,
        description: recipe.description,
        ingridients: recipe.ingridients,
      }),
    };

    let response = null;

    try {
      response = await fetch(this.apiPath, options);
    } catch (error) {
      console.error(error);
    }

    const result = await this.getAllRecipes();

    return result.pop();
  }

  async getAllRecipes() {
    const response = await fetch(this.apiPath);
    const result = await response.json();

    return result;
  }

  async removeRecipeById(id) {
    let response = null;

    try {
      response = await fetch(this.apiPath + '/' + id, { method: 'delete' });
    } catch (error) {
      console.error(error);
    }

    return response;
  }

  async getRecipeById(id) {
    let response = null;
    let result = null;

    try {
      response = await fetch(this.apiPath + '/' + id);
      result = await response.json();
    } catch (error) {
      console.error(error);
    }

    return result;
  }

  async getRecipeByName(name) {
    let response = null;
    let result = null;

    try {
      response = await fetch(this.apiPath + '/?name_like=' + name);
      result = await response.json();
    } catch (error) {
      console.error(error);
    }

    return result;
  }
}
