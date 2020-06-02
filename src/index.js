import '@babel/polyfill';
import './styles/main.scss';
import Helper from './helper';
import Templates from './templates';
import Recipe from './classes/Recipe';
import RecipesContainer from './classes/RecipesContainer';

// Main controls
const removeBtn = document.querySelector('.recipes-remove');
const toHomeBtn = document.querySelector('.link-home');

// Modal form
const overlay = document.querySelector('.overlay');
const modal = document.querySelector('.modal');
const modalCloseBtn = document.querySelector('.modal-close');
const form = document.querySelector('.modal-form');
const modalId = document.querySelector('.modal-id');
const modalName = document.querySelector('.modal-name');
const modalImage = document.querySelector('.modal-image');
const modalDescription = document.querySelector('.modal-description');
const modalSubmitBtn = document.querySelector('.modal-submit');
const modalAddIngridientBtn = document.querySelector('.modal-add');

// Main blocks
const header = document.querySelector('.header');
const main = document.querySelector('.main');
const app = document.querySelector('.app');

// Recipes list page
let recipesList;
let addBtn;
let searchInput;

// Recipe info block
let infoImg;
let infoTitle;
let infoDescription;
let infoIngridients;
let infoButton;
let infoBookmark;

// Recipe page
let recipeImg;
let recipeTitle;
let recipeDescription;
let recipeIngridients;
let recipeBtn;

// Bookmarks page
const bookmarksBtn = document.querySelector('.link-bookmarks');
const mark = document.querySelector('.info-bookmark');
const bookmarksList = document.querySelector('.bookmarks-list');

// Selected recipe in the side block
let selectedRecipe = null;

// Server connection
const recipesContainer = new RecipesContainer('http://localhost:3000/data');

// Local storage
let bookmarks = JSON.parse(window.localStorage.getItem('id')) || [];

// Routing feature
const onRouteChanged = () => {
  const hash = window.location.hash;
  const view = document.querySelector('.app');

  if (!(view instanceof HTMLElement)) {
    throw new ReferenceError('No router view element available for rendering');
  }

  switch (hash) {
    case '':
      showRecipes();
      break;

    case '#bookmarks':
      showBookmarks();
      break;

    case '#recipe':
      viewRecipe(selectedRecipe);
      break;

    default:
      view.innerHTML = '<h2>Page Not Found</h2>';
      break;
  }
};

// Functions
const toggleModal = () => {
  modal.hidden = !modal.hidden;
  overlay.hidden = !overlay.hidden;
};

const viewRecipe = (recipe) => {
  Helper.clearChildren(app);

  app.innerHTML = Templates.recipeTemplate;

  recipeImg = document.querySelector('.recipe-img');
  recipeTitle = document.querySelector('.recipe-title');
  recipeDescription = document.querySelector('.recipe-description');
  recipeIngridients = document.querySelector('.recipe-ingridients');

  recipeBtn = document.querySelector('.recipe-button');
  recipeBtn.onclick = () => {
    window.history.back();
  };

  recipeImg.src = recipe.image;
  recipeTitle.textContent = recipe.name;
  recipeDescription.textContent = recipe.description;

  recipe.ingridients.forEach((i) => {
    const li = document.createElement('li');
    li.classList.add('recipe-item');

    const name = document.createElement('span');
    name.classList.add('recipe-name', 'text', 'span-block');
    name.textContent = i.name;

    const quantity = document.createElement('span');
    quantity.classList.add('recipe-quantity', 'text', 'span-block');
    quantity.textContent = i.quantity;

    li.appendChild(name);
    li.appendChild(quantity);

    recipeIngridients.appendChild(li);
  });
};

const showBookmarks = () => {
  Helper.clearChildren(app);

  const div = document.createElement('div');
  div.classList.add('bookmarks-content');

  const h2 = document.createElement('h2');
  h2.textContent = 'Bookmarks';
  h2.classList.add('bookmarks-title', 'title');

  const ul = document.createElement('ul');
  ul.classList.add('bookmarks-list');

  const bookmarks = JSON.parse(window.localStorage.getItem('id'));

  if (bookmarks.length !== 0) {
    bookmarks.forEach((id) => {
      recipesContainer.getRecipeById(id).then((recipe) => {
        const li = document.createElement('li');
        li.classList.add('bookmarks-card');
        li.setAttribute('data-id', recipe.id);

        const img = document.createElement('img');
        img.classList.add('bookmarks-img');
        img.src = recipe.image;

        img.onclick = () => {
          viewRecipe(recipe);
        };

        const span = document.createElement('span');
        span.classList.add('bookmarks-text', 'text');
        span.textContent = recipe.name;

        span.onclick = () => {
          viewRecipe(recipe);
        };

        const markedBtn = document.createElement('span');
        markedBtn.textContent = 'Marked';
        markedBtn.classList.add('bookmarks-status', 'span-block', 'text');

        markedBtn.onclick = () => {
          bookmarks.some((el, i, arr) => {
            if (el == recipe.id) {
              arr.splice(i, 1);

              window.localStorage.setItem('id', JSON.stringify(arr));
              showBookmarks();

              return true;
            }
          });
        };

        li.appendChild(img);
        li.appendChild(span);
        li.appendChild(markedBtn);
        ul.appendChild(li);
      });
    });
  }

  div.appendChild(h2);
  div.appendChild(ul);
  app.appendChild(div);
};

const showInfo = (recipe) => {
  const infoIngridients = document.querySelector('.info-ingridients');

  Helper.clearChildren(infoIngridients);

  selectedRecipe = recipe;

  infoImg.src = recipe.image;
  infoTitle.textContent = recipe.name;
  infoDescription.textContent = recipe.description;

  recipe.ingridients.forEach((i) => {
    const li = document.createElement('li');
    li.classList.add('info-item');

    const name = document.createElement('span');
    name.classList.add('info-item-name', 'text', 'span-block');
    name.textContent = i.name;

    const quantity = document.createElement('span');
    quantity.classList.add('info-item-quantity', 'text', 'span-block');
    quantity.textContent = i.quantity;

    li.appendChild(name);
    li.appendChild(quantity);

    infoIngridients.appendChild(li);
  });
};

const showCard = (recipe) => {
  const li = document.createElement('li');
  li.classList.add('recipes-card');
  li.setAttribute('data-id', recipe.id);

  const img = document.createElement('img');
  img.classList.add('recipes-img');
  img.src = recipe.image;

  const span = document.createElement('span');
  span.classList.add('recipes-text', 'text');
  span.textContent = recipe.name;

  const removeBtn = document.createElement('span');
  removeBtn.classList.add('recipes-remove', 'text');
  removeBtn.textContent = 'Remove';

  removeBtn.onclick = (e) => {
    e.target.parentNode.remove();
    recipesContainer.removeRecipeById(li.getAttribute('data-id'));
  };

  span.onclick = () => showInfo(recipe);
  img.onclick = () => showInfo(recipe);

  li.appendChild(img);
  li.appendChild(span);
  li.appendChild(removeBtn);
  document.querySelector('.recipes-list').appendChild(li);
};

const showRecipes = () => {
  Helper.clearChildren(app);

  app.innerHTML = Templates.recipesTemplate;

  recipesList = document.querySelector('.recipes-list');
  infoImg = document.querySelector('.info-img');
  infoTitle = document.querySelector('.info-title');
  infoDescription = document.querySelector('.info-description');
  infoIngridients = document.querySelector('.info-ingridients');

  // Add search
  searchInput = document.querySelector('.recipes-input');
  searchInput.addEventListener('input', (e) => {
    if (e.target.value !== '') {
      recipesContainer.getRecipeByName(e.target.value).then((response) => {
        Helper.clearChildren(recipesList);
        response.forEach((recipe) => {
          showCard(recipe);
        });
      });
    } else {
      showRecipes();
    }
  });

  // Open selected recipe's page
  infoButton = document.querySelector('.info-button');
  infoButton.addEventListener('click', () => {
    window.location.href = '#recipe';
  });

  // Add/mark selected recipe to bookmarks
  infoBookmark = document.querySelector('.info-bookmark');
  infoBookmark.addEventListener('click', (e) => {
    const hasId = bookmarks.some((id) => id == selectedRecipe.id);
    if (!hasId) {
      bookmarks.push(selectedRecipe.id);
      window.localStorage.setItem('id', JSON.stringify(bookmarks));
    }
  });

  // Show modal window for adding recipes
  addBtn = document.querySelector('.btn-add-card');
  addBtn.addEventListener('click', toggleModal);

  recipesContainer.getAllRecipes().then((arr) => {
    const randomRecipe = arr[Math.floor(Math.random() * (arr.length - 0)) + 0];

    showInfo(randomRecipe);

    arr.forEach((recipe) => {
      showCard(recipe);
    });
  });
};

const addRecipe = (name, image, description, ingridients) => {
  console.log(1);
  recipesContainer.addRecipe(new Recipe(name, image, description, ingridients)).then((response) => {
    if (response !== null) {
      showCard(response);
    }
  });
};

// Window handlers
window.addEventListener('hashchange', onRouteChanged);
// Load main page
window.addEventListener('load', showRecipes);
window.addEventListener('scroll', (e) => {
  var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  var scrolled = (winScroll / height) * 100;

  document.querySelector('.scrollbar-status').style.width = scrolled + '%';
});

let dirScroll = 0;
window.addEventListener('scroll', (e) => {
  const heigth = header.getClientRects()[0].height;

  if (document.documentElement.scrollTop > heigth) {
    header.style.top = '-' + heigth + 'px';
  }
  if (!(window.pageYOffset > dirScroll)) {
    header.style.top = 0;
  }

  dirScroll = window.pageYOffset;
});

// Modal window handlers
overlay.addEventListener('click', () => {
  toggleModal();
});

// Send data from modal form
modalSubmitBtn.addEventListener('click', () => {
  const name = modalName.value;
  const image = modalImage.value;
  const description = modalDescription.value;
  const ingridients = [];

  const modalIngridients = document.querySelectorAll('.modal-ingridient');

  if (modalIngridients) {
    modalIngridients.forEach((i) => {
      ingridients.push({ name: i.children.ingridient.value, quantity: i.children.quantity.value });
    });
  }

  addRecipe(name, image, description, ingridients);
});

// Get data from modal form
modalAddIngridientBtn.addEventListener('click', () => {
  const modalIngridient = document.createElement('div');
  modalIngridient.classList.add('modal-ingridient');

  modalIngridient.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-remove')) {
      e.target.parentNode.remove();
    }
  });

  const ingridientInput = document.createElement('input');
  ingridientInput.classList.add('modal-control', 'modal-name');
  ingridientInput.type = 'text';
  ingridientInput.placeholder = 'Ingridient';
  ingridientInput.name = 'ingridient';

  const quantityInput = document.createElement('input');
  quantityInput.classList.add('modal-control', 'modal-image');
  quantityInput.type = 'text';
  quantityInput.placeholder = 'Quantity';
  quantityInput.name = 'quantity';

  const removeBtn = document.createElement('button');
  removeBtn.classList.add('btn', 'modal-remove');
  removeBtn.textContent = 'Remove';

  modalIngridient.appendChild(ingridientInput);
  modalIngridient.appendChild(quantityInput);
  modalIngridient.appendChild(removeBtn);

  form.appendChild(modalIngridient);
});

modalCloseBtn.addEventListener('click', toggleModal);
