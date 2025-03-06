

describe('Citizen Journey', () => {
    beforeEach(() => {
      cy.login('briankyalo416@gmail.com', 'Love2');
      // No need to visit dashboard as login redirects automatically
    });
  
   
    describe('Civic Education', () => {
      it('should display documents and navigate to chat', () => {
          cy.visit('/citizen-dashboard/civic-education');

          // Check if at least one document is displayed
          cy.get('.text-lg.font-medium.text-gray-800').should('exist');

          // Click on the first document's chat button
          cy.get('button').contains('Chat Docs...').first().click();

          // Verify navigation to chat page
          cy.url().should('include', '/citizen-dashboard/chat-docs/');

          // Check if document title and description appear on the chat page
          cy.get('.text-xl.font-bold').should('exist'); // Title
          cy.get('.text-gray-600').should('exist'); // Description
      });
    });
  
  
    describe('Document Chat', () => {
      it('should allow asking questions to a document', () => {
        // Navigate to a document chat
        cy.visit('/citizen-dashboard/civic-education');
        cy.contains('Chat Docs').first().click();
        
        // Ask a question
        cy.get('input[placeholder="Ask anything..."]').type('What is this document about?');
        cy.get('button[type="submit"]').click();
        
        // Verify the question appears and wait for a response
        cy.contains('What is this document about?').should('exist');
        cy.get('.text-left').should('exist');
      });
    });
  
    describe('Polls', () => {
      it('should display polls', () => {
        cy.visit('/citizen-dashboard/polls');
        
        // Check for polls heading
        cy.contains('Current Public Polls').should('exist');
        
        // Either polls exist or "no polls" message is shown
        cy.get('body').then($body => {
          if ($body.text().includes('No active polls available')) {
            cy.contains('No active polls available').should('exist');
          } else {
            // At least one poll exists
            cy.get('h3').should('exist');
          }
        });
      });
  
      it('should attempt to vote in a poll if available', () => {
        cy.visit('/citizen-dashboard/polls');
        
        // Check if there are any polls where we haven't voted
        cy.get('body').then($body => {
          // If there are polls and we haven't voted in at least one
          if (!$body.text().includes('No active polls available')) {
            // Try to vote in the first available poll
            cy.contains('Support').first().click();
          }
        });
      });
    });
  
    describe('Report Issue', () => {
      it('should submit a basic issue report', () => {
        cy.visit('/citizen-dashboard/report-issue');
        
        // Fill the simple form
        cy.get('input[name="title"]').type('Test Issue');
        cy.get('select[name="category"]').select('Infrastructure');
        cy.get('input[name="location"]').type('Nairobi');
        cy.get('textarea[name="content"]').type('Test issue description');
        
        // Submit the form
        cy.get('button[type="submit"]').click();
        
        // Check for success message
        cy.contains('Issue reported successfully').should('exist');
      });
    });
  
    describe('Basic Citizen Journey', () => {
      it('should navigate through the main features', () => {
        // Check dashboard after login
        cy.contains('Dashboard').should('exist');
        
        // 1. Visit civic education
        cy.visit('/citizen-dashboard/civic-education');
        cy.contains('Chat Docs').should('exist');
        
        // 2. Visit polls
        cy.visit('/citizen-dashboard/polls');
        cy.contains('Current Public Polls').should('exist');
        
        // 3. Visit report issue
        cy.visit('/citizen-dashboard/report-issue');
        cy.contains('Submit Report').should('exist');
      });
    });
  });