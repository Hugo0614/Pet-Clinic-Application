// Cypress custom commands
// Add your custom commands here

/// <reference types="cypress" />

// Example:
// Cypress.Commands.add('login', (username: string, password: string) => { ... })

declare global {
  namespace Cypress {
    interface Chainable {
      // Add custom command declarations here
      // Example: login(username: string, password: string): Chainable<void>
    }
  }
}

export {};
