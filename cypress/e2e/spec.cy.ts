describe('My First Test', () => {
  it('Visits the form page', () => {
    cy.visit('/');
    cy.contains('Lening aanvragen');
  });
});
