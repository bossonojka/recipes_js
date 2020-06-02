module.exports = {
  clearChildren(parent) {
    while (parent.hasChildNodes()) {
      parent.firstChild.remove();
    }
  },
};
