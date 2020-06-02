const recipesTemplate = `
    <div class="recipes">
      <div class="recipes-search">
        <input type="text" class="recipes-input" placeholder="Search">
      </div>
      <ul class="recipes-list"></ul>
      <div class="info">
        <div class="info-content">
          <img class="info-img" src="" alt="">
          <div class="info-text">
            <span class="info-title title span-block"></span>
            <span class="info-description text span-block"></span>
            <span class="info-suptitle text span-block">Ingridients</span>
            <ul class="info-ingridients"></ul>
          </div>
          <button class="info-bookmark btn">Mark</button>
        </div>
        <button class="info-button btn">View Recipe</button>
      </div>
    </div>
    <button class="btn btn-add-card">Add recipe</button>
  `;

const recipeTemplate = `
  <div class="recipe-content">
    <img class="recipe-img" src="" alt="">
    <div class="recipe-text">
      <h2 class="recipe-title title span-block"></h2>
      <span class="recipe-description text span-block"></span>
      <span class="recipe-suptitle text span-block">Ingridients</span>
      <ul class="recipe-ingridients"></ul>
    </div>
    <button class="recipe-button btn">Back</button>
  </div>
`;

module.exports = {
  recipesTemplate,
  recipeTemplate,
};
