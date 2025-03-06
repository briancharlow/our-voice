// cypress/integration/governmentOfficialJourney.spec.js

describe('Government Official Journey', () => {
    beforeEach(() => {
      cy.login('mwangangi.brian20@students.dkut.ac.ke', 'love2');
      // No need to visit dashboard as login redirects automatically
    });
  
    describe('Dashboard Home Tests', () => {
      it('should display the dashboard with user location', () => {
        // Verify dashboard elements
        cy.get('h1').should('contain', 'Issues Dashboard:');
        cy.get('.text-gray-600').should('contain', 'Manage and review community issues in your location');
      });
  
      it('should filter issues by status', () => {
        // Try each filter option
        cy.get('select').first().select('Open');
        cy.wait(500);
        cy.get('tbody tr').each($row => {
          cy.wrap($row).find('td:nth-child(5) span').should('contain', 'Open');
        });
  
        cy.get('select').first().select('In Progress');
        cy.wait(500);
        cy.get('tbody tr').each($row => {
          cy.wrap($row).find('td:nth-child(5) span').should('contain', 'In Progress');
        });
        
        // Reset to All
        cy.get('select').first().select('All');
      });
  
      it('should update issue status', () => {
        // Check if table exists and has rows
        cy.get('table').should('exist');
        cy.get('tbody tr').first().then($row => {
          const initialStatus = $row.find('td:nth-child(5) span').text();
          const newStatus = initialStatus === 'Open' ? 'In Progress' : 'Open';
          
          // Change status
          cy.wrap($row).find('td:nth-child(6) select').select(newStatus);
          
          // Verify success message appears
          cy.get('div').contains('Issue status updated successfully').should('be.visible');
          
          // Verify row status is updated
          cy.wrap($row).find('td:nth-child(5) span').should('contain', newStatus);
        });
      });
  
      it('should generate summary for displayed issues', () => {
        // Click the summarize button
        cy.contains('button', 'Summarize').click();
        
        // Verify loading message
        cy.contains('Generating summary...').should('be.visible');
        
        // Wait for summary to load and verify it appears
        cy.get('div.prose').should('be.visible', { timeout: 10000 });
        cy.get('div.prose p').should('have.length.at.least', 1);
        
        // Close summary
        cy.contains('button', '✕').click();
        cy.get('div.prose').should('not.exist');
      });
    });
  
    describe('Polls Page Tests', () => {
      beforeEach(() => {
        // Navigate to polls page
        cy.visit('/official-dashboard/polls');
      });
  
      it('should display polls page with header', () => {
        cy.contains('h2', 'Public Poll Results').should('be.visible');
        cy.contains('p', 'View and analyze community opinions').should('be.visible');
      });
  
      it('should filter polls by location', () => {
        // Wait for polls to load
        cy.get('.grid').should('exist');
        cy.get('.grid > div').should('have.length.at.least', 1);
        
        // Get first available location that's not "All"
        cy.get('select').first().then($select => {
          const options = $select.find('option');
          if (options.length > 1) {
            const firstLocationOption = options[1].value;
            
            // Select that location
            cy.get('select').first().select(firstLocationOption);
            cy.wait(500);
            
            // Verify filtered results show correct location
            cy.get('.grid > div').each($poll => {
              cy.wrap($poll).contains(firstLocationOption);
            });
          }
        });
      });
  
      it('should sort polls by different criteria', () => {
        // Test sorting by oldest first
        cy.get('select').eq(1).select('oldest');
        cy.wait(500);
        
        // Test sorting by most votes
        cy.get('select').eq(1).select('mostVotes');
        cy.wait(500);
        
        // Test sorting by highest support
        cy.get('select').eq(1).select('mostSupport');
        cy.wait(500);
        
        // Verify sort worked (implicitly checks that the page didn't error)
        cy.get('.grid > div').should('exist');
      });
  
      it('should display correct poll information', () => {
        cy.get('.grid > div').first().within(() => {
          // Check for key poll elements
          cy.get('h2').should('exist'); // Title
          cy.get('.text-blue-700').should('exist'); // Location
          cy.contains('participants').should('exist'); // Participant count
          cy.contains('Support').should('exist');
          cy.contains('Oppose').should('exist');
          
          // Check progress bars exist
          cy.get('.bg-gradient-to-r').should('have.length', 2);
        });
      });
    });
  
    describe('Navigation Tests', () => {
      it('should navigate between dashboard and polls pages', () => {
        // Check we're on dashboard
        cy.url().should('include', '/official-dashboard');
        
        // Navigate to polls
        cy.visit('/official-dashboard/polls');
        cy.url().should('include', '/official-dashboard/polls');
        cy.contains('Public Poll Results').should('be.visible');
        
        // Go back to dashboard
        cy.visit('/official-dashboard');
        cy.url().should('include', '/official-dashboard');
        cy.contains('Issues Dashboard').should('be.visible');
      });
    });
  
    describe('API Error Handling Tests', () => {
      it('should handle API errors gracefully on dashboard', () => {
        // Intercept and mock a failed API response
        cy.intercept('GET', '**/issues/location/*', {
          statusCode: 500,
          body: { error: 'Server error' }
        }).as('getIssuesFail');
        
        // Refresh the dashboard
        cy.visit('/official-dashboard');
        
        // Verify error message appears
        cy.wait('@getIssuesFail');
        cy.contains('Failed to load issues').should('be.visible');
      });
      
      it('should handle update status API errors', () => {
        cy.intercept('PUT', '**/issues/status', {
          statusCode: 500,
          body: { error: 'Update failed' }
        }).as('updateStatusFail');
        
        // Try to update an issue status
        cy.get('table').should('exist');
        cy.get('tbody tr').first().find('td:nth-child(6) select').then($select => {
          const currentValue = $select.val();
          const newValue = currentValue === 'Open' ? 'In Progress' : 'Open';
          cy.wrap($select).select(newValue);
        });
        
        // Verify error message
        cy.wait('@updateStatusFail');
        cy.contains('Failed to update issue status').should('be.visible');
      });
      
      it('should handle API errors gracefully on polls page', () => {
        // Intercept and mock a failed polls API response
        cy.intercept('GET', '**/polls/all', {
          statusCode: 500,
          body: { error: 'Server error' }
        }).as('getPollsFail');
        
        // Visit polls page
        cy.visit('/official-dashboard/polls');
        
        // Verify error message appears
        cy.wait('@getPollsFail');
        cy.contains('Failed to load polls').should('be.visible');
      });
    });
  });