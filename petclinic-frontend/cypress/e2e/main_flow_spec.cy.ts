describe('Pet Clinic E2E - Main User Flow', () => {
  // Generate unique credentials for this test run
  const timestamp = Date.now();
  const username = `testowner${timestamp}`;
  const password = 'TestPassword123';
  const petName = `Fluffy${timestamp}`;

  it('should complete the full owner journey: register -> login -> add pet', () => {
    // Step 1: Visit the home page
    cy.visit('/');
    cy.contains('Welcome to Pet Clinic').should('be.visible');

    // Step 2: Navigate to Register page
    cy.contains('Register').click();
    cy.url().should('include', '/register');

    // Step 3: Register a new Pet Owner account
    cy.get('input[placeholder="Username"]').type(username);
    cy.get('input[placeholder="Password"]').type(password);
    cy.get('select').select('OWNER');
    cy.get('button[type="submit"]').click();

    // Step 4: Should be redirected to Owner Dashboard after successful registration
    cy.url().should('include', '/owner', { timeout: 10000 });
    cy.contains('My Pets').should('be.visible');

    // Step 5: Add a new pet
    cy.contains('Add Pet').click();
    
    // Fill in the pet form in the modal
    cy.get('input[placeholder="Pet Name"]').type(petName);
    cy.get('input[placeholder*="Species"]').type('Dog');
    cy.get('input[placeholder="Breed"]').type('Golden Retriever');
    cy.get('input[type="date"]').type('2020-01-15');
    
    // Submit the form
    cy.get('form').within(() => {
      cy.get('button[type="submit"]').click();
    });

    // Step 6: Verify the pet appears on the dashboard
    cy.contains(petName, { timeout: 10000 }).should('be.visible');
    cy.contains('Dog').should('be.visible');
    cy.contains('Golden Retriever').should('be.visible');
  });
});
